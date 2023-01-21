import { HttpProvider } from '@shared/services/http-provider';

import { Deck, DeckProps } from './deck.model';

export class DeckApi {
  static async createDeck(): Promise<Deck> {
    const response = await HttpProvider.get<DeckProps>('https://deckofcardsapi.com/api/deck/new/shuffle', {
      deck_count: 1
    });

    return new Deck(response);
  }
}
