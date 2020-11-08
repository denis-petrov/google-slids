import {TextStyle} from './TextStyle'
import {Point} from './Point'
import {Color} from './Color'

export type {
    Element,
    Text,
    ImageElement
}

enum ElementType {
    text,
    triangle,
    rectangle,
    ellipse,
    image
}

export {
    ElementType
}


type Element = {
    id: string;
    center: Point;
    topLeftPoint: Point;
    bottomRightPoint: Point;
    borderColor: Color;
    borderWidth: number;
    backgroundColor: Color | null;
    type: ElementType
}

type Text = Element & {
    text: string,
    textStyle: TextStyle,
    type: ElementType.text,
}

type ImageElement = Element & {
    base64: string,
    type: ElementType.image
}
