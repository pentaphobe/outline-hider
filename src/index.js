// @flow

/**
 * @typedef OptionType
 * @type {object}
 */
type OptionType = {|
  target: Node
|}

const removeInlineStyle = (el: HTMLElement, styleName: string) => {
  if (!el || !el.style || !styleName) return

  if (el.style.removeProperty) {
    el.style.removeProperty(styleName)
    // $FlowIgnore this function only exists on IE < 9 and isn't in Flow
  } else if (el.style.removeAttribute) {
    // $FlowIgnore this function only exists on IE < 9 and isn't in Flow
    el.style.removeAttribute(styleName)
  }
}

const focusHandler: MouseEventListener = (e: MouseEvent) => {
  // $FlowIgnore 'style is missing in EventTarget'
  if (!e || !e.target || !e.target.style) return
  // $FlowIgnore 'style is missing in EventTarget'
  e.target.style.outline = 'none'
}

const blurHandler: FocusEventListener = (e: FocusEvent) => {
  if (!e || !e.target) return
  // $FlowIgnore EventTarget -> HTMLElement incompatible
  removeInlineStyle(e.target, 'outline')
}

const defaultOptions: OptionType = {
  target: document
}

/**
 * Attaches event handlers
 * @name outlineHider
 * @param {OptionType} options
 * @returns {function} a function which can be used to unregister the handlers
 */
const outlineHider = (options: OptionType = defaultOptions): Function => {
  options.target.addEventListener('click', focusHandler, true)
  options.target.addEventListener('blur', blurHandler, true)

  return () => {
    options.target.removeEventListener('click', focusHandler, true)
    options.target.removeEventListener('blur', blurHandler, true)
  }
}

export { outlineHider as default, removeInlineStyle, focusHandler, blurHandler }
