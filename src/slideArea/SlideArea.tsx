import React from 'react'
import './slideArea.css'
import {dispatch, getEditor} from '../stateManager/StateManager'
import {ElementType, ImageElement, Text} from '../entities/Elements'
import {Slide} from "../entities/Slide"
import {chooseElements} from "../functions/chooseElements"
import {Color, isColor} from "../entities/Color"
import {changeVisibilityTextStyleMenu} from "../functions/changeVisibilityTextStyleMenu";
import {getSelectedPoints} from "../functions/getSelectedPoints";

export function selectElements(event: any, id: string) {
    let clickedElem = event.currentTarget
    let elemPathId = clickedElem.getAttribute('data-path-id')
    let elemPointsId = clickedElem.getAttribute('data-points-id')
    let elemPath = document.getElementById(elemPathId)
    let elemPoints = document.getElementById(elemPointsId)
    let elemClassName = 'element_choosed'
    let pathClassName = 'elem-path_active'
    let pointsClassName = 'points_container_active'
    if (event.ctrlKey) {
        if (clickedElem.getAttribute('data-path-id')) {
            if (clickedElem.classList.contains(elemClassName)) {
                if (elemPath) {
                    elemPath.classList.remove(pathClassName)
                }

                if (elemPoints) {
                    elemPoints.classList.remove(pointsClassName)
                }

                clickedElem.classList.remove(elemClassName)
            } else {
                if (elemPath) {
                    elemPath.classList.add(pathClassName)
                }

                if (elemPoints) {
                    elemPoints.classList.add(pointsClassName)
                }

                clickedElem.classList.add(elemClassName)
            }

            let selectedElems = new Array<string>()
            let allSelectedElems = document.getElementsByClassName(elemClassName)
            for (let i = 0; i < allSelectedElems.length; i++) {
                if (allSelectedElems[i].classList.contains(elemClassName)) {
                    let selectedElemId = allSelectedElems[i].getAttribute('data-elem-id')
                    if (selectedElemId) {
                        selectedElems.push(selectedElemId)
                    }
                }
            }

            dispatch(chooseElements, selectedElems, false)
        }
    } else {
        dispatch(chooseElements, [id], false)
        let allSelectedElemsPaths = document.getElementsByClassName(pathClassName)
        while(allSelectedElemsPaths[0]) {
            if (allSelectedElemsPaths[0].classList.contains(pathClassName)) {
                allSelectedElemsPaths[0].classList.remove(pathClassName)
            }
        }

        let allSelectedElemsPoints = document.getElementsByClassName(pointsClassName)
        while(allSelectedElemsPoints[0]) {
            if (allSelectedElemsPoints[0].classList.contains(pointsClassName)) {
                allSelectedElemsPoints[0].classList.remove(pointsClassName)
            }
        }

        let allSelectedElems = document.getElementsByClassName(elemClassName)
        while(allSelectedElems[0]) {
            if (allSelectedElems[0].classList.contains(elemClassName)) {
                allSelectedElems[0].classList.remove(elemClassName)
            }
        }

        clickedElem.classList.toggle(elemClassName)
        if (elemPath) {
            elemPath.classList.add(pathClassName)
        }

        if (elemPoints) {
            elemPoints.classList.add(pointsClassName)
        }

        if (clickedElem.tagName === 'text') {
            changeVisibilityTextStyleMenu(true)
        } else {
            changeVisibilityTextStyleMenu(false)
        }
    }
}

export function moveElements(event: any) {
    let isMoveElements = false
    let editor = getEditor()
    editor.presentation.slides.map(s => {
        if (editor.selectionSlidesId.includes(s.id)) {
            let selectedElements = []
            for (let i = 0; i < s.selectionElementsId.length; i++) {
                selectedElements.push(document.getElementById(s.selectionElementsId[i]))
            }

            let itsSelectedElements = []
            for (let i = 0; i < selectedElements.length; i++) {
                if (selectedElements[i]) {
                    itsSelectedElements.push(event.target === selectedElements[i] || (selectedElements[i] as HTMLElement).contains(event.target as Node))
                }
            }

            if (itsSelectedElements.includes(true)) {
                isMoveElements = true
            }
        }
    })

    return isMoveElements
}

export function getElements(s: Slide, isIdNeeded: boolean = true) {
    return s.elements.map(e => {
        let width = Math.round((e.bottomRightPoint.x - e.topLeftPoint.x)*100)/100
        let height = Math.round((e.bottomRightPoint.y - e.topLeftPoint.y)*100)/100
        let borderColor = `rgb(${e.borderColor.red},${e.borderColor.green},${e.borderColor.blue}`
        let backgroundColor = 'rgb(255, 255, 255)'
        if (e.backgroundColor) {
            backgroundColor = `rgb(${e.backgroundColor.red},${e.backgroundColor.green},${e.backgroundColor.blue}`
        }

        let pathId
        let pointsId
        let elemId
        let viewBoxWidth = (e.bottomRightPoint.x - e.topLeftPoint.x) * 10
        let viewBoxHeight = Math.floor(Math.abs(((e.bottomRightPoint.y - e.topLeftPoint.y) -
            Math.floor((e.bottomRightPoint.x - e.topLeftPoint.x)/9*16*100)/100) * 10) * 100) / 100
        if (viewBoxHeight === 0) {
            viewBoxHeight = viewBoxWidth
        } else if ((e.bottomRightPoint.x - e.topLeftPoint.x)/9*16 < (e.bottomRightPoint.y - e.topLeftPoint.y)) {
            viewBoxHeight += viewBoxWidth
        }

        let viewBox = `0 0, ${viewBoxWidth}, ${viewBoxHeight}`
        let d = `M 0, 0 H ${viewBoxWidth} V ${viewBoxHeight} H 0 V 0`
        let elementPoints = d
        if (isIdNeeded) {
            elemId = e.id
            pathId = 'slide_' + s.id + '_element_' + e.id
            pointsId = 'slide_' + s.id + '_points_' + e.id
        }

        if (e.backgroundColor) {
            backgroundColor = 'rgb(' + e.backgroundColor.red + ', ' + e.backgroundColor.green + ', ' + e.backgroundColor.blue +')'
        }

        let selectedPoints = getSelectedPoints(width, height, viewBoxWidth, viewBoxHeight)
        let points = [
            <path d={selectedPoints.d1} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                  strokeLinecap="square" fill="blue"/>,
            <path d={selectedPoints.d2} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                  strokeLinecap="square" fill="blue"/>,
            <path d={selectedPoints.d3} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                  strokeLinecap="square" fill="blue"/>,
            <path d={selectedPoints.d4} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                  strokeLinecap="square" fill="blue"/>,
            <path d={selectedPoints.d5} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                  strokeLinecap="square" fill="blue"/>,
            <path d={selectedPoints.d6} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                  strokeLinecap="square" fill="blue"/>,
            <path d={selectedPoints.d7} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                  strokeLinecap="square" fill="blue"/>,
            <path d={selectedPoints.d8} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                  strokeLinecap="square" fill="blue"/>
        ]

        if (e.type === ElementType.rectangle || e.type === ElementType.ellipse || e.type === ElementType.triangle) {
            if (e.type === ElementType.ellipse) {
                elementPoints = `M 1,${viewBoxHeight/2} A ${viewBoxWidth/2 - 1},${viewBoxHeight/2 - 1} 0 1, 1 1,${viewBoxHeight/2 + 0.0001}`
            } else if (e.type === ElementType.triangle) {
                elementPoints = `M ${viewBoxWidth/2} 0, L ${viewBoxWidth} ${viewBoxHeight - 1}, L 0 ${viewBoxHeight - 1}, L ${viewBoxWidth/2} 0`
            }

            return <svg x={e.topLeftPoint.x + '%'} y={e.topLeftPoint.y + '%'} viewBox={viewBox} width={width + '%'} height={height + '%'} preserveAspectRatio="none" key={e.id}>
                <path id={elemId} data-path-id={pathId} data-points-id={pointsId} d={elementPoints} stroke={borderColor} strokeWidth={e.borderWidth} strokeLinejoin="miter"
                       strokeLinecap="square" fill={backgroundColor}
                      onClick={(evt) => selectElements(evt, e.id)} />
                <path id={pathId} d={d} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                      strokeLinecap="square" strokeDasharray="5, 5" fill="none" className="elem-path" />
                <svg id={pointsId} className="points_container">
                    {points.map((point) => {
                        return point
                    })}
                </svg>
            </svg>
        } else if (e.type === ElementType.text) {
            const textStyle = (e as Text).textStyle
            const font = `${textStyle.isBold ? 'bold' : ''} ${textStyle.isCurve ? 'italic' : ''} ${textStyle.sizeFont}px ${textStyle.font}`
            const textColor = `rgb(${textStyle.color.red},${textStyle.color.green},${textStyle.color.blue})`

            //проверить нужен ли viewBox для svg с текстом
            return <svg x={e.topLeftPoint.x + '%'} y={e.topLeftPoint.y + '%'} width={width + '%'} height={height + '%'} preserveAspectRatio="none" key={e.id}>
                <text x="0" y="20" id={elemId} data-path-id={pathId} data-points-id={pointsId} fill={textColor}
                      style={{font: font}} onClick={(evt) => selectElements(evt, e.id)}>{(e as Text).text}</text>
                <path id={pathId} d={d} stroke="blue" strokeWidth="1"  strokeLinejoin="miter"
                      strokeLinecap="square" strokeDasharray="5, 5" fill="none" className="elem-path" />
            </svg>
        } else if (e.type === ElementType.image) {
            let strokeWidth = '.5%'
            const image = (e as ImageElement).link
            let prevWidth = width
            let prevHeight = height
            if (width > height) {
                if (width >= 100) {
                    viewBoxWidth = width
                    d = `M 0, 0 H ${viewBoxWidth} V ${height} H 0 V 0`
                    viewBoxHeight = Math.floor(width/16*9*100)/100
                    width = 100
                    height = 100
                } else {
                    strokeWidth = '1%'
                    width = Math.floor(width*10/16*9/10*100)/100
                    viewBoxHeight = Math.floor(height*10)
                    d = `M 0, 0 H ${viewBoxWidth} V ${viewBoxHeight} H 0 V 0`
                }
            } else {
                if (height >= 100) {
                    viewBoxWidth = Math.floor(height/9*16*100)/100
                    viewBoxHeight = height
                    d = `M 0, 0 H ${width} V ${viewBoxHeight} H 0 V 0`
                    width = 100
                    height = 100
                } else {
                    strokeWidth = '1%'
                    viewBoxHeight = Math.floor(height*10/16*9*100)/100
                    d = `M 0, 0 H ${viewBoxWidth} V ${viewBoxHeight} H 0 V 0`
                }
            }

            viewBox = `0 0, ${viewBoxWidth}, ${viewBoxHeight}`
            if (width >= 100 || height >= 100) {
                selectedPoints = getSelectedPoints(width, height, prevWidth, prevHeight)
            } else {
                selectedPoints = getSelectedPoints(width, height, viewBoxWidth, viewBoxHeight)
            }

            points = [
                <path d={selectedPoints.d1} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                      strokeLinecap="square" fill="blue"/>,
                <path d={selectedPoints.d2} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                      strokeLinecap="square" fill="blue"/>,
                <path d={selectedPoints.d3} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                      strokeLinecap="square" fill="blue"/>,
                <path d={selectedPoints.d4} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                      strokeLinecap="square" fill="blue"/>,
                <path d={selectedPoints.d5} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                      strokeLinecap="square" fill="blue"/>,
                <path d={selectedPoints.d6} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                      strokeLinecap="square" fill="blue"/>,
                <path d={selectedPoints.d7} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                      strokeLinecap="square" fill="blue"/>,
                <path d={selectedPoints.d8} stroke="blue" strokeWidth="1" strokeLinejoin="miter"
                      strokeLinecap="square" fill="blue"/>
            ]

            return <svg x={e.topLeftPoint.x + '%'} y={e.topLeftPoint.y + '%'} viewBox={viewBox}
                        width={width + '%'} height={height + '%'} preserveAspectRatio="none" key={e.id}>
                <image id={elemId} data-path-id={pathId} data-points-id={pointsId} href={image} x="0" y="0"
                        onClick={(evt) => selectElements(evt, e.id)} />
                <path id={pathId} d={d} stroke="blue" strokeWidth={strokeWidth} strokeLinejoin="miter"
                      strokeLinecap="square" fill="none" className="elem-path" />
                <svg id={pointsId} className="points_container">
                    {points.map((point) => {
                        return point
                    })}
                </svg>
            </svg>
        }
        return e
    })
}

export function getSlideBackground() {
    let editor = getEditor()
    let currentSlide = editor.presentation.slides.filter(s => editor.selectionSlidesId.includes(s.id))[0]
    let slideBack
    if (isColor(currentSlide.background)) {
        let slideBackColor = currentSlide.background as Color
        slideBack = `rgb(${slideBackColor.red},${slideBackColor.green},${slideBackColor.blue}`
    } else {
        slideBack = `url(${currentSlide.background as string})`
    }

    return slideBack
}

export default function SlideArea() {
    let editor = getEditor()
    // eslint-disable-next-line array-callback-return
    let elements = editor.presentation.slides.map(s => {
        if (editor.selectionSlidesId.includes(s.id)) {
            return getElements(s)
        }
    })

    return (
        <div id="slide-area" className='slide-area'>
            <svg className={'workspace'} style={{background: `0 0 / cover ${getSlideBackground()}`}}>
                { elements }
            </svg>
        </div>
    )
}