import {Editor} from "../entities/Editor"
import React, {Dispatch} from "react"
import {connect, useDispatch} from "react-redux"
import {AppBar, Toolbar} from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"
import UndoIcon from "@material-ui/icons/Undo"
import RedoIcon from "@material-ui/icons/Redo"
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory"
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked"
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import TextFieldsIcon from "@material-ui/icons/TextFields"
import {Dropdown} from "react-bootstrap"
import CropOriginalIcon from "@material-ui/icons/CropOriginal"
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded"
import {insertImageFromPc} from "../functions/insertImageFromPc"
import {
    ADD_ELEMENT,
    ADD_EMPTY_SLIDE,
    ADD_TO_BACKGROUND,
    CHANGE_ELEMENT_BORDER_COLOR,
    CHANGE_ELEMENT_BORDER_WIDTH,
    CHANGE_ELEMENT_FILL_COLOR,
    CHANGE_TEXT_BOLD,
    CHANGE_TEXT_FONT,
    CHANGE_TEXT_ITALIC,
    CHANGE_TEXT_SIZE,
    CHANGE_TEXT_UNDERLINE,
    DELETE_ELEMENTS,
    DELETE_SLIDES,
    REDO,
    UNDO
} from "../store/actionTypes"
import FormDialog from "./FomDialog"
import ColorPickerOur from "./ColorPicker"
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded"
import ColorPicker from "react-pick-color"
import LineWeightIcon from "@material-ui/icons/LineWeight"
import FormatBoldRoundedIcon from "@material-ui/icons/FormatBoldRounded"
import FormatItalicRoundedIcon from "@material-ui/icons/FormatItalicRounded"
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined"
import ArrowDropDownRoundedIcon from "@material-ui/icons/ArrowDropDownRounded"
import {getSelectedElements} from "../functions/getSelectedElements"
import {ElementType, Text} from "../entities/Elements"
import {changePrimitiveStyleMenu} from "../functions/changePrimitiveStyleMenu"
import {changeTextStyleMenu} from "../functions/changeTextStyleMenu"
import {v4 as uuidv4} from "uuid"
import CheckIcon from "@material-ui/icons/Check"
import {DEFAULT_ELLIPSE, DEFAULT_RECTANGLE, DEFAULT_TEXT, DEFAULT_TRIANGLE} from "../entities/Constants"


const mapStateToProps = (state: Editor) => {
    return {
        state: state,
    }
}


const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        addEmptySlide: () => dispatch({type: ADD_EMPTY_SLIDE}),
        deleteSlides: () => dispatch({type: DELETE_SLIDES}),

        undo: () => dispatch({type: UNDO}),
        redo: () => dispatch({type: REDO}),

        addTriangle: () => dispatch({type: ADD_ELEMENT, payload: DEFAULT_TRIANGLE}),
        addEllipse: () => dispatch({type: ADD_ELEMENT, payload: DEFAULT_ELLIPSE}),
        addRectangle: () => dispatch({type: ADD_ELEMENT, payload: DEFAULT_RECTANGLE}),
        addText: () => dispatch({type: ADD_ELEMENT, payload: DEFAULT_TEXT}),
        deleteElements: () => {
            dispatch({type: DELETE_ELEMENTS})
            changePrimitiveStyleMenu(false)
            changeTextStyleMenu(false)
        },

        changeElementBorderColor: (data: string) => dispatch({type: CHANGE_ELEMENT_BORDER_COLOR, payload: data}),
        changeElementFillColor: (data: string) => dispatch({type: CHANGE_ELEMENT_FILL_COLOR, payload: data}),
        changeElementBorderWidth: (data: number) => dispatch({type: CHANGE_ELEMENT_BORDER_WIDTH, payload: data}),
        changeTextBold: () => dispatch({type: CHANGE_TEXT_BOLD}),
        changeTextItalic: () => dispatch({type: CHANGE_TEXT_ITALIC}),
        changeTextUnderline: () => dispatch({type: CHANGE_TEXT_UNDERLINE}),
        changeTextFont: (data: string) => dispatch({type: CHANGE_TEXT_FONT, payload: data}),
        changeTextSize: (data: number) => dispatch({type: CHANGE_TEXT_SIZE, payload: data})
    }
}

const imageFiled = React.createRef<HTMLInputElement>()
const imageToBackFiled = React.createRef<HTMLInputElement>()

function NavSecondLine(props: any) {
    let editor = props.state
    const dispatch: Dispatch<any> = useDispatch()

    const elements = getSelectedElements(editor)
    let fillColor: string = ''
    let borderColor: string = ''
    let borderSizeView: number = 0
    let font: string = ''
    let fontSize: number = 10
    let boldSelect: string = ''
    let underlinedSelect: string = ''
    let italicSelect: string = ''
    if ((elements !== undefined) && (elements != null) && (elements.length >= 1)) {
        let element = elements[0]
        borderColor = `rgb(${element.borderColor.red},${element.borderColor.green},${element.borderColor.blue})`
        borderSizeView = element.borderWidth
        let isText = new Array<boolean>()
        elements.forEach(e => {
            if (e.type !== ElementType.text) {
                isText.push(false)
            }
        })

        if (!isText.includes(false)) {
            changePrimitiveStyleMenu(false)
            changeTextStyleMenu(true)
            const textStyle = (element as Text).textStyle
            fillColor = `rgb(${textStyle.color.red},${textStyle.color.green},${textStyle.color.blue})`
            font = textStyle.font
            fontSize = textStyle.sizeFont
            boldSelect = textStyle.isBold ? 'text-bold' : ''
            italicSelect = textStyle.isCurve ? 'text-italic' : ''
            underlinedSelect = textStyle.isUnderline ? 'text-underlined' : ''
        } else {
            if (element.backgroundColor != null) {
                changeTextStyleMenu(false)
                changePrimitiveStyleMenu(true)
                fillColor = `rgb(${element.backgroundColor.red},${element.backgroundColor.green},${element.backgroundColor.blue})`
            }
        }
    }

    const borderSizes = [1, 2, 3, 4, 8, 12, 16, 24]
    let borderSizeItems = borderSizes.map((borderSize: number) => {
        let opacity: number = 0
        if (borderSize === borderSizeView) {
            opacity = 1
        }

        return <Dropdown.Item key={uuidv4()} className="btn-sm button__onclick"
                              onClick={() => props.changeElementBorderWidth(borderSize)}>
            <CheckIcon fontSize='small' style={{marginRight: '.65rem', opacity: opacity}}/>
            {borderSize} px
        </Dropdown.Item>
    })

    return (
        <AppBar position="static" className="nav">
            <Toolbar variant="dense">
                <div id="slide-manipulation-buttons">
                    <button data-title="Add&nbsp;slide" type="button"
                            className="btn btn-sm button__onclick dropbox__button"
                            onClick={() => props.addEmptySlide()}>
                        <AddIcon/>
                    </button>

                    <button data-title="Remove&nbsp;slides" type="button"
                            className="btn btn-sm button__onclick dropbox__button"
                            onClick={() => props.deleteSlides()}>
                        <RemoveIcon/>
                    </button>

                    <button data-title="Undo" type="button"
                            className="btn btn-light btn-sm button__onclick dropbox__button"
                            onClick={() => props.undo()}>
                        <UndoIcon/>
                    </button>

                    <button data-title="Redo" type="button"
                            className="btn btn-light btn-sm button__onclick dropbox__button"
                            onClick={() => props.redo()}>
                        <RedoIcon/>
                    </button>
                </div>

                <div className="vertical_separator">&nbsp;</div>

                <button data-title="Add&nbsp;triangle" type="button"
                        className="btn btn-light btn-sm button__onclick dropbox__button"
                        onClick={() => props.addTriangle()}>
                    <ChangeHistoryIcon/>
                </button>

                <button data-title="Add&nbsp;ellipse" type="button"
                        className="btn btn-light btn-sm button__onclick dropbox__button"
                        onClick={() => props.addEllipse()}>
                    <RadioButtonUncheckedIcon/>
                </button>

                <button data-title="Add&nbsp;rectangle" type="button"
                        className="btn btn-light btn-sm button__onclick dropbox__button"
                        onClick={() => props.addRectangle()}>
                    <CheckBoxOutlineBlankIcon/>
                </button>

                <button data-title="Add&nbsp;text" type="button"
                        className="btn btn-light btn-sm button__onclick dropbox__button"
                        onClick={() => props.addText()}>
                    <TextFieldsIcon/>
                </button>

                <Dropdown>
                    <div className="custom-title" data-title="Add&nbsp;image">
                        <Dropdown.Toggle className="btn-light btn-sm dropbox__insert dropbox__button"
                                         variant="success" id="dropdown-insert">
                            <CropOriginalIcon/>
                        </Dropdown.Toggle>
                    </div>

                    <Dropdown.Menu>
                        <div>
                            <label htmlFor="myImage" className="btn-sm button__onclick dropbox_image__item">
                                <GetAppRoundedIcon/> Insert from computer
                            </label>
                            <input
                                className="dropbox__open_button"
                                id="myImage"
                                name="myImage"
                                accept="image/*"
                                onChange={(e: any) => {
                                    if (e.target.files !== null) {
                                        insertImageFromPc(e, ADD_ELEMENT, dispatch)

                                        e.target.value = null
                                    }
                                }}
                                ref={imageFiled}
                                type="file"
                            />
                        </div>
                        <div>
                            <FormDialog isBackground={false}/>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>

                <div className="vertical_separator">&nbsp;</div>

                <Dropdown>
                    <Dropdown.Toggle className="btn-light btn-sm dropbox__insert dropbox__button"
                                     variant="success" id="dropdown-insert">
                        Background
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <div>
                            <ColorPickerOur dispatch={dispatch}/>
                        </div>
                        <div>
                            <label htmlFor="myBackImage" className="btn-sm button__onclick dropbox_image__item">
                                <GetAppRoundedIcon/> Insert from computer
                            </label>
                            <input
                                type="file"
                                className="dropbox__open_button"
                                id="myBackImage"
                                name="myBackImage"
                                accept="image/*"
                                onChange={(e: any) => {
                                    if (e.target.files !== null) {
                                        insertImageFromPc(e, ADD_TO_BACKGROUND, dispatch)

                                        e.target.value = null
                                    }
                                }}
                                ref={imageToBackFiled}
                            />
                        </div>
                        <div>
                            <FormDialog isBackground={true}/>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>

                {/* separator */}
                <div id="edit_style_text_sep_0" className="vertical_separator hidden">&nbsp;</div>

                {/*delete element*/}
                <button data-title="Delete&nbsp;elements" id="edit_style_text_delete" type="button"
                        className="btn btn-sm button__onclick dropbox__button hidden" onClick={() =>
                    props.deleteElements()
                }>
                    <DeleteRoundedIcon/>
                </button>

                {/* separator */}
                <div id="edit_style_text_sep_1" className="vertical_separator hidden">&nbsp;</div>

                {/*Fill backgroundColor*/}
                <div data-title="Fill&nbsp;color">
                    <Dropdown id="edit_style_element_fill_color" className="hidden">
                        <Dropdown.Toggle className="btn-light btn-sm btn button__onclick dropbox__button"
                                         variant="success" id="dropdown-slide">
                            <div id="fill_element" className="edit_style_text__font">
                                <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24"
                                     aria-hidden="true">
                                    <path
                                        d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"/>
                                    <path fill={fillColor} d="M0 20h24v4H0z"/>
                                </svg>
                            </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <ColorPicker color={fillColor} onChange={(color) =>
                                props.changeElementFillColor(color.hex)
                            } hideAlpha={true} hideInputs={false} theme={{
                                "background": "#fff",
                                "inputBackground": "#f4f4f4",
                                "color": "#262626",
                                "borderColor": "#ffffff",
                                "borderRadius": "5px",
                                "boxShadow": "none",
                                "width": "280px"
                            }}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/*Border color*/}
                <div data-title="Border&nbsp;color">
                    <Dropdown id="edit_style_element_border_color" className="hidden">
                        <Dropdown.Toggle className="btn-light btn-sm btn button__onclick dropbox__button"
                                         variant="success" id="dropdown-slide">
                            <div id="border_element" className="edit_style_text__font">
                                <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24"
                                     aria-hidden="true">
                                    <path
                                        d="M17.75 7L14 3.25l-10 10V17h3.75l10-10zm2.96-2.96c.39-.39.39-1.02 0-1.41L18.37.29a.9959.9959 0 0 0-1.41 0L15 2.25 18.75 6l1.96-1.96z"/>
                                    <path fill={borderColor} d="M0 20h24v4H0z"/>
                                </svg>
                            </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <ColorPicker color={borderColor} onChange={(color) =>
                                props.changeElementBorderColor(color.hex)
                            } hideAlpha={true} hideInputs={false} theme={{
                                "background": "#fff",
                                "inputBackground": "#f4f4f4",
                                "color": "#262626",
                                "borderColor": "#ffffff",
                                "borderRadius": "5px",
                                "boxShadow": "none",
                                "width": "280px"
                            }}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/*Border size*/}
                <div data-title="Border&nbsp;size">
                    <Dropdown id="edit_style_border_size" className="hidden edit_style_text_size">
                        <Dropdown.Toggle className="btn-light btn-sm btn button__onclick dropbox__button"
                                         variant="success" id="dropdown-slide">
                            <div className="edit_style_text__font">
                                <LineWeightIcon/>
                            </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{backgroundColor: '#fff'}}>
                            {borderSizeItems}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/*separator*/}
                <div id="edit_style_text_sep_2" className="vertical_separator hidden">&nbsp;</div>

                {/*bold text*/}
                <button data-title="Bold" id="edit_style_text_bold" type="button"
                        className={"btn btn-sm button__onclick dropbox__button hidden " + boldSelect} onClick={() =>
                    props.changeTextBold()
                }>
                    <FormatBoldRoundedIcon/>
                </button>

                {/*italic text*/}
                <button data-title="Italic" id="edit_style_text_italic" type="button"
                        className={"btn btn-sm button__onclick dropbox__button hidden " + italicSelect}
                        onClick={() =>
                            props.changeTextItalic()
                        }>
                    <FormatItalicRoundedIcon/>
                </button>

                {/*underlined text*/}
                <button data-title="Underline" id="edit_style_text_underline" type="button"
                        className={"btn btn-sm button__onclick dropbox__button hidden " + underlinedSelect}
                        onClick={() =>
                            props.changeTextUnderline()
                        }>
                    <FormatUnderlinedIcon/>
                </button>

                {/*font color*/}
                <div data-title="Font&nbsp;color">
                    <Dropdown id="edit_style_text_color" className="hidden">
                        <Dropdown.Toggle className="btn-light btn-sm btn button__onclick dropbox__button"
                                         variant="success" id="dropdown-slide">
                            <div id="fill_element" className="edit_style_text__font">
                                <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24"
                                     aria-hidden="true">
                                    <path fill={fillColor} d="M0 20h24v4H0z"/>
                                    <path
                                        d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"/>
                                </svg>
                            </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <ColorPicker color={fillColor} onChange={(color) =>
                                props.changeElementFillColor(color.hex)
                            } hideAlpha={true} hideInputs={false} theme={{
                                "background": "#fff",
                                "inputBackground": "#f4f4f4",
                                "color": "#262626",
                                "borderColor": "#ffffff",
                                "borderRadius": "5px",
                                "boxShadow": "none",
                                "width": "280px"
                            }}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/*separator 2*/}
                <div id="edit_style_text_sep_3" className="vertical_separator hidden">&nbsp;</div>

                {/*font*/}
                <Dropdown id="edit_style_text_font" className="hidden">
                    <Dropdown.Toggle className="btn-light btn-sm btn button__onclick dropbox__button"
                                     variant="success" id="dropdown-slide">
                        <div id="font_text" className="edit_style_text__font">{font} <ArrowDropDownRoundedIcon/>
                        </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item className="btn-sm button__onclick edit_style_text__font" onClick={() =>
                            props.changeTextFont('Arial')
                        }>
                            Arial
                        </Dropdown.Item>
                        <Dropdown.Item className="btn-sm button__onclick edit_style_text__roboto" onClick={() =>
                            props.changeTextFont('Roboto')
                        }>
                            Roboto
                        </Dropdown.Item>
                        <Dropdown.Item className="btn-sm button__onclick edit_style_text__jetbrains_mono" onClick={() =>
                            props.changeTextFont('JetBrains Mono')
                        }>
                            JetBrains Mono
                        </Dropdown.Item>
                        <Dropdown.Item className="btn-sm button__onclick edit_style_text__padauk" onClick={() =>
                            props.changeTextFont('Padauk')
                        }>
                            Padauk
                        </Dropdown.Item>
                        <Dropdown.Item className="btn-sm button__onclick edit_style_text__open_sans" onClick={() =>
                            props.changeTextFont('Open Sans')
                        }>
                            Open Sans
                        </Dropdown.Item>
                        <Dropdown.Item className="btn-sm button__onclick edit_style_text__noto_sans_jp" onClick={() =>
                            props.changeTextFont('Noto Sans JP')
                        }>
                            Noto Sans JP
                        </Dropdown.Item>
                        <Dropdown.Item className="btn-sm button__onclick edit_style_text__lato" onClick={() =>
                            props.changeTextFont('Lato')
                        }>
                            Lato
                        </Dropdown.Item>
                        <Dropdown.Item className="btn-sm button__onclick edit_style_text__monsterrat" onClick={() =>
                            props.changeTextFont('Monsterrat')
                        }>
                            Monsterrat
                        </Dropdown.Item>
                        <Dropdown.Item className="btn-sm button__onclick edit_style_text__nerko_one" onClick={() =>
                            props.changeTextFont('Nerko One')
                        }>
                            Nerko One
                        </Dropdown.Item>
                        <Dropdown.Item className="btn-sm button__onclick edit_style_text__oswald" onClick={() =>
                            props.changeTextFont('Oswald')
                        }>
                            Oswald
                        </Dropdown.Item>
                        <Dropdown.Item className="btn-sm button__onclick edit_style_text__castoro" onClick={() =>
                            props.changeTextFont('Castoro')
                        }>
                            Castoro
                        </Dropdown.Item>
                        <Dropdown.Item className="btn-sm button__onclick edit_style_text__work_sans" onClick={() =>
                            props.changeTextFont('Work Sans')
                        }>
                            Work Sans
                        </Dropdown.Item>
                        <Dropdown.Item className="btn-sm button__onclick edit_style_text__do_hyeon" onClick={() =>
                            props.changeTextFont('Do Hyeon')
                        }>
                            Do Hyeon
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {/*separator*/}
                <div id="edit_style_text_sep_4" className="vertical_separator hidden">&nbsp;</div>

                {/*Font size*/}
                <div id="edit_style_text_size" className="hidden edit_style_text_size font-size-block">
                    <div data-title="Decrease&nbsp;font&nbsp;size">
                        <RemoveIcon fontSize='small' onClick={() => {
                            if (fontSize - 1 >= 1) {
                                props.changeTextSize(fontSize - 1)
                            }
                        }}/>
                    </div>
                    <div data-title="Font&nbsp;size">
                        <input id="font-size-area" type="number" min="1" max="80"
                               onKeyDown={(evt) => {
                                   if (evt.keyCode === 13) {
                                       (evt.target as HTMLElement).blur()
                                   }
                               }}
                               onBlur={(evt) => {
                                   let value = evt.target.value
                                   if (value !== '' && parseInt(value) <= 80 && parseInt(value) >= 1) {
                                       props.changeTextSize(parseInt(value))
                                   } else {
                                       props.changeTextSize(fontSize)
                                   }
                               }}
                        />
                    </div>
                    <div data-title="Increase&nbsp;font&nbsp;size">
                        <AddIcon fontSize='small' onClick={() => {
                            if (fontSize + 1 <= 80) {
                                props.changeTextSize(fontSize + 1)
                            }
                        }}/>
                    </div>
                </div>

            </Toolbar>
        </AppBar>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(NavSecondLine)
