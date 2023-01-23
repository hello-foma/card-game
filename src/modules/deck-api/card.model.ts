import { CardValue } from './card-value.enum';
import { CardSuit } from './card-suit.enum';

export type CardProps = {
  code: string;
  image: string;
  images: {
    svg: string,
    png: string
  };
  value: CardValue;
  suit: CardSuit;
}

export class Card implements CardProps {
  code: string;
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
