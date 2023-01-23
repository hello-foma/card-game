import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, select, takeLatest } from 'redux-saga/effects';
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
    updateName: (state, {payload}: PayloadAction<string>) => {
      state.name = payload
    }
  }
});

export const { requestNewUser, updateName } = slice.actions;

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
  takeLatest(slice.actions.updateName, function* ({payload}) {
      const user: UserState = yield select(selectors.selectSlice);

      const update: UserState = {
        ...user,
        name: payload
      };

      yield LocalStorageSync.putState<UserState>(slicePath, update);
    }
  ),
];

export default (path: string) => {
  slicePath = path;

  return slice.reducer;
}
