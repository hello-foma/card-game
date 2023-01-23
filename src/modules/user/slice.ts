import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, takeLatest } from 'redux-saga/effects';
import { generateUUID } from '@shared/services/uuid';
import { LocalStorageSync } from '@shared/services/local-storage-sync';
import { RootState } from '@shared/types/root-state';
import { NamesApi } from '@modules/names-api/names-api';

const sliceName = 'user';
let slicePath: string;

export type UserState = {
  uuid: string | null,
  name: string | null
}

const initialState: UserState = {
  uuid: null,
  name: null
};

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    requestNewUser: (state) => state,
    setUser: (state, {payload}: PayloadAction<UserState>) => payload,
  }
});

export const { requestNewUser } = slice.actions;

export const selectors = {
  selectSlice: (state: RootState) => state[slicePath] as UserState,
  selectId: (state: RootState) => selectors.selectSlice(state).uuid
};

export const saga = [
  takeLatest(slice.actions.requestNewUser, function* () {
    const uuid = generateUUID();
    const name: string = yield NamesApi.getName();
    const user: UserState = { uuid, name };

    yield LocalStorageSync.putState<UserState>(slicePath, user);
    yield put(slice.actions.setUser(user));
  }),
];

export default (path: string) => {
  slicePath = path;

  return slice.reducer;
}
