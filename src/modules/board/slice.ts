import { createSlice } from '@reduxjs/toolkit';

const name = 'currentBoard';

type Board = object;

export type CurrentBoardState = {
  // todo: make Board type
  board: Board | null
};
const initialState: CurrentBoardState = {
  board: null
};

const slice = createSlice({
  name,
  initialState: () => initialState,
  reducers: {
    requestCreate: (state) => state,
  }
});

export const { requestCreate } = slice.actions;

