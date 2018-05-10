import outlineHider, {
  removeInlineStyle,
  focusHandler,
  blurHandler
} from '../src'

// weird jsdom error with add/remove eventListener
// window.blur = jest.fn()

describe('outlineHider', () => {
  it('should return a function', () => {
    const result = outlineHider()

    expect(typeof result).toBe('function')
  })

  it('should call addEventListener twice', () => {
    const options = {
      target: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      }
    }

    outlineHider(options)

    expect(options.target.addEventListener.mock.calls.length).toBe(2)
  })

  describe('cleanup function', () => {
    it('should call removeEventListener twice on the target', () => {
      const options = {
        target: {
          addEventListener: jest.fn(),
          removeEventListener: jest.fn()
        }
      }

      const cleanup = outlineHider(options)

      cleanup()

      expect(options.target.removeEventListener.mock.calls.length).toBe(2)
    })
  })
  // TODO: mock document and confirm event removal works
  // TODO: simulate click trigger adds custom outline style
  // TODO: simulate keyboard focus removes custom outline style
})

describe('removeInlineStyle', () => {
  it('should elegantly fail on null or undefined', () => {
    expect(removeInlineStyle(null, 'outline')).toBeUndefined()
    expect(removeInlineStyle(undefined, 'outline')).toBeUndefined()
  })

  it('should elegantly fail when styleName is absent or invalid', () => {
    const el = {
      style: {
        removeProperty: jest.fn()
      }
    }

    expect(removeInlineStyle(el, '')).toBeUndefined()
    expect(removeInlineStyle(el, null)).toBeUndefined()
    expect(removeInlineStyle(el, undefined)).toBeUndefined()
  })

  it('should call removeProperty when args are valid', () => {
    const el = {
      style: {
        removeProperty: jest.fn()
      }
    }

    removeInlineStyle(el, 'outline')

    expect(el.style.removeProperty.mock.calls.length).toBe(1)
  })

  it(`should call removeAttribute if removeProperty isn't present`, () => {
    const el = {
      style: {
        removeAttribute: jest.fn()
      }
    }

    removeInlineStyle(el, 'outline')

    expect(el.style.removeAttribute.mock.calls.length).toBe(1)
  })

  it(`should fail elegantly if somehow neither removeProperty or removeAttribute exist`, () => {
    const el = {
      style: {}
    }

    expect(removeInlineStyle(el, 'outline')).toBeUndefined()
  })
})

describe('focusHandler', () => {
  it('should elegantly fail when event is invalid', () => {
    expect(focusHandler(null)).toBeUndefined()
    expect(focusHandler(undefined)).toBeUndefined()
    expect(focusHandler({})).toBeUndefined()
    expect(focusHandler({ target: null })).toBeUndefined()
    expect(
      focusHandler({
        target: {
          style: {}
        }
      })
    ).toBeUndefined()
  })

  it(`should set the outline prop to 'none' on event target when valid`, () => {
    const ev = {
      target: {
        style: {}
      }
    }

    focusHandler(ev)

    expect(ev.target.style.outline).toBe('none')
  })
})

describe('blurHandler', () => {
  it('should elegantly fail when event is invalid', () => {
    expect(blurHandler(null)).toBeUndefined()
    expect(blurHandler(undefined)).toBeUndefined()
    expect(blurHandler({})).toBeUndefined()
    expect(blurHandler({ target: null })).toBeUndefined()
    expect(
      blurHandler({
        target: {
          style: {}
        }
      })
    ).toBeUndefined()
  })

  it('should call removeProperty() on valid event target', () => {
    const el = {
      style: {
        removeProperty: jest.fn()
      }
    }

    const ev = {
      target: el
    }

    blurHandler(ev)

    expect(el.style.removeProperty.mock.calls.length).toBe(1)
  })
})
