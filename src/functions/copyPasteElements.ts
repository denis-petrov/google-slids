import {store} from "../store/store";
import {Element} from "../entities/Elements";
import {Dispatch} from "react";
import {CHOOSE_ELEMENTS, PASTE_ELEMENTS} from "../store/actionTypes";

function getCookie(name: string) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([$?*|{}\]\\^])/g, '\\$1') + "=([^;]*)"
    ))

    return matches ? decodeURIComponent(matches[1]) : undefined
}

const copyPastCookieName = 'copyPasteData'

export function copyElements() {
    let value = {
        elements: new Array<Element>()
    }
    let editor = store.getState()
    editor.presentation.slides.forEach(s => {
        if (editor.selectionSlidesId.includes(s.id)) {
            s.elements.forEach(e => {
                if(s.selectionElementsId.includes(e.id)) {
                    value.elements.push(e)
                }
            })
        }
    })

    if (value.elements.length > 0) {
        document.cookie = `${copyPastCookieName}=${JSON.stringify(value)}`
    }
}

export function pasteElements(dispatch: Dispatch<any>) {
    let value =  getCookie(copyPastCookieName)
    let json = {
        elements: new Array<Element>()
    }

    if (value !== undefined) {
        json = JSON.parse(value)
    }

    if (json) {
        dispatch({type: PASTE_ELEMENTS, payload: json.elements})
        let editor = store.getState()
        editor.presentation.slides.forEach(s => {
            if (editor.selectionSlidesId.includes(s.id)) {
                let elemCount = s.elements.length
                let selectedElements = new Array<string>()
                for (let i = elemCount - 1; i >= elemCount - json.elements.length; i--) {
                    selectedElements.push(s.elements[i].id)
                }

                dispatch({type: CHOOSE_ELEMENTS, payload: selectedElements})
                selectedElements.forEach(id => {
                    let element = document.getElementById(id)
                    if (element) {
                        element.classList.add('element_choosed')
                    }
                })
            }
        })
    }
}