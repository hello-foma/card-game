import { HttpProvider } from '@shared/services/http-provider';

import { DeckPingProps, DeckProps } from './deck.model';

export class DeckApi {
  private static reservedPileName = {
    ping: 'ping'
  }

  static async createDeck(): Promise<DeckProps> {
    return await HttpProvider.get<DeckProps>('https://deckofcardsapi.com/api/deck/new/shuffle', {
      deck_count: 1
    });
  }

  static async pingDeck(id: string): Promise<DeckPingProps> {
    return await HttpProvider.get<DeckPingProps>(
      `https://deckofcardsapi.com/api/deck/${id}/pile/${DeckApi.reservedPileName.ping}/add/`, {
      cards: 'AS'
    });
  }
}
