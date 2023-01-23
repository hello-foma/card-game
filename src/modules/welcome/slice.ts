import { createSlice } from '@reduxjs/toolkit';
import { put, take, takeLatest } from 'redux-saga/effects';
import { push } from 'redux-first-history';

import { set as boardCreated, requestCreate as requestBoardCreate, CurrentBoardState } from '@modules/boards/slice';
import { LobbyRouteName } from 'modules/lobby/routes';

export type WelcomePageState = {
  isLoading: boolean
}

const initialState: WelcomePageState = {
  isLoading: false
}

const slice = createSlice({
  name: 'welcome-page',
  initialState,
  reducers: {
    requestCreate: (state) => {
      state.isLoading = true;
    },
    created: (state) => {
      state.isLoading = false;
    }
    // todo error state
  }
});

export const { requestCreate, created } = slice.actions;

export const saga = [
  takeLatest(requestCreate().type, function* () {
      yield put(requestBoardCreate());
      const { payload } = yield take(boardCreated.type);
      yield put(push(LobbyRouteName(payload.deckId as string)));
    }),
  ];

