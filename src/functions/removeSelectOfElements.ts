import {changeTextStyleMenu} from "./changeTextStyleMenu"
import {Dispatch} from "react"
import {store} from "../store/store"
import {CHOOSE_ELEMENTS} from "../store/actionTypes"


export let pathClassName = 'elem-path_active'
export let pointsClassName = 'points_container_active'

export function removeSelectOfElement(evt: any, dispatch: Dispatch<any>) {
    let clickedElem = evt.target as HTMLElement
    let navBar = document.getElementById('nav_bar')
    let showPresentationBtn = document.getElementsByClassName('show_inline')[0]
    let itsNavBar = null
    let itsShowPresentationBtn = null
    let itsClickedElem = false
    if (showPresentationBtn) {
        itsShowPresentationBtn = showPresentationBtn.contains(evt.target as Node)
    }

    if (navBar) {
        itsNavBar = evt.target === navBar || (navBar.contains(evt.target as Node) && !itsShowPresentationBtn)
    }

    if (clickedElem.getAttribute('data-is-element') || clickedElem.getAttribute('data-value') || clickedElem.tagName === 'foreignObject') {
        itsClickedElem = true
    }

    if ((!itsNavBar && !itsClickedElem) || itsShowPresentationBtn) {
        removeAllSelectionView(pathClassName, pointsClassName)

        dispatch({type: CHOOSE_ELEMENTS, payload: new Array<string>()})
        changeTextStyleMenu(false)
    }
}



export function removeAllSelectionView(pathClassName: string, pointsClassName: string) {
    let multipleSelection = document.getElementById('multiple-selection') as HTMLElement
    let workspace = document.getElementsByClassName('workspace')[0] as HTMLElement
    if (multipleSelection == null || workspace == null) {
        return;
    }
    let editor = store.getState()
    editor.presentation.slides.map(s => {
        if (editor.selectionSlidesId[0] == s.id) {
            for (let i = 0; i < s.elements.length; i++) {
                console.log(document.getElementById(`svg_${s.elements[i].id}`))
                workspace.appendChild(document.getElementById(`svg_${s.elements[i].id}`) as HTMLElement)
            }
        }
    })

    let className = 'element_choosed'
    let allSelectedElems = document.getElementsByClassName(className)
    while (allSelectedElems[0]) {
        if (allSelectedElems[0].classList.contains(className)) {
            if (allSelectedElems[0].tagName === 'P') {
                (allSelectedElems[0].parentNode as HTMLElement).style.cursor = 'default'
            }

            allSelectedElems[0].classList.remove(className)
        }
    }

    let elemPath = multipleSelection.children[0]
    let elemPoints = multipleSelection.children[1]

    if (elemPath) {
        elemPath.classList.remove(pathClassName)
    }

    if (elemPoints) {
        elemPoints.classList.remove(pointsClassName)
    }
}
