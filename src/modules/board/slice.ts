import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, takeLatest, select, take, delay } from 'redux-saga/effects';
import { push } from 'redux-first-history';

import { DeckApi } from '@modules/deck-api/deck.api';
import { rootRoutePath, RootState } from '@shared/types/root-state';
import { requestNewUser, selectors as userSelectors, updateName, UserState } from '@modules/user/slice';
import { DeckApiResponseFull } from '@modules/deck-api/response.type';

const name = 'currentBoard';
// todo: reduce slicePath and make an order with exports. (Separate exports to diff files?)
let slicePath: string; // init when connect reducer
type BoardStatus = any;
type Player = any;
export type User = {
  id: string,
  name: string
};

export type CurrentBoardState = {
  hostId: string | null,
  deckId: string | null,
  status: BoardStatus | null,
  players: Player[] | null,
  users: User[] | null,
  isPolling: boolean | null,
};
const initialState: CurrentBoardState = {
  hostId: null,
  deckId: null,
  status: null,
  players: null,
  users: null,
  isPolling: null
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
    requestSyncPolling: (state) => {state.isPolling = true},
    cancelSyncPolling: (state) => {state.isPolling = false},
  }
});

export const { requestCreate, set, tryToSetActive, tryAssignCurrentUser, requestSyncPolling, cancelSyncPolling } = slice.actions;

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

      return users.some(user => user.id === userId);
    },
    selectIsPolling: (rootState: RootState) => selectors.selectSlice(rootState).isPolling,
  }
;

export const saga = [
  takeLatest(requestCreate.type, function* () {
    // todo handle error
    let user: UserState = yield select(userSelectors.selectSlice);

    if (user.uuid === null) {
      yield put(requestNewUser());
      user = yield select(userSelectors.selectSlice);
    }

    if (user.uuid === null || user.name === null) {
      throw new Error('Empty user');
    }

    const deck: DeckApiResponseFull = yield DeckApi.createDeck(user.uuid, user.name);

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

    const user: UserState = yield select(userSelectors.selectSlice);
    const isAlreadyAssigned: boolean = yield select(selectors.isUser(user.uuid));

    if (isAlreadyAssigned) {
      return;
    }

    if (user.uuid === null || user.name === null) {
      throw Error('Empty user');
    }

    const res: DeckApiResponseFull = yield DeckApi.assignUser(deckId, user.uuid, user.name);
    yield put(slice.actions.set(DeckApi.parseBoardState(res)))
  }),
  takeLatest(updateName, function* ({payload}) {
    const user: UserState = yield select(userSelectors.selectSlice);
    const boardId: string= yield select(selectors.selectBoardId);

    if (user.uuid === null) {
      throw new Error('Empty user');
    }

    const deckUpdate: DeckApiResponseFull = yield DeckApi.changeName(boardId, user.uuid, payload);

    yield put(slice.actions.set(DeckApi.parseBoardState(deckUpdate)));
  }),
  takeLatest(slice.actions.requestSyncPolling, function* () {
    const boardId: string = yield select(selectors.selectBoardId);
    let isPollingActive: boolean = yield select(selectors.selectIsPolling);
    while (boardId && isPollingActive) {
      yield delay(10 * 1000);
      const update: DeckApiResponseFull = yield DeckApi.pingDeck(boardId);

      yield put(slice.actions.set(DeckApi.parseBoardState(update)));
      isPollingActive = yield select(selectors.selectIsPolling);
    }
  }),
];

export default (path: string) => {
  slicePath = path;

  return slice.reducer;
};
