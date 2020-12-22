import {Editor} from "../entities/Editor"
import {LOCAL_STORAGE_EDITOR_KEY, LOCAL_STORAGE_STATE_HISTORY_KEY, WHITE} from "../entities/Constants"
import {v4 as uuidv4} from "uuid"
import {StateHistory} from "../entities/StateHistory";


let firstSlideId = uuidv4()

export const initialState: Editor = {
    presentation: {
        name: '',
        slides: [
            {
                id: firstSlideId,
                selectionElementsId: [],
                elements: [],
                background: WHITE
            }
        ]
    },
    selectionSlidesId: [firstSlideId]
}


export const saveStateToLocalStorage = (state: Editor) => {
    try {
        const serialisedState = JSON.stringify(state)

        window.localStorage.setItem(LOCAL_STORAGE_EDITOR_KEY, serialisedState)
    } catch (err) {
        console.log(err)
    }
}

/*export const saveStateHistoryToLocalStorage = (stateHistory: StateHistory) => {
    try {
        const serialisedState = JSON.stringify(stateHistory)

        window.localStorage.setItem(LOCAL_STORAGE_STATE_HISTORY_KEY, serialisedState)
    } catch (err) {
        console.log(err)
    }
}*/

export const loadState = () => {
    try {
        const serialisedState = window.localStorage.getItem(LOCAL_STORAGE_EDITOR_KEY)

        if (!serialisedState) return undefined

        return JSON.parse(serialisedState)
    } catch (err) {
        return undefined
    }
}
