/**
 * @typedef {import('property-information').Schema} Schema
 * @typedef {import('hast').Content} Content
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Root} Root
 * @typedef {import('./components.js').Components} Components
 */

/**
 * @typedef {Content | Root} Node
 * @typedef {Extract<Node, import('unist').Parent>} Parent
 */

/**
 * @typedef {unknown} Fragment
 *   Represent the children, typically a symbol.
 *
 * @callback Jsx
 *   Create a production element.
 * @param {unknown} type
 *   Element type: the `Fragment` symbol or a tag name (`string`).
 * @param {Props} props
 *   Element props and also includes `children`.
 * @param {string | undefined} key
 *   Dynamicly generated key to use.
 * @returns {JSX.Element}
 *   An element from your framework.
 *
 * @callback JsxDev
 *   Create a development element.
 * @param {unknown} type
 *   Element type: the `Fragment` symbol or a tag name (`string`).
 * @param {Props} props
 *   Element props and also includes `children`.
 * @param {string | undefined} key
 *   Dynamicly generated key to use.
 * @param {boolean} isStaticChildren
 *   Whether more than one children are used.
 * @param {Source} source
 *   Info about source.
 * @param {undefined} self
 *   Nothing (this is used by frameworks that have components, we don’t).
 * @returns {JSX.Element}
 *   An element from your framework.
 *
 * @typedef {'html' | 'svg'} Space
 *   Namespace.
 *
 * @typedef Source
 *   Info about source.
 * @property {string | undefined} fileName
 *   Name of source file.
 * @property {number | undefined} lineNumber
 *   Line where thing starts (1-indexed).
 * @property {number | undefined} columnNumber
 *   Column where thing starts (0-indexed).
 *
 * @typedef {Record<string, string>} Style
 *   Style map.
 *
 * @typedef {Style | string | number | boolean} Value
 *   Primitive property value and `Style` map.
 *
 * @typedef {[string, Value]} Field
 *   Property field.
 *
 * @typedef {JSX.Element | string | null | undefined} Child
 *   Child.
 *
 * @typedef {{children: Array<Child>, [prop: string]: Value | Array<Child>}} Props
 *   Properties and children.
 *
 * @callback Create
 *   Create something in development or production.
 * @param {Node} node
 *   hast node.
 * @param {unknown} type
 *   Fragment symbol or tag name.
 * @param {Props} props
 *   Properties and children.
 * @param {string | undefined} key
 *   Key.
 * @returns {JSX.Element}
 *   Result.
 *
 * @typedef State
 *   Info passed around.
 * @property {string | undefined} filePath
 *   File path.
 * @property {Partial<Components>} components
 *   Components to swap.
 * @property {Schema} schema
 *   Current schema.
 * @property {unknown} Fragment
 *   Fragment symbol.
 * @property {Create} create
 *   Create something in development or production.
 *
 * @typedef RegularFields
 *   Configuration.
 * @property {Partial<Components> | null | undefined} [components]
 *   Components to use.
 *
 *   Each key is the name of an HTML (or SVG) element to override.
 *   The value is the component to render instead.
 * @property {string | null | undefined} [filePath]
 *   File path to the original source file.
 *
 *   Passed in source info to `jsxDEV` when using the automatic runtime with
 *   `development: true`.
 * @property {Space | null | undefined} [space='html']
 *   Whether `tree` is in the `'html'` or `'svg'` space.
 *
 *   When an `<svg>` element is found in the HTML space, this package already
 *   automatically switches to and from the SVG space when entering and exiting
 *   it.
 *
 *   > 👉 **Note**: hast is not XML.
 *   > It supports SVG as embedded in HTML.
 *   > It does not support the features available in XML.
 *   > Passing SVG might break but fragments of modern SVG should be fine.
 *   > Use `xast` if you need to support SVG as XML.
 *
 * @typedef RuntimeUnknown
 *   Runtime fields when development might be on or off.
 * @property {Fragment} Fragment
 *   Fragment.
 * @property {Jsx | null | undefined} [jsx]
 *   Dynamic JSX.
 * @property {Jsx | null | undefined} [jsxs]
 *   Static JSX.
 * @property {JsxDev | null | undefined} [jsxDEV]
 *   Development JSX.
 * @property {boolean} development
 *   Whether to use `jsxDEV` (when on) or `jsx` and `jsxs` (when off).
 *
 * @typedef RuntimeProduction
 *   Runtime fields when development is off.
 * @property {Fragment} Fragment
 *   Fragment.
 * @property {Jsx} jsx
 *   Dynamic JSX.
 * @property {Jsx} jsxs
 *   Static JSX.
 * @property {JsxDev | null | undefined} [jsxDEV]
 *   Development JSX.
 * @property {false | null | undefined} [development]
 *   Whether to use `jsxDEV` (when on) or `jsx` and `jsxs` (when off).
 *
 * @typedef RuntimeDevelopment
 *   Runtime fields when development is on.
 * @property {Fragment} Fragment
 *   Fragment.
 * @property {Jsx | null | undefined} [jsx]
 *   Dynamic JSX.
 * @property {Jsx | null | undefined} [jsxs]
 *   Static JSX.
 * @property {JsxDev} jsxDEV
 *   Development JSX.
 * @property {true} development
 *   Whether to use `jsxDEV` (when on) or `jsx` and `jsxs` (when off).
 *
 * @typedef {RuntimeProduction & RegularFields} Production
 *   Configuration (production).
 * @typedef {RuntimeDevelopment & RegularFields} Development
 *   Configuration (development).
 * @typedef {RuntimeUnknown & RegularFields} Unknown
 *   Configuration (production or development).
 *
 * @typedef {Unknown | Production | Development} Options
 *   Configuration.
 */

import {stringify as commas} from 'comma-separated-tokens'
import {html, svg, find, hastToReact} from 'property-information'
import {stringify as spaces} from 'space-separated-tokens'
import styleToObject from 'style-to-object'
import {pointStart} from 'unist-util-position'
import {VFileMessage} from 'vfile-message'

const own = {}.hasOwnProperty

/**
 * Transform a hast tree to preact, react, solid, svelte, vue, etc.,
 * with an automatic JSX runtime.
 *
 * @param {Node} tree
 *   Tree to transform.
 * @param {Options} options
 *   Configuration (required).
 * @returns {JSX.Element}
 *   JSX element.
 */

export function toJsxRuntime(tree, options) {
  if (!options || typeof options.Fragment === 'undefined') {
    throw new TypeError('Expected `Fragment` in options')
  }

  const filePath = options.filePath || undefined
  /** @type {Create} */
  let create

  if (options.development) {
    if (typeof options.jsxDEV !== 'function') {
      throw new TypeError(
        'Expected `jsxDEV` in options when `development: true`'
      )
    }

    create = developmentCreate(filePath, options.jsxDEV)
  } else {
    if (typeof options.jsx !== 'function') {
      throw new TypeError('Expected `jsx` in production options')
    }

    if (typeof options.jsxs !== 'function') {
      throw new TypeError('Expected `jsxs` in production options')
    }

    create = productionCreate(filePath, options.jsx, options.jsxs)
  }

  /** @type {State} */
  const state = {
    Fragment: options.Fragment,
    schema: options.space === 'svg' ? svg : html,
    components: options.components || {},
    filePath,
    create
  }

  const result = one(state, tree, undefined)

  // JSX element.
  if (result && typeof result !== 'string') {
    return result
  }

  // Text node or something that turned into nothing.
  return state.create(
    tree,
    state.Fragment,
    {children: result ? [result] : []},
    undefined
  )
}

/**
 * Transform a node.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Node} node
 *   Current node.
 * @param {string | undefined} key
 *   Key.
 * @returns {Child | void}
 *   Child, optional.
 */
function one(state, node, key) {
  if (node.type === 'element' || node.type === 'root') {
    const parentSchema = state.schema
    let schema = parentSchema

    if (
      node.type === 'element' &&
      node.tagName.toLowerCase() === 'svg' &&
      parentSchema.space === 'html'
    ) {
      schema = svg
      state.schema = schema
    }

    const children = createChildren(state, node)
    const props = createProperties(state, node)

    let type = node.type === 'root' ? state.Fragment : node.tagName

    if (typeof type === 'string' && own.call(state.components, type)) {
      const key = /** @type {keyof JSX.IntrinsicElements} */ (type)
      type = state.components[key]
    }

    props.children = children

    // Restore parent schema.
    state.schema = parentSchema

    return state.create(node, type, props, key)
  }

  if (node.type === 'text') {
    return node.value
  }
}

/**
 * @param {string | undefined} _
 *   Path to file.
 * @param {Jsx} jsx
 *   Dynamic.
 * @param {Jsx} jsxs
 *   Static.
 * @returns {Create}
 *   Create a production element.
 */
function productionCreate(_, jsx, jsxs) {
  return create
  /** @type {Create} */
  function create(_, type, props, key) {
    const isStaticChildren = props.children.length > 1
    const fn = isStaticChildren ? jsxs : jsx
    return fn(type, props, key)
  }
}

/**
 * @param {string | undefined} filePath
 *   Path to file.
 * @param {JsxDev} jsxDEV
 *   Development.
 * @returns {Create}
 *   Create a development element.
 */
function developmentCreate(filePath, jsxDEV) {
  return create
  /** @type {Create} */
  function create(node, type, props, key) {
    const isStaticChildren = props.children.length > 1
    const point = pointStart(node)
    return jsxDEV(
      type,
      props,
      key,
      isStaticChildren,
      {
        fileName: filePath,
        lineNumber: point.line === null ? undefined : point.line,
        columnNumber: point.column === null ? undefined : point.column - 1
      },
      undefined
    )
  }
}

/**
 * Create children.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Parent} node
 *   Current element.
 * @returns {Array<Child>}
 *   Children.
 */
function createChildren(state, node) {
  /** @type {Array<Child>} */
  const children = []
  let index = -1
  /** @type {Map<string, number>} */
  const countsByTagName = new Map()

  while (++index < node.children.length) {
    const child = node.children[index]
    /** @type {string | undefined} */
    let key

    if (child.type === 'element') {
      const count = countsByTagName.get(child.tagName) || 0
      key = child.tagName + '-' + count
      countsByTagName.set(child.tagName, count + 1)
    }

    const result = one(state, child, key)
    if (result !== undefined) children.push(result)
  }

  return children
}

/**
 * Handle properties.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Parent} node
 *   Current element.
 * @returns {Props}
 *   Props for runtime.
 */
function createProperties(state, node) {
  /** @type {Props} */
  const props = {children: []}
  /** @type {string} */
  let prop

  if ('properties' in node && node.properties) {
    for (prop in node.properties) {
      if (prop !== 'children' && own.call(node.properties, prop)) {
        const result = createProperty(state, node, prop, node.properties[prop])

        if (result) {
          props[result[0]] = result[1]
        }
      }
    }
  }

  return props
}

/**
 * Handle a property.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Element} node
 *   Current element.
 * @param {string} prop
 *   Key.
 * @param {Array<string | number> | string | number | boolean | null | undefined} value
 *   hast property value.
 * @returns {Field | void}
 *   Field for runtime, optional.
 */
function createProperty(state, node, prop, value) {
  const info = find(state.schema, prop)

  // Ignore nullish and `NaN` values.
  if (
    value === undefined ||
    value === null ||
    (typeof value === 'number' && Number.isNaN(value))
  ) {
    return
  }

  if (Array.isArray(value)) {
    // Accept `array`.
    // Most props are space-separated.
    value = info.commaSeparated ? commas(value) : spaces(value)
  }

  // React only accepts `style` as object.
  if (info.property === 'style' && typeof value === 'string') {
    return ['style', parseStyle(state, node, value)]
  }

  return [
    info.space ? hastToReact[info.property] || info.property : info.attribute,
    value
  ]
}

/**
 * Parse a CSS declaration to an object.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Element} node
 *   Current element.
 * @param {string} value
 *   CSS declarations.
 * @returns {Style}
 *   Properties.
 * @throws
 *   Throws `VFileMessage` when CSS cannot be parsed.
 */
function parseStyle(state, node, value) {
  /** @type {Style} */
  const result = {}

  try {
    styleToObject(value, replacer)
  } catch (error_) {
    const error = /** @type {Error} */ (error_)
    const cleanMessage = error.message.replace(/^undefined:\d+:\d+: /, '')

    const message = new VFileMessage(
      'Cannot parse style attribute: ' + cleanMessage,
      node,
      'hast-util-to-jsx-runtime:style'
    )
    message.file = state.filePath || null

    throw message
  }

  return result

  /**
   * Add a CSS property (normal, so with dashes) to `result` as a camelcased
   * CSS property.
   *
   * @param {string} name
   *   Key.
   * @param {string} value
   *   Value
   * @returns {void}
   *   Nothing.
   */
  function replacer(name, value) {
    if (name.slice(0, 4) === '-ms-') name = 'ms-' + name.slice(4)
    result[name.replace(/-([a-z])/g, replace)] = value
  }
}

/**
 * Make `$1` capitalized.
 *
 * @param {string} _
 *   Whatever.
 * @param {string} $1
 *   Single ASCII alphabetical.
 * @returns {string}
 *   Capitalized `$1`.
 */
function replace(_, $1) {
  return $1.toUpperCase()
}
