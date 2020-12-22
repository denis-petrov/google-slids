import {store} from "../store/store"

export function getSelectedElement() {
    const editor = store.getState()
    const selectedSlideId = editor.selectionSlidesId[0]
    const selectedSlide = editor.presentation.slides.filter((slide) => {
        if (slide.id === selectedSlideId) {
            return slide
        }
    })[0]
    const selectedElementId = selectedSlide.selectionElementsId[0]
    return selectedSlide.elements.filter((elem) => {
        if (elem.id === selectedElementId) {
            return elem
        }
    })[0]
}