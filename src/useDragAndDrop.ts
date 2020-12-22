import {mouseMoveElements} from "./functions/mouseMoveElements"
import {changeVisibilitySlideHr} from "./slideMenu/changeVisibilitySlideHr"
import {moveElementPoint, resizeElement} from "./functions/resizeElement"
import {endMoveElements} from "./functions/endMoveElements"
import {clearAllSlideHr} from "./slideMenu/clearAllSlideHr"
import {endResizeElement} from "./functions/endResizeElement"
import {removeSelectOfElement} from "./functions/removeSelectOfElements"
import {moveSlides} from "./functions/moveSlides"
import {moveElements} from "./slideArea/moveElements"
import {Dispatch, useEffect, useRef} from "react"
import {useDispatch} from "react-redux"
import {store} from "./store/store"


let isMoveElements: boolean
let firstPosX: number
let firstPosY: number
let isResize: boolean

let isMoveSlides: boolean

let pointIndex: number
let payload: any
let resized = false

let isMouseMove = false

export function useDragAndDrop() {
    const dispatch: Dispatch<any> = useDispatch()
    let editor = store.getState()

    let handleMouseDown = (evt: MouseEvent) => {
        firstPosX = evt.clientX
        firstPosY = evt.clientY
        isMoveElements = moveElements(evt)

        isMoveSlides = moveSlides(evt)

        pointIndex = resizeElement(evt, pointIndex)
        isResize = pointIndex >= 0

        removeSelectOfElement(evt, store.dispatch)
    }
    useEventListener('mousedown', handleMouseDown)


    let handleMouseMove = (evt: MouseEvent) => {
        if (isMoveElements) {
            mouseMoveElements(evt, firstPosX, firstPosY)
        }

        if (isMoveSlides) {
            let selectedSlide = editor.selectionSlidesId[0]

            let elem = evt.target as HTMLElement

            let shiftY = evt.pageY - elem.getBoundingClientRect().top

            if (elem.id !== undefined && selectedSlide !== elem.id) {
                changeVisibilitySlideHr(editor, {shiftY: shiftY, startSlideId: selectedSlide, endSlideId: elem.id})
                isMouseMove = true
            }
        }

        if (isResize) {
            resized = true
            payload = moveElementPoint(evt, firstPosX, firstPosY, pointIndex)
        }
    }
    useEventListener('mousemove', handleMouseMove)


    let handleMouseUp = (evt: MouseEvent) => {
        if (isMoveElements) {
            isMoveElements = endMoveElements(isMoveElements, store.dispatch)
        }

        if (isMoveSlides) {
            let selectedSlide = editor.selectionSlidesId[0]
            let elem = evt.target as HTMLElement

            let shiftY = evt.pageY - elem.getBoundingClientRect().top

            if (isMouseMove && elem.id !== '' && elem.id !== undefined && selectedSlide !== elem.id) {
                dispatch({
                    type: 'END_MOVE_SLIDES',
                    payload: {shiftY: shiftY, startSlideId: selectedSlide, endSlideId: elem.id}
                })
                isMouseMove = false
            }
            clearAllSlideHr()

            isMoveSlides = false
        }

        if (isResize) {
            isResize = false
            pointIndex = -1
            if (resized) {
                endResizeElement(payload)
                if (!payload.get('small')) {
                    dispatch({type: 'CHANGE_POSITION_OF_ELEMENTS', payload: payload})
                }
            }
        }
    }
    useEventListener('mouseup', handleMouseUp)
}

function useEventListener(eventName: string, handler: any, element = window) {
    const savedHandler = useRef<any>()

    useEffect(() => {
        savedHandler.current = handler
    }, [handler])

    useEffect(
        () => {
            const isSupported = element && element.addEventListener
            if (!isSupported) return

            const eventListener = (event: any) => {
                if (event !== undefined) {
                    savedHandler.current(event)
                }
            }

            element.addEventListener(eventName, eventListener)

            return () => {
                element.removeEventListener(eventName, eventListener)
            }
        },
        [eventName, element]
    )
}