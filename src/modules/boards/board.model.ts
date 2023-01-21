import { Deck } from '@modules/deck-api/deck.model';

export type BoardProps = {
  id: string;
  deck: Deck;
}

export class Board {
  id: string;
  deck: Deck

  constructor(props: BoardProps) {
    const { id, deck } = props;

    this.id = id;
    this.deck = deck;
  }
}
