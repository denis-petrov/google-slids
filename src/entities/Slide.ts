import {isSlideBackground} from './SlideBackground'
import {Color} from './Color'
import {Element, ImageElement} from './Elements'

export type {
    Slide
}
export {
    isSlide
}

type Slide = {
    id: string,
    elements: Array<Element>,
    background: Color | ImageElement,
    selectionElementsId: Array<string>
}

function isSlide(argument: any): argument is Slide {
    return argument.id !== undefined && typeof argument.id === 'number'
        && argument.elements !== undefined
        && argument.background !== undefined && isSlideBackground(argument.background);
}
