import { HttpProvider } from '@shared/services/http-provider';

import { DeckProps } from './deck.model';
import { DeckApiResponse, DeckApiResponseFull } from '@modules/deck-api/response.type';
import { CurrentBoardState } from '@modules/boards/slice';

export class DeckApi {
  private static reservedPileName = {
    ping: '_ping_',
    host: '_host_',
  }

  private static extractHost(deck: DeckApiResponseFull): string | null {
    const pilesKeys = Object.keys(deck.piles);

    for (let i = 0; i < pilesKeys.length; i++) {
      const key = pilesKeys[i];
      const isHost = key.startsWith(DeckApi.reservedPileName.host);

      if (isHost) {
        return key.substring(DeckApi.reservedPileName.host.length);
      }
    }

    return null;
  }

  private static async assignHost(deckId: string, hostId: string) {
    await HttpProvider.get<DeckProps>(
      `https://deckofcardsapi.com/api/deck/${deckId}/pile/${DeckApi.reservedPileName.host}${hostId}/add/`, {
      cards: 'AS'
    });
  }

  static async createDeck(hostId: string): Promise<CurrentBoardState> {
    const deck = await HttpProvider.get<DeckApiResponse>('https://deckofcardsapi.com/api/deck/new/shuffle', {
      deck_count: 1
    });
    await DeckApi.assignHost(deck.deck_id, hostId);

    return DeckApi.pingDeck(deck.deck_id);
  }

  static async pingDeck(id: string): Promise<CurrentBoardState> {
    const deck = await HttpProvider.get<DeckApiResponseFull>(
      `https://deckofcardsapi.com/api/deck/${id}/pile/${DeckApi.reservedPileName.ping}/add/`, {
      cards: 'AS'
    });

    return {
      deckId: deck.deck_id,
      hostId: DeckApi.extractHost(deck),
      players: null,
      status: null,
    }
  }
}
