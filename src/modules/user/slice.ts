import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, takeLatest } from 'redux-saga/effects';
import { generateUUID } from '@shared/services/uuid';
import { LocalStorageSync } from '@shared/services/local-storage-sync';
import { RootState } from '@shared/types/root-state';

const sliceName = 'user';
let slicePath: string;

type UserState = {
  uuid: string | null
}

const initialState: UserState = {
  uuid: null
};

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    requestId: (state) => state,
    setId: (state, {payload}: PayloadAction<string> ) => {state.uuid = payload}
  }
});

export const { requestId } = slice.actions;

export const selectors = {
  selectSlice: (state: RootState) => state[slicePath] as UserState,
  selectId: (state: RootState) => selectors.selectSlice(state).uuid
};

export const saga = [
  takeLatest(slice.actions.requestId, function* () {
    const uuid = generateUUID();

    yield LocalStorageSync.putState<UserState>(slicePath, { uuid });
    yield put(slice.actions.setId(uuid));
  }),
];

export default (path: string) => {
  slicePath = path;

  return slice.reducer;
}
