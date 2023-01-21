import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, takeLatest } from 'redux-saga/effects';
import { push } from 'redux-first-history';

import { created as boardCreated, requestCreate as requestBoardCreate } from '@modules/boards/slice';
import { Board } from '@modules/boards/board.model';
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
    }),
    takeLatest(boardCreated.type, function* (action: PayloadAction<Board>) {
      yield put(created());
      const { payload } = action;
      const { id } = payload;

      yield put(push(LobbyRouteName(id)));
    }),
  ];

