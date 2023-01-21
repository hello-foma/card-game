import { Card } from './card.model';

export type DeckProps = {
  deck_id: string;
  remaining: number;
  cards?: Card[]
}

export class Deck {
  deck_id: string;
  remaining: number;
  cards: Card[];

  constructor(props: DeckProps) {
    const { deck_id, remaining, cards } = props;
    this.deck_id = deck_id;
    this.remaining = remaining;
    this.cards = cards || [];
  }

  get isCardsHidden(): boolean {
    return this.remaining !== 0 && this.cards.length === 0;
  }
}
