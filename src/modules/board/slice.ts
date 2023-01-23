import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, takeLatest, select, take } from 'redux-saga/effects';
import { push } from 'redux-first-history';

import { DeckApi } from '@modules/deck-api/deck.api';
import { rootRoutePath, RootState } from '@shared/types/root-state';
import { requestId, selectors as userSelectors } from '@modules/user/slice';
import { DeckApiResponseFull } from '@modules/deck-api/response.type';

const name = 'currentBoard';
// todo: reduce slicePath and make an order with exports. (Separate exports to diff files?)
let slicePath: string; // init when connect reducer
type BoardStatus = any;
type Player = any;
type User = string;

export type CurrentBoardState = {
  hostId: string | null,
  deckId: string | null,
  status: BoardStatus | null,
  players: Player[] | null,
  users: User[] | null
};
const initialState: CurrentBoardState = {
  hostId: null,
  deckId: null,
  status: null,
  players: null,
  users: null,
};

const slice = createSlice({
  name,
  initialState: () => initialState,
  reducers: {
    requestCreate: (state) => state,
    set: (state, {payload}: PayloadAction<CurrentBoardState>) => {
      state = {...state, ...payload};

      return state;
    },
    tryToSetActive: (state, {payload}: PayloadAction<string>) => state,
    tryAssignCurrentUser: (state) => state,
  }
});

export const { requestCreate, set, tryToSetActive, tryAssignCurrentUser } = slice.actions;

export const selectors = {
  selectSlice: (rootState: RootState) => rootState[slicePath] as CurrentBoardState,
  selectBoardId: (rootState: RootState) => selectors.selectSlice(rootState).deckId,
  selectUsers: (rootState: RootState) => selectors.selectSlice(rootState).users,
  isHost: (hostId: string | null) => (rootState: RootState) => hostId !== null && selectors.selectSlice(rootState).hostId === hostId,
  isUser: (userId: string | null) => (rootState: RootState) => {
    if (userId === null) {
      return false;
    }
    const users = selectors.selectUsers(rootState);

    if (users === null) {
      return false;
    }

    return users.includes(userId);
  }
};

export const saga = [
  takeLatest(requestCreate.type, function* () {
    // todo handle error
    let userId: string = yield select(userSelectors.selectId);
    if (userId === null) {
      yield put(requestId());
      userId = yield select(userSelectors.selectId);
    }
    const deck: DeckApiResponseFull = yield DeckApi.createDeck(userId);

    yield put(set(DeckApi.parseBoardState(deck)));
  }),
  takeLatest(tryToSetActive.type, function* ({payload}: PayloadAction<string>) {
    try {
      const currentState: CurrentBoardState = yield select(selectors.selectSlice);
      if (currentState.deckId === payload) {
        return;
      }

      const state: DeckApiResponseFull = yield DeckApi.pingDeck(payload);
      yield put(slice.actions.set(DeckApi.parseBoardState(state)));
    } catch (e) {
      yield put(slice.actions.set(initialState));
      // todo add notification channel
      yield put(push(rootRoutePath));
    }
  }),
  takeLatest(slice.actions.tryAssignCurrentUser, function* () {
    let deckId: string | null = yield select(selectors.selectBoardId);

    while (deckId === null) {
      const {payload: state} = yield take(slice.actions.set);
      deckId = state.deckId
    }

    const userId: string = yield select(userSelectors.selectId);
    const isAlreadyAssigned: boolean = yield select(selectors.isUser(userId));

    if (isAlreadyAssigned) {
      return;
    }

    const res: DeckApiResponseFull = yield DeckApi.assignUser(deckId, userId);
    yield put(slice.actions.set(DeckApi.parseBoardState(res)))
  }),
];

export default (path: string) => {
  slicePath = path;

  return slice.reducer;
};
