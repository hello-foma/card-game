import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, select, takeLatest } from 'redux-saga/effects';
import { RootState } from '@shared/types/root-state';
import { LocalStorageSync } from '@shared/services/local-storage-sync';
import { set } from '@modules/board/slice';

const sliceName = 'history';
let slicePath: string;

type HistoryRecord = {
  lastPlayedTimestamp: number,
  title: string,
  id: string
}

type HistoryState = {
  records: HistoryRecord[]
}

const initialState: HistoryState = {
  records: []
}

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    addItem: (state, {payload}: PayloadAction<HistoryRecord>) => {
      const alreadySavedItemIndex = state.records.findIndex((record) => record.id === payload.id);
      if (alreadySavedItemIndex !== -1) {
        state.records[alreadySavedItemIndex] = payload;
      } else {
        state.records.push(payload);
      }
    }
  }
});

export const selectors = {
  selectSlice: (state: RootState) => state[slicePath] as HistoryState,
  selectRecords: (state: RootState) => selectors.selectSlice(state).records
};

export const saga = [
  takeLatest(set, function* ({payload}) {
    if (payload.deckId === null) {
      return;
    }

    const record: HistoryRecord = {
      id: payload.deckId,
      lastPlayedTimestamp: Date.now(),
      title: new Date().toLocaleTimeString()
    };

    yield put(slice.actions.addItem(record));
    const state: HistoryState = yield select(selectors.selectSlice);
    yield LocalStorageSync.putState(slicePath, state);
  }),
];

export default (path: string) => {
  slicePath = path;

  return slice.reducer;
}
