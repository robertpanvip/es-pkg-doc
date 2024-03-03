import hotkeys, {KeyHandler} from 'hotkeys-js'
import {setupHighlighter} from './utils/highlight'
import {getElementCodeInfo, getElementInspect, gotoEditor,} from './utils/inspect'
import Overlay from './Overlay'
export function createRef<T>(): { current: T | undefined }
export function createRef<T>(init: T): { current: T }
export function createRef<T>(init?: T) {
    return {
        current: init
    }
}

export const defaultHotKeys = ['control', 'shift', 'command', 'c']
// hotkeys-js params need string
const hotkey = defaultHotKeys.join('+')

/** inspector tooltip overlay */
const overlayRef = createRef<Overlay>()
const mousePointRef = createRef<{ x: number; y: number }>({x: 0, y: 0})

const recordMousePoint = ({clientX, clientY}: MouseEvent) => {
    mousePointRef.current.x = clientX
    mousePointRef.current.y = clientY
}

const startInspect = () => {
    const overlay = new Overlay()
    overlayRef.current = overlay

    const stopCallback = setupHighlighter({
        onPointerOver: handleHoverElement,
        onClick: handleClickElement,
    })

    overlay.setRemoveCallback(stopCallback)

    // inspect element immediately at mouse point
    const initPoint = mousePointRef.current
    const initElement = document.elementFromPoint(initPoint.x, initPoint.y)
    if (initElement) handleHoverElement(initElement as HTMLElement)
}

const stopInspect = () => {
    overlayRef.current?.remove()
    overlayRef.current = undefined
}

const handleHoverElement = (element: HTMLElement) => {
    const overlay = overlayRef.current

    const codeInfo = getElementCodeInfo(element)
    const relativePath = codeInfo?.relativePath
    const absolutePath = codeInfo?.absolutePath

    const {fiber, name, title} = getElementInspect(element)

    overlay?.inspect?.([element], title, relativePath ?? absolutePath)
    console.log('hover',fiber,name)
    /* onHoverElement?.({
         element,
         fiber,
         codeInfo,
         name,
     })*/
}

const handleClickElement = (element: HTMLElement) => {
    stopInspect()

    const codeInfo = getElementCodeInfo(element)
    const {fiber, name} = getElementInspect(element)
    console.log('codeInfo',codeInfo);
    gotoEditor(codeInfo)
    console.log('hover',fiber,name)
    /*onClickElement?.({
        element,
        fiber,
        codeInfo,
        name,
    })*/
}

document.addEventListener('mousemove', recordMousePoint, true)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const handleHotKeys: KeyHandler = (event, handler) => {
    if (handler.key === hotkey) {
        overlayRef.current
            ? stopInspect()
            : startInspect()

    } else if (handler.key === 'esc' && overlayRef.current) {
        stopInspect()
    }
}

// https://github.com/jaywcjlove/hotkeys
hotkeys(`${hotkey}, esc`, handleHotKeys)

/**
 * @deprecated only for debug, will remove in next version
 */
window.__REACT_DEV_INSPECTOR_TOGGLE__ = () => overlayRef.current
    ? stopInspect()
    : startInspect()