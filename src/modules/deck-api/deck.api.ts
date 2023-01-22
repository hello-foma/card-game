import { HttpProvider } from '@shared/services/http-provider';

import { DeckProps } from './deck.model';

export class DeckApi {
  static async createDeck(): Promise<DeckProps> {
    return await HttpProvider.get<DeckProps>('https://deckofcardsapi.com/api/deck/new/shuffle', {
      deck_count: 1
    });
  }
}
