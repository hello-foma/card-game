import { PileProps } from '@modules/deck-api/pile.model';

export type DeckApiResponse = {
  success: true,
  deck_id: string,
  remaining: number
};

export type DeckApiResponseFull = {
  piles: {
    [pileName: string]: PileProps,
  }
} & DeckApiResponse;
