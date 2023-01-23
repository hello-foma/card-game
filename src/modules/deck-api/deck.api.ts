import { HttpProvider } from '@shared/services/http-provider';

import { DeckApiResponse, DeckApiResponseFull } from '@modules/deck-api/response.type';
import { CurrentBoardState, User } from '@modules/board/slice';
import {
  CardToken,
  mainDeckCards,
} from './card-tokens';

export class DeckApi {
  private static reservedPileName = {
    ping: '_ping_',
    host: '_host_',
    user: '_user_',
    name: '_name_',
  }

  static parseBoardState(deck: DeckApiResponseFull): CurrentBoardState {
    return {
      deckId: deck.deck_id,
      hostId: DeckApi.extractHost(deck),
      players: null,
      status: null,
      users: DeckApi.extractUsers(deck),
    }
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

  private static extractUsers(deck: DeckApiResponseFull): User[] | null {
    const pilesKeys = Object.keys(deck.piles);
    const userIdList = [];

    for (let i = 0; i < pilesKeys.length; i++) {
      const key = pilesKeys[i];
      const isUser = key.startsWith(DeckApi.reservedPileName.user);

      if (isUser) {
        userIdList.push(key.substring(DeckApi.reservedPileName.user.length));
      }
    }

    if (userIdList.length === 0) {
      return null;
    }

    const userNameKeys = pilesKeys.filter((key) => key.startsWith(DeckApi.reservedPileName.name));

    const userNames = userNameKeys.reduce((hash, key) => {
      const [userId, timestamp, name] = key.substring(DeckApi.reservedPileName.name.length).split('_');
      const isAlreadySet = Array.isArray(hash[userId]);
      const keepLastName = isAlreadySet && hash[userId][1] > Number(timestamp);

      hash[userId] = keepLastName ? hash[userId] : [name, Number(timestamp)];

      return hash;
    }, {} as {[userId: string]: [string, number]});

    const users: User[] = userIdList.map((id) => ({
      id,
      name: userNames[id][0]
    }));

    return users;
  }

  private static tapPile(deckId: string, pileName: string): Promise<DeckApiResponseFull> {
    return DeckApi.addToPile(deckId, pileName);
  }

  private static addToPile(deckId: string, pileName: string, cards?: CardToken[]): Promise<DeckApiResponseFull> {
    return HttpProvider.get<DeckApiResponseFull>(
      `https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileName}/add/`, {
        cards: cards && cards.join(',') || 'X1'
      });
  }

  private static drawCards(deckId: string, count = 1): Promise<DeckApiResponseFull> {
    return HttpProvider.get<DeckApiResponseFull>(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/`, {
        count
      });
  }

  private static async assignHost(deckId: string, hostId: string) {
    return DeckApi.addToPile(deckId, `${DeckApi.reservedPileName.host}${hostId}`);
  }

  static async assignUser(deckId: string, userId: string, name: string): Promise<DeckApiResponseFull> {
    await DeckApi.addToPile(deckId, `${DeckApi.reservedPileName.user}${userId}`);

    return DeckApi.changeName(deckId, userId, name);
  }

  static async createDeck(hostId: string, userName: string): Promise<DeckApiResponseFull> {
    const deck = await HttpProvider.get<DeckApiResponse>('https://deckofcardsapi.com/api/deck/new', {
      cards: [...mainDeckCards].join(',')
    });
    const deckId = deck.deck_id;

    await DeckApi.assignHost(deckId, hostId);
    return await DeckApi.assignUser(deckId, hostId, userName);
  }

  static async pingDeck(id: string): Promise<DeckApiResponseFull> {
    return await DeckApi.tapPile(id, `${DeckApi.reservedPileName.ping}`);
  }

  static async changeName(deckId: string, userId: string, name: string): Promise<DeckApiResponseFull> {
    return await DeckApi.tapPile(deckId, `${DeckApi.reservedPileName.name}${userId}_${Date.now()}_${name}`);
  }
}
