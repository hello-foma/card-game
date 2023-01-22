import { HttpProvider } from '@shared/services/http-provider';

import { DeckProps } from './deck.model';
import { DeckApiResponse } from '@modules/deck-api/response.type';

export class DeckApi {
  private static reservedPileName = {
    ping: '_ping_',
    host: '_host_',
  }

  private static async assignHost(deckId: string, hostId: string) {
    await HttpProvider.get<DeckProps>(
      `https://deckofcardsapi.com/api/deck/${deckId}/pile/${DeckApi.reservedPileName.host}${hostId}/add/`, {
      cards: 'AS'
    });
  }

  static async createDeck(hostId: string): Promise<DeckProps> {
    const deck = await HttpProvider.get<DeckApiResponse>('https://deckofcardsapi.com/api/deck/new/shuffle', {
      deck_count: 1
    });
    await DeckApi.assignHost(deck.deck_id, hostId);

    return {
      id: deck.deck_id,
      hostId: hostId
    }
  }

  static async pingDeck(id: string): Promise<void> {
    await HttpProvider.get(
      `https://deckofcardsapi.com/api/deck/${id}/pile/${DeckApi.reservedPileName.ping}/add/`, {
      cards: 'AS'
    });
  }
}
