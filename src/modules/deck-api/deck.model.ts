import { PileProps } from './pile.model';

export type DeckProps = {
  deck_id: string;
  remaining: number;
}
export type DeckPingProps = {
  piles: {
    [pileName: string]: PileProps,
    ping: PileProps
  }
} & DeckProps;

export class Deck {
  deck_id: string;
  remaining: number;

  constructor(props: DeckProps) {
    const { deck_id, remaining } = props;
    this.deck_id = deck_id;
    this.remaining = remaining;
  }
}
