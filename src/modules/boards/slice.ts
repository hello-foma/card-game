import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, takeLatest } from 'redux-saga/effects'
import { DeckApi } from '@modules/deck-api/deck.api';
import { Deck } from '@modules/deck-api/deck.model';

import { Board } from './board.model';

const name = 'currentBoard';

export type CurrentBoardState = {
  boards: Board[],
  activeBoard: string | null,
};
const initialState: CurrentBoardState = {
  boards: [],
  activeBoard: null,
};

const slice = createSlice({
  name,
  initialState: () => initialState,
  reducers: {
    requestCreate: ( state) => state,
    created:( state, { payload }: PayloadAction<Board>) => {
      state.boards.push(payload);
      state.activeBoard = payload.id;
    },
  }
});

export const { requestCreate, created } = slice.actions;

export const saga = [
  takeLatest(requestCreate.type, function* () {
    // todo handle error
    const deck: Deck = yield DeckApi.createDeck();
    const board = new Board({id: deck.deck_id, deck});

    yield put(created(board));
  })
];

export default slice.reducer;
