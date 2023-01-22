import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, takeLatest, select } from 'redux-saga/effects';
import { push } from 'redux-first-history';

import { DeckApi } from '@modules/deck-api/deck.api';
import { DeckProps } from '@modules/deck-api/deck.model';
import { LocalStorageSync } from '@shared/services/local-storage-sync';
import { rootRoutePath, RootState } from '@shared/types/root-state';
import { requestId, selectors as userSelectors } from '@modules/user/slice';

import { BoardProps } from './board.model';

const name = 'currentBoard';
// todo: reduce slicePath and make an order with exports. (Separate exports to diff files?)
let slicePath: string; // init when connect reducer

export type CurrentBoardState = {
  boards: BoardProps[],
  activeBoard: string | null,
};
const initialState: CurrentBoardState = {
  boards: [],
  activeBoard: null,
};

const slice = createSlice({
  name,
  initialState: () => initialState,
  reducers: {
    requestCreate: ( state) => state,
    created:( state, { payload }: PayloadAction<BoardProps>) => {
      state.boards.push(payload);
      state.activeBoard = payload.id;
    },
    tryToSetActive: (state, {payload}: PayloadAction<string>) => state,
    setActive: (state, {payload}: PayloadAction<string | null>) => {
      state.activeBoard = payload;
    }
  }
});

export const { requestCreate, created, tryToSetActive } = slice.actions;

export const selectors = {
  selectSlice: (rootState: RootState) => rootState[slicePath] as CurrentBoardState,
  selectBoards: (rootState: RootState) => selectors.selectSlice(rootState).boards,
  selectBoard: (boardId: string) =>
    (rootState: RootState) =>
      selectors.selectBoards(rootState).some((board) => board.id === boardId),
};

export const saga = [
  takeLatest(requestCreate.type, function* () {
    // todo handle error
    let userId: string = yield select(userSelectors.selectId);
    if (userId === null) {
      yield put(requestId());
      userId = yield select(userSelectors.selectId);
    }
    const deck: DeckProps = yield DeckApi.createDeck(userId);
    const board: BoardProps = {id: deck.id, deck};

    yield put(created(board));
  }),
  takeLatest(created.type, function* () {
    const boards: BoardProps[]  = yield select(selectors.selectBoards);

    yield LocalStorageSync.putState<CurrentBoardState>(slicePath, { boards })
  }),
  takeLatest(tryToSetActive.type, function* ({payload}: PayloadAction<string>) {
    const id = payload;
    const isBoardCached = yield select(selectors.selectBoard(id));
    if (isBoardCached) {
      yield put(slice.actions.setActive(id));
    } else {
      try {
        yield DeckApi.pingDeck(id);
        yield put(slice.actions.setActive(id));
      } catch (e) {
        yield put(slice.actions.setActive(null));
        // todo add notification channel
        yield put(push(rootRoutePath));
      }
    }
  })
];

export default (path: string) => {
  slicePath = path;

  return slice.reducer;
};
