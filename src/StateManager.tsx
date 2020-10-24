import {Editor} from './entities/Editor'
import ReactDOM from 'react-dom'
import React from 'react'
import App from './App'
import { deepCopy } from 'deep-copy-ts'

let editor: Editor = {
    presentation: {
        name: 'test',
        slides: [
        ]
    },
    selectionSlidesId: [0]
}
let stackState: Array<Editor> = []
let index: number = 0

export function dispatch<F extends Function>(fn: F, payload: any): void {
    editor = fn(editor, payload)
    stackState.push(editor)
    index += 1

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    )
}

export function getEditor(): Editor {
    return deepCopy(editor)
}

export function setEditor(newEditor: Editor, isAddHistory: boolean): void {
    editor = deepCopy(newEditor)
    if (isAddHistory) {
        stackState.push(editor)
        index += 1
    }

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    )
}
