import { CardValue } from './card-value.enum';
import { CardSuit } from './card-suit.enum';
import { CardToken } from './card-tokens';

export type CardProps = {
  code: CardToken;
  image: string;
  images: {
    svg: string,
    png: string
  };
  value: CardValue;
  suit: CardSuit;
}

export class Card implements CardProps {
  code: CardToken;
  image: string;
  images: {
    svg: string,
    png: string
  };
  value: CardValue;
  suit: CardSuit;

  constructor(props: CardProps) {
    const { code, image, images, value, suit } = props;

    this.code = code;
    this.image = image;
    this.images = images;
    this.value = value;
    this.suit = suit;
  }
}
