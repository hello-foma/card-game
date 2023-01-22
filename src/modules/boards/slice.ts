import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, takeLatest, select } from 'redux-saga/effects'
import { DeckApi } from '@modules/deck-api/deck.api';
import { DeckProps } from '@modules/deck-api/deck.model';

import { BoardProps } from './board.model';
import { LocalStorageSync } from '@shared/services/local-storage-sync';
import { RootState } from '@shared/types/root-state';

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
  }
});

export const { requestCreate, created } = slice.actions;

export const selectors = {
  selectSlice: (rootState: RootState) => rootState[slicePath] as CurrentBoardState,
  selectBoards: (rootState: RootState) => selectors.selectSlice(rootState).boards
};

export const saga = [
  takeLatest(requestCreate.type, function* () {
    // todo handle error
    const deck: DeckProps = yield DeckApi.createDeck();
    const board: BoardProps = {id: deck.deck_id, deck};

    yield put(created(board));
  }),
  takeLatest(created.type, function* () {
    const boards: BoardProps[]  = yield select(selectors.selectBoards);

    yield LocalStorageSync.putState<CurrentBoardState>(slicePath, { boards })
  })
];

export default (path: string) => {
  slicePath = path;

  return slice.reducer;
};
