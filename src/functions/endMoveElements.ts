import {Dispatch} from "react"
import {store} from "../store/store"

export function endMoveElements(isMoveElements: boolean, dispatch: Dispatch<any>) {
    let editor = store.getState()

    isMoveElements = false
    let payload = new Map()
    let isMoved: boolean = true
    editor.presentation.slides.forEach(s => {
        if (editor.selectionSlidesId.includes(s.id)) {
            let selectedElements = []
            let elements = new Map()
            for (let i = 0; i < s.selectionElementsId.length; i++) {
                selectedElements.push(document.getElementById(s.selectionElementsId[i]))
            }

            for (let i = 0; i < selectedElements.length; i++) {
                let elem = selectedElements[i]
                s.elements.forEach(e => {
                    if (elem && e.id === elem.id) {
                        let topLeftPointX = 0
                        let topLeftPointY = 0
                        if (elem && e.id === elem.id) {
                            let parent = elem.parentNode as HTMLElement
                            if (elem.tagName === 'P') {
                                parent = parent.parentNode as HTMLElement
                            }

                            let X = parent.getAttribute('x')
                            let Y = parent.getAttribute('y')
                            if (X !== null && X !== undefined) {
                                topLeftPointX = parseFloat(X.slice(0, -1))
                            }

                            if (Y !== null && Y !== undefined) {
                                topLeftPointY = parseFloat(Y.slice(0, -1))
                            }
                        }

                        let newPos = new Map()
                        let newTopLeftPoint = new Map()
                        let newBottomRightPoint = new Map()
                        let newCenter = new Map()
                        let bottomRightPointX = Math.round((Math.round((e.bottomRightPoint.x - e.topLeftPoint.x) * 100) / 100 + topLeftPointX) * 100) / 100
                        let bottomRightPointY = Math.round((Math.round((e.bottomRightPoint.y - e.topLeftPoint.y) * 100) / 100 + topLeftPointY) * 100) / 100
                        newTopLeftPoint.set('x', topLeftPointX)
                        newTopLeftPoint.set('y', topLeftPointY)
                        newBottomRightPoint.set('x', bottomRightPointX)
                        newBottomRightPoint.set('y', bottomRightPointY)
                        newCenter.set('x', e.center.x)
                        newCenter.set('y', e.center.y)
                        newPos.set('newTopLeftPoint', newTopLeftPoint)
                        newPos.set('newBottomRightPoint', newBottomRightPoint)
                        newPos.set('newCenter', newCenter)
                        elements.set(e.id, newPos)

                        isMoved = !(topLeftPointX === e.topLeftPoint.x && topLeftPointY === e.topLeftPoint.y)
                    }
                })
            }

            payload.set('elements', elements)
        }
    })

    if (isMoved) {
        dispatch({type: 'END_MOVE_ELEMENTS', payload: payload})
    }

    return isMoveElements
}