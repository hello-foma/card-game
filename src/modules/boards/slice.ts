import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, takeLatest, select } from 'redux-saga/effects';
import { push } from 'redux-first-history';

import { DeckApi } from '@modules/deck-api/deck.api';
import { rootRoutePath, RootState } from '@shared/types/root-state';
import { requestId, selectors as userSelectors } from '@modules/user/slice';

const name = 'currentBoard';
// todo: reduce slicePath and make an order with exports. (Separate exports to diff files?)
let slicePath: string; // init when connect reducer
type BoardStatus = any;
type Player = any;

export type CurrentBoardState = {
  hostId: string | null,
  deckId: string | null,
  status: BoardStatus | null,
  players: Player[] | null,
};
const initialState: CurrentBoardState = {
  hostId: null,
  deckId: null,
  status: null,
  players: null,
};

const slice = createSlice({
  name,
  initialState: () => initialState,
  reducers: {
    requestCreate: ( state) => state,
    set:( state, { payload }: PayloadAction<CurrentBoardState>) => {
      state = {...state, ...payload};

      return state;
    },
    tryToSetActive: (state, {payload}: PayloadAction<string>) => state,
  }
});

export const { requestCreate, set, tryToSetActive } = slice.actions;

export const selectors = {
  selectSlice: (rootState: RootState) => rootState[slicePath] as CurrentBoardState,
  isHost: (hostId: string | null) => (rootState: RootState) => hostId !== null && selectors.selectSlice(rootState).hostId === hostId
};

export const saga = [
  takeLatest(requestCreate.type, function* () {
    // todo handle error
    let userId: string = yield select(userSelectors.selectId);
    if (userId === null) {
      yield put(requestId());
      userId = yield select(userSelectors.selectId);
    }
    const deck: CurrentBoardState = yield DeckApi.createDeck(userId);

    yield put(set(deck));
  }),
  takeLatest(tryToSetActive.type, function* ({payload}: PayloadAction<string>) {
    try {
      const currentState: CurrentBoardState = yield select(selectors.selectSlice);
      if (currentState.deckId === payload) {
        return;
      }

      const state: CurrentBoardState = yield DeckApi.pingDeck(payload);
      yield put(slice.actions.set(state));
    } catch (e) {
      yield put(slice.actions.set(initialState));
      // todo add notification channel
      yield put(push(rootRoutePath));
    }
  })
];

export default (path: string) => {
  slicePath = path;

  return slice.reducer;
};
