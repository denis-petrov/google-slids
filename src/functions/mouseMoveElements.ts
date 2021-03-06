import {store} from "../store/store"

export function mouseMoveElements(evt: any, firstPosX: number, firstPosY: number) {
    let editor = store.getState()
    let stepX
    let stepY
    editor.presentation.slides.forEach(s => {
        if (editor.selectionSlidesId.includes(s.id)) {
            let selectedElements = []
            for (let i = 0; i < s.selectionElementsId.length; i++) {
                selectedElements.push(document.getElementById(s.selectionElementsId[i]))
            }

            stepX = evt.clientX - firstPosX
            stepY = evt.clientY - firstPosY

            let slide = document.getElementsByClassName('workspace')[0]
            for (let i = 0; i < selectedElements.length; i++) {
                let elem = selectedElements[i]
                if (elem) {
                    let parent = elem.parentNode as HTMLElement
                    if (elem.tagName === 'P') {
                        parent = parent.parentNode as HTMLElement
                    }

                    let prevXAttribute = 0
                    let prevYAttribute = 0

                    s.elements.forEach(e => {
                        if (elem && e.id === elem.id) {
                            prevXAttribute = e.topLeftPoint.x
                            prevYAttribute = e.topLeftPoint.y
                        }
                    })

                    let X = prevXAttribute + '%'
                    let Y = prevYAttribute + '%'
                    if (prevXAttribute !== undefined) {
                        X = Math.floor(stepX / (slide.clientWidth) * 100 * 100) / 100 + prevXAttribute + '%'
                    }

                    if (prevYAttribute !== undefined) {
                        Y = Math.floor(stepY / (slide.clientHeight) * 100 * 100) / 100 + prevYAttribute + '%'
                    }

                    if (parent) {
                        parent.setAttribute('x', X)
                        parent.setAttribute('y', Y)
                    }
                }
            }

            let multipleSelection = document.getElementById('multiple-selection') as HTMLElement
            let prevXAttribute: number | string | null = multipleSelection.getAttribute('data-tlp-x')
            let prevYAttribute: number | string | null = multipleSelection.getAttribute('data-tlp-y')
            let X = prevXAttribute
            let Y = prevYAttribute

            if (prevXAttribute && prevYAttribute) {
                prevXAttribute = parseFloat(prevXAttribute)
                prevYAttribute = parseFloat(prevYAttribute)
            }

            if (typeof(prevXAttribute) === "number" && typeof(prevYAttribute) === "number") {
                X = Math.floor(stepX / (slide.clientWidth) * 100 * 100) / 100 + prevXAttribute + '%'
                Y = Math.floor(stepY / (slide.clientHeight) * 100 * 100) / 100 + prevYAttribute + '%'
            }

            if (X && Y) {
                multipleSelection.setAttribute('x', X)
                multipleSelection.setAttribute('y', Y)
            }
        }
    })
}