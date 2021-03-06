import {Slide} from './Slide'

export type {
    Presentation
}
export {
    isPresentation
}

type Presentation = {
    name: string,
    slides: Array<Slide>
}

function isPresentation(argument: any): argument is Presentation {
    return argument.slides !== undefined &&
        (typeof argument.slides[0] === 'number' || argument.slides.length === 0)
}