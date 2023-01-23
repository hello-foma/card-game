export type DeckProps = {
  id: string;
  hostId: string;
}

export class Deck {
  id: string;

  constructor(props: DeckProps) {
    const { id } = props;

    this.id = id;
  }
}
