// Register MDX nodes in mdast:
/// <reference types="mdast-util-mdx-expression" />
/// <reference types="mdast-util-mdx-jsx" />
/// <reference types="mdast-util-mdxjs-esm" />

/**
 * @typedef {import('estree').Identifier} Identifier
 * @typedef {import('estree').Literal} Literal
 * @typedef {import('estree').MemberExpression} MemberExpression
 * @typedef {import('estree').Expression} Expression
 * @typedef {import('estree').Program} Program
 *
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Nodes} Nodes
 * @typedef {import('hast').Parents} Parents
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Text} Text
 *
 * @typedef {import('mdast-util-mdx-expression').MdxFlowExpressionHast} MdxFlowExpression
 * @typedef {import('mdast-util-mdx-expression').MdxTextExpressionHast} MdxTextExpression
 *
 * @typedef {import('mdast-util-mdx-jsx').MdxJsxFlowElementHast} MdxJsxFlowElement
 * @typedef {import('mdast-util-mdx-jsx').MdxJsxTextElementHast} MdxJsxTextElement
 *
 * @typedef {import('mdast-util-mdxjs-esm').MdxjsEsmHast} MdxjsEsm
 *
 * @typedef {import('property-information').Schema} Schema
 *
 * @typedef {import('unist').Position} Position
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef {ReturnType<JsxFunction> | string | null | undefined} Child
 *   Child.
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @callback Create
 *   Create something in development or production.
 * @param {Nodes} node
 *   hast node.
 * @param {GetType<JsxFunction>} type
 *   Fragment symbol or tag name.
 * @param {GetProps<JsxFunction>} props
 *   Properties and children.
 * @param {GetKey<JsxFunction>} [key]
 *   Key.
 * @returns {ReturnType<JsxFunction>}
 *   Result.
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @callback CreateEvaluater
 *   Create an evaluator that turns ESTree ASTs from embedded MDX into values.
 * @returns {Evaluater<JsxFunction>}
 *   Evaluater.
 */

/**
 * @typedef {'html' | 'react'} ElementAttributeNameCase
 *   Casing to use for attribute names.
 *
 *   HTML casing is for example `class`, `stroke-linecap`, `xml:lang`.
 *   React casing is for example `className`, `strokeLinecap`, `xmlLang`.
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @callback EvaluateExpression
 *   Turn an MDX expression into a value.
 * @param {Expression} expression
 *   ESTree expression.
 * @returns {GetType<JsxFunction>}
 *   Result of expression.
 */

/**
 * @callback EvaluateProgram
 *   Turn an MDX program (export/import statements) into a value.
 * @param {Program} expression
 *   ESTree program.
 * @returns {unknown}
 *   Result of program;
 *   should likely be `undefined` as ESM changes the scope but doesn’t yield
 *   something.
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef Evaluater
 *   Evaluator that turns ESTree ASTs from embedded MDX into values.
 * @property {EvaluateExpression<JsxFunction>} evaluateExpression
 *   Evaluate an expression.
 * @property {EvaluateProgram} evaluateProgram
 *   Evaluate a program.
 */

/**
 * @typedef {[string, Value]} Field
 *   Property field.
 */

/**
 * @template [JsxElementType=any]
 *   Element type: `Fragment` symbol, tag name (`string`), component.
 * @template [JsxProps=any]
 *   Element props, `children`, and maybe `node`.
 * @template [JsxKey=any]
 *   Dynamicly generated key to use.
 * @template [JsxElement=any]
 *   Analogous to `JSX.Element`.
 * @callback Jsx
 *   Create a production element.
 * @param {JsxElementType} type
 *   Element type: `Fragment` symbol, tag name (`string`), component.
 * @param {JsxProps} props
 *   Element props, `children`, and maybe `node`.
 * @param {JsxKey} [key]
 *   Dynamicly generated key to use.
 * @returns {JsxElement}
 *   Element from your framework.
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef {Parameters<JsxFunction>[0]} GetType
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef {Parameters<JsxFunction>[1]} GetProps
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef {Parameters<JsxFunction>[2]} GetKey
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @callback JsxDev
 *   Create a development element.
 * @param {GetType<JsxFunction>} type
 *   Element type: `Fragment` symbol, tag name (`string`), component.
 * @param {GetProps<JsxFunction>} props
 *   Element props, `children`, and maybe `node`.
 * @param {GetKey<JsxFunction> | undefined} key
 *   Dynamicly generated key to use.
 * @param {boolean} isStaticChildren
 *   Whether two or more children are passed (in an array), which is whether
 *   `jsxs` or `jsx` would be used.
 * @param {Source} [source]
 *   Info about source.
 * @param {any} [self]
 *   Nothing (this is used by frameworks that have components, we don’t).
 * @returns {ReturnType<JsxFunction>}
 *   Element from your framework.
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef {{
 *   children?: Array<Child<JsxFunction>> | Child<JsxFunction>, node?: Element | MdxJsxFlowElement  | MdxJsxTextElement  | undefined,
 *   [prop: string]: Array<Child<JsxFunction>> | Child<JsxFunction> | Element | MdxJsxFlowElement | MdxJsxTextElement | Value | undefined
 * }} Props
 *   Properties and children.
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef RegularFields
 *   Configuration.
 * @property {Record<string, GetType<JsxFunction>>} [components]
 *   Components to use (optional).
 * @property {CreateEvaluater<JsxFunction> | null | undefined} [createEvaluater]
 *   Create an evaluator that turns ESTree ASTs into values (optional).
 * @property {ElementAttributeNameCase | null | undefined} [elementAttributeNameCase='react']
 *   Specify casing to use for attribute names (default: `'react'`).
 * @property {string | null | undefined} [filePath]
 *   File path to the original source file (optional).
 *
 *   Passed in source info to `jsxDEV` when using the automatic runtime with
 *   `development: true`.
 * @property {boolean | null | undefined} [ignoreInvalidStyle=false]
 *   Ignore invalid CSS in `style` props (default: `false`);
 *   the default behavior is to throw an error.
 * @property {boolean | null | undefined} [passKeys=true]
 *   Generate keys to optimize frameworks that support them (default: `true`).
 *
 *   > 👉 **Note**: Solid currently fails if keys are passed.
 * @property {boolean | null | undefined} [passNode=false]
 *   Pass the hast element node to components (default: `false`).
 * @property {Space | null | undefined} [space='html']
 *   Whether `tree` is in the `'html'` or `'svg'` space (default: `'html'`).
 *
 *   When an `<svg>` element is found in the HTML space, this package already
 *   automatically switches to and from the SVG space when entering and exiting
 *   it.
 * @property {StylePropertyNameCase | null | undefined} [stylePropertyNameCase='dom']
 *   Specify casing to use for property names in `style` objects (default:
 *   `'dom'`).
 * @property {boolean | null | undefined} [tableCellAlignToStyle=true]
 *   Turn obsolete `align` props on `td` and `th` into CSS `style` props
 *   (default: `true`).
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef RuntimeDevelopment
 *   Runtime fields when development is on.
 * @property {GetType<JsxFunction>} Fragment
 *   Fragment.
 * @property {true} development
 *   Whether to use `jsxDEV` (when on) or `jsx` and `jsxs` (when off).
 * @property {JsxFunction | null | undefined} [jsx]
 *   Dynamic JSX (optional).
 * @property {JsxDev<JsxFunction>} jsxDEV
 *   Development JSX.
 * @property {JsxFunction | null | undefined} [jsxs]
 *   Static JSX (optional).
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef RuntimeProduction
 *   Runtime fields when development is off.
 * @property {GetType<JsxFunction>} Fragment
 *   Fragment.
 * @property {false | null | undefined} [development]
 *   Whether to use `jsxDEV` (when on) or `jsx` and `jsxs` (when off) (optional).
 * @property {JsxFunction} jsx
 *   Dynamic JSX.
 * @property {JsxFunction} jsxs
 *   Static JSX.
 * @property {Record<string, GetType<JsxFunction>>} [components]
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef RuntimeUnknown
 *   Runtime fields when development might be on or off.
 * @property {GetType<JsxFunction>} Fragment
 *   Fragment.
 * @property {boolean} development
 *   Whether to use `jsxDEV` (when on) or `jsx` and `jsxs` (when off).
 * @property {JsxFunction | null | undefined} [jsx]
 *   Dynamic JSX (optional).
 * @property {JsxDev<JsxFunction> | null | undefined} [jsxDEV]
 *   Development JSX (optional).
 * @property {JsxFunction | null | undefined} [jsxs]
 *   Static JSX (optional).
 */

/**
 * @typedef Source
 *   Info about source.
 * @property {number | undefined} columnNumber
 *   Column where thing starts (0-indexed).
 * @property {string | undefined} fileName
 *   Name of source file.
 * @property {number | undefined} lineNumber
 *   Line where thing starts (1-indexed).
 */

/**
 * @typedef {'html' | 'svg'} Space
 *   Namespace.
 *
 *   > 👉 **Note**: hast is not XML.
 *   > It supports SVG as embedded in HTML.
 *   > It does not support the features available in XML.
 *   > Passing SVG might break but fragments of modern SVG should be fine.
 *   > Use `xast` if you need to support SVG as XML.
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef State
 *   Info passed around.
 * @property {GetType<JsxFunction>} Fragment
 *   Fragment symbol.
 * @property {Array<Parents>} ancestors
 *   Stack of parents.
 * @property {Record<string, GetType<JsxFunction>>} components
 *   Components to swap.
 * @property {Create<JsxFunction>} create
 *   Create something in development or production.
 * @property {ElementAttributeNameCase} elementAttributeNameCase
 *   Casing to use for attribute names.
 * @property {Evaluater<JsxFunction> | undefined} evaluater
 *   Evaluator that turns ESTree ASTs into values.
 * @property {string | undefined} filePath
 *   File path.
 * @property {boolean} ignoreInvalidStyle
 *   Ignore invalid CSS in `style` props.
 * @property {boolean} passKeys
 *   Generate keys to optimize frameworks that support them.
 * @property {boolean} passNode
 *   Pass `node` to components.
 * @property {Schema} schema
 *   Current schema.
 * @property {StylePropertyNameCase} stylePropertyNameCase
 *   Casing to use for property names in `style` objects.
 * @property {boolean} tableCellAlignToStyle
 *   Turn obsolete `align` props on `td` and `th` into CSS `style` props.
 */

/**
 * @typedef {Record<string, string>} Style
 *   Style map.
 */

/**
 * @typedef {'css' | 'dom'} StylePropertyNameCase
 *   Casing to use for property names in `style` objects.
 *
 *   CSS casing is for example `background-color` and `-webkit-line-clamp`.
 *   DOM casing is for example `backgroundColor` and `WebkitLineClamp`.
 */

/**
 * @typedef {Style | boolean | number | string} Value
 *   Primitive property value and `Style` map.
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef {RuntimeDevelopment<JsxFunction> & RegularFields<JsxFunction>} Development
 *   Configuration (development).
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef {Development<JsxFunction> | Production<JsxFunction>} Options
 *   Configuration.
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef {RegularFields<JsxFunction> & RuntimeProduction<JsxFunction>} Production
 *   Configuration (production).
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @typedef {RegularFields<JsxFunction> & RuntimeUnknown<JsxFunction>} Unknown
 *   Configuration (production or development).
 */

import {stringify as commas} from 'comma-separated-tokens'
import {ok as assert} from 'devlop'
import {name as isIdentifierName} from 'estree-util-is-identifier-name'
import {whitespace} from 'hast-util-whitespace'
import {find, hastToReact, html, svg} from 'property-information'
import {stringify as spaces} from 'space-separated-tokens'
import styleToObject from 'style-to-object'
import {pointStart} from 'unist-util-position'
import {VFileMessage} from 'vfile-message'

const own = {}.hasOwnProperty

/** @type {Map<string, number>} */
const emptyMap = new Map()

const cap = /[A-Z]/g
const dashSomething = /-([a-z])/g

// `react-dom` triggers a warning for *any* white space in tables.
// To follow GFM, `mdast-util-to-hast` injects line endings between elements.
// Other tools might do so too, but they don’t do here, so we remove all of
// that.

// See: <https://github.com/facebook/react/pull/7081>.
// See: <https://github.com/facebook/react/pull/7515>.
// See: <https://github.com/remarkjs/remark-react/issues/64>.
// See: <https://github.com/rehypejs/rehype-react/pull/29>.
// See: <https://github.com/rehypejs/rehype-react/pull/32>.
// See: <https://github.com/rehypejs/rehype-react/pull/45>.
const tableElements = new Set(['table', 'tbody', 'thead', 'tfoot', 'tr'])

const tableCellElement = new Set(['td', 'th'])

const docs = 'https://github.com/syntax-tree/hast-util-to-jsx-runtime'

/**
 * Transform a hast tree to preact, react, solid, svelte, vue, etc.,
 * with an automatic JSX runtime.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {Nodes} tree
 *   Tree to transform.
 * @param {Options<JsxFunction>} options
 *   Configuration (required).
 * @returns {ReturnType<JsxFunction>}
 *   JSX element.
 */

export function toJsxRuntime(tree, options) {
  if (!options || options.Fragment === undefined) {
    throw new TypeError('Expected `Fragment` in options')
  }

  const filePath = options.filePath || undefined
  /** @type {Create<JsxFunction>} */
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

  /** @type {State<JsxFunction>} */
  const state = {
    Fragment: options.Fragment,
    ancestors: [],
    components: options.components || {},
    create,
    elementAttributeNameCase: options.elementAttributeNameCase || 'react',
    evaluater: options.createEvaluater ? options.createEvaluater() : undefined,
    filePath,
    ignoreInvalidStyle: options.ignoreInvalidStyle || false,
    passKeys: options.passKeys !== false,
    passNode: options.passNode || false,
    schema: options.space === 'svg' ? svg : html,
    stylePropertyNameCase: options.stylePropertyNameCase || 'dom',
    tableCellAlignToStyle: options.tableCellAlignToStyle !== false
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
    {children: result || undefined},
    undefined
  )
}

/**
 * Transform a node.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} state
 *   Info passed around.
 * @param {Nodes} node
 *   Current node.
 * @param {string | undefined} key
 *   Key.
 * @returns {Child<JsxFunction> | undefined}
 *   Child, optional.
 */
function one(state, node, key) {
  if (node.type === 'element') {
    return element(state, node, key)
  }

  if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') {
    return mdxExpression(state, node)
  }

  if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
    return mdxJsxElement(state, node, key)
  }

  if (node.type === 'mdxjsEsm') {
    return mdxEsm(state, node)
  }

  if (node.type === 'root') {
    return root(state, node, key)
  }

  if (node.type === 'text') {
    return text(state, node)
  }
}

/**
 * Handle element.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} state
 *   Info passed around.
 * @param {Element} node
 *   Current node.
 * @param {string | undefined} key
 *   Key.
 * @returns {Child<JsxFunction> | undefined}
 *   Child, optional.
 */
function element(state, node, key) {
  const parentSchema = state.schema
  let schema = parentSchema

  if (node.tagName.toLowerCase() === 'svg' && parentSchema.space === 'html') {
    schema = svg
    state.schema = schema
  }

  state.ancestors.push(node)

  const type = findComponentFromName(state, node.tagName, false)
  const props = createElementProps(state, node)
  let children = createChildren(state, node)

  if (tableElements.has(node.tagName)) {
    children = children.filter(function (child) {
      return typeof child === 'string' ? !whitespace(child) : true
    })
  }

  addNode(state, props, type, node)
  addChildren(props, children)

  // Restore.
  state.ancestors.pop()
  state.schema = parentSchema

  return state.create(node, type, props, key)
}

/**
 * Handle MDX expression.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} state
 *   Info passed around.
 * @param {MdxFlowExpression | MdxTextExpression} node
 *   Current node.
 * @returns {Child<JsxFunction> | undefined}
 *   Child, optional.
 */
function mdxExpression(state, node) {
  if (node.data && node.data.estree && state.evaluater) {
    const program = node.data.estree
    const expression = program.body[0]
    assert(expression.type === 'ExpressionStatement')

    // Assume result is a child.
    return /** @type {Child<JsxFunction> | undefined} */ (
      state.evaluater.evaluateExpression(expression.expression)
    )
  }

  crashEstree(state, node.position)
}

/**
 * Handle MDX ESM.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} state
 *   Info passed around.
 * @param {MdxjsEsm} node
 *   Current node.
 * @returns {Child<JsxFunction> | undefined}
 *   Child, optional.
 */
function mdxEsm(state, node) {
  if (node.data && node.data.estree && state.evaluater) {
    // Assume result is a child.
    return /** @type {Child<JsxFunction> | undefined} */ (
      state.evaluater.evaluateProgram(node.data.estree)
    )
  }

  crashEstree(state, node.position)
}

/**
 * Handle MDX JSX.
 *
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} state
 *   Info passed around.
 * @param {MdxJsxFlowElement | MdxJsxTextElement} node
 *   Current node.
 * @param {string | undefined} key
 *   Key.
 * @returns {Child<JsxFunction> | undefined}
 *   Child, optional.
 */
function mdxJsxElement(state, node, key) {
  const parentSchema = state.schema
  let schema = parentSchema

  if (node.name === 'svg' && parentSchema.space === 'html') {
    schema = svg
    state.schema = schema
  }

  state.ancestors.push(node)

  const type =
    node.name === null
      ? state.Fragment
      : findComponentFromName(state, node.name, true)
  const props = createJsxElementProps(state, node)
  const children = createChildren(state, node)

  addNode(state, props, type, node)
  addChildren(props, children)

  // Restore.
  state.ancestors.pop()
  state.schema = parentSchema

  return state.create(node, type, props, key)
}

/**
 * Handle root.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} state
 *   Info passed around.
 * @param {Root} node
 *   Current node.
 * @param {string | undefined} key
 *   Key.
 * @returns {Child<JsxFunction> | undefined}
 *   Child, optional.
 */
function root(state, node, key) {
  /** @type {Props<JsxFunction>} */
  const props = {}

  addChildren(props, createChildren(state, node))

  return state.create(node, state.Fragment, props, key)
}

/**
 * Handle text.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} _
 *   Info passed around.
 * @param {Text} node
 *   Current node.
 * @returns {Child<JsxFunction> | undefined}
 *   Child, optional.
 */
function text(_, node) {
  return node.value
}

/**
 * Add `node` to props.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} state
 *   Info passed around.
 * @param {Props<JsxFunction>} props
 *   Props.
 * @param {unknown} type
 *   Type.
 * @param {Element | MdxJsxFlowElement | MdxJsxTextElement} node
 *   Node.
 * @returns {undefined}
 *   Nothing.
 */
function addNode(state, props, type, node) {
  // If this is swapped out for a component:
  if (typeof type !== 'string' && type !== state.Fragment && state.passNode) {
    props.node = node
  }
}

/**
 * Add children to props.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {Props<JsxFunction>} props
 *   Props.
 * @param {Array<Child<JsxFunction>>} children
 *   Children.
 * @returns {undefined}
 *   Nothing.
 */
function addChildren(props, children) {
  if (children.length > 0) {
    const value = children.length > 1 ? children : children[0]

    if (value) {
      props.children = value
    }
  }
}

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {string | undefined} _
 *   Path to file.
 * @param {JsxFunction} jsx
 *   Dynamic.
 * @param {JsxFunction} jsxs
 *   Static.
 * @returns {Create<JsxFunction>}
 *   Create a production element.
 */
function productionCreate(_, jsx, jsxs) {
  return create
  /** @type {Create<JsxFunction>} */
  function create(_, type, props, key) {
    // Only an array when there are 2 or more children.
    const isStaticChildren = Array.isArray(props.children)
    const fn = isStaticChildren ? jsxs : jsx
    return key ? fn(type, props, key) : fn(type, props)
  }
}

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {string | undefined} filePath
 *   Path to file.
 * @param {JsxDev<JsxFunction>} jsxDEV
 *   Development.
 * @returns {Create<JsxFunction>}
 *   Create a development element.
 */
function developmentCreate(filePath, jsxDEV) {
  return create
  /** @type {Create<JsxFunction>} */
  function create(node, type, props, key) {
    // Only an array when there are 2 or more children.
    const isStaticChildren = Array.isArray(props.children)
    const point = pointStart(node)
    return jsxDEV(
      type,
      props,
      key,
      isStaticChildren,
      {
        columnNumber: point ? point.column - 1 : undefined,
        fileName: filePath,
        lineNumber: point ? point.line : undefined
      },
      undefined
    )
  }
}

/**
 * Create props from an element.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} state
 *   Info passed around.
 * @param {Element} node
 *   Current element.
 * @returns {Props<JsxFunction>}
 *   Props.
 */
function createElementProps(state, node) {
  /** @type {Props<JsxFunction>} */
  const props = {}
  /** @type {string | undefined} */
  let alignValue
  /** @type {string} */
  let prop

  for (prop in node.properties) {
    if (prop !== 'children' && own.call(node.properties, prop)) {
      const result = createProperty(state, prop, node.properties[prop])

      if (result) {
        const [key, value] = result

        if (
          state.tableCellAlignToStyle &&
          key === 'align' &&
          typeof value === 'string' &&
          tableCellElement.has(node.tagName)
        ) {
          alignValue = value
        } else {
          props[key] = value
        }
      }
    }
  }

  if (alignValue) {
    // Assume style is an object.
    const style = /** @type {Style} */ (props.style || (props.style = {}))
    style[state.stylePropertyNameCase === 'css' ? 'text-align' : 'textAlign'] =
      alignValue
  }

  return props
}

/**
 * Create props from a JSX element.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} state
 *   Info passed around.
 * @param {MdxJsxFlowElement | MdxJsxTextElement} node
 *   Current JSX element.
 * @returns {Props<JsxFunction>}
 *   Props.
 */
function createJsxElementProps(state, node) {
  /** @type {Props<JsxFunction>} */
  const props = {}

  for (const attribute of node.attributes) {
    if (attribute.type === 'mdxJsxExpressionAttribute') {
      if (attribute.data && attribute.data.estree && state.evaluater) {
        const program = attribute.data.estree
        const expression = program.body[0]
        assert(expression.type === 'ExpressionStatement')
        const objectExpression = expression.expression
        assert(objectExpression.type === 'ObjectExpression')
        const property = objectExpression.properties[0]
        assert(property.type === 'SpreadElement')

        Object.assign(
          props,
          state.evaluater.evaluateExpression(property.argument)
        )
      } else {
        crashEstree(state, node.position)
      }
    } else {
      // For JSX, the author is responsible of passing in the correct values.
      const name = attribute.name
      /** @type {unknown} */
      let value

      if (attribute.value && typeof attribute.value === 'object') {
        if (
          attribute.value.data &&
          attribute.value.data.estree &&
          state.evaluater
        ) {
          const program = attribute.value.data.estree
          const expression = program.body[0]
          assert(expression.type === 'ExpressionStatement')
          value = state.evaluater.evaluateExpression(expression.expression)
        } else {
          crashEstree(state, node.position)
        }
      } else {
        value = attribute.value === null ? true : attribute.value
      }

      // Assume a prop.
      props[name] =
        /** @type {Props<JsxFunction>[keyof Props<JsxFunction>]} */ (value)
    }
  }

  return props
}

/**
 * Create children.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} state
 *   Info passed around.
 * @param {Parents} node
 *   Current element.
 * @returns {Array<Child<JsxFunction>>}
 *   Children.
 */
function createChildren(state, node) {
  /** @type {Array<Child<JsxFunction>>} */
  const children = []
  let index = -1
  /** @type {Map<string, number>} */
  // Note: test this when Solid doesn’t want to merge my upcoming PR.
  /* c8 ignore next */
  const countsByName = state.passKeys ? new Map() : emptyMap

  while (++index < node.children.length) {
    const child = node.children[index]
    /** @type {string | undefined} */
    let key

    if (state.passKeys) {
      const name =
        child.type === 'element'
          ? child.tagName
          : child.type === 'mdxJsxFlowElement' ||
              child.type === 'mdxJsxTextElement'
            ? child.name
            : undefined

      if (name) {
        const count = countsByName.get(name) || 0
        key = name + '-' + count
        countsByName.set(name, count + 1)
      }
    }

    const result = one(state, child, key)
    if (result !== undefined) children.push(result)
  }

  return children
}

/**
 * Handle a property.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} state
 *   Info passed around.
 * @param {string} prop
 *   Key.
 * @param {Array<number | string> | boolean | number | string | null | undefined} value
 *   hast property value.
 * @returns {Field | undefined}
 *   Field for runtime, optional.
 */
function createProperty(state, prop, value) {
  const info = find(state.schema, prop)

  // Ignore nullish and `NaN` values.
  if (
    value === null ||
    value === undefined ||
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
  if (info.property === 'style') {
    let styleObject =
      typeof value === 'object' ? value : parseStyle(state, String(value))

    if (state.stylePropertyNameCase === 'css') {
      styleObject = transformStylesToCssCasing(styleObject)
    }

    return ['style', styleObject]
  }

  return [
    state.elementAttributeNameCase === 'react' && info.space
      ? hastToReact[info.property] || info.property
      : info.attribute,
    value
  ]
}

/**
 * Parse a CSS declaration to an object.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} state
 *   Info passed around.
 * @param {string} value
 *   CSS declarations.
 * @returns {Style}
 *   Properties.
 * @throws
 *   Throws `VFileMessage` when CSS cannot be parsed.
 */
function parseStyle(state, value) {
  /** @type {Style} */
  const result = {}

  try {
    styleToObject(value, replacer)
  } catch (error) {
    if (!state.ignoreInvalidStyle) {
      const cause = /** @type {Error} */ (error)
      const message = new VFileMessage('Cannot parse `style` attribute', {
        ancestors: state.ancestors,
        cause,
        ruleId: 'style',
        source: 'hast-util-to-jsx-runtime'
      })
      message.file = state.filePath || undefined
      message.url = docs + '#cannot-parse-style-attribute'

      throw message
    }
  }

  return result

  /**
   * Add a CSS property (normal, so with dashes) to `result` as a DOM CSS
   * property.
   *
   * @param {string} name
   *   Key.
   * @param {string} value
   *   Value
   * @returns {undefined}
   *   Nothing.
   */
  function replacer(name, value) {
    let key = name

    if (key.slice(0, 2) !== '--') {
      if (key.slice(0, 4) === '-ms-') key = 'ms-' + key.slice(4)
      key = key.replace(dashSomething, toCamel)
    }

    result[key] = value
  }
}

/**
 * Create a JSX name from a string.
 *
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} state
 *   To do.
 * @param {string} name
 *   Name.
 * @param {boolean} allowExpression
 *   Allow member expressions and identifiers.
 * @returns {GetType<JsxFunction>}
 *   To do.
 */
function findComponentFromName(state, name, allowExpression) {
  /** @type {Identifier | Literal | MemberExpression} */
  let result

  if (!allowExpression) {
    result = {type: 'Literal', value: name}
  } else if (name.includes('.')) {
    const identifiers = name.split('.')
    let index = -1
    /** @type {Identifier | Literal | MemberExpression | undefined} */
    let node

    while (++index < identifiers.length) {
      /** @type {Identifier | Literal} */
      const prop = isIdentifierName(identifiers[index])
        ? {type: 'Identifier', name: identifiers[index]}
        : {type: 'Literal', value: identifiers[index]}
      node = node
        ? {
            type: 'MemberExpression',
            object: node,
            property: prop,
            computed: Boolean(index && prop.type === 'Literal'),
            optional: false
          }
        : prop
    }

    assert(node, 'always a result')
    result = node
  } else {
    result =
      isIdentifierName(name) && !/^[a-z]/.test(name)
        ? {type: 'Identifier', name}
        : {type: 'Literal', value: name}
  }

  // Only literals can be passed in `components` currently.
  // No identifiers / member expressions.
  if (result.type === 'Literal') {
    const name = /** @type {Extract<GetType<JsxFunction>, string>} */ (
      result.value
    )

    return own.call(state.components, name) ? state.components[name] : name
  }

  // Assume component.
  if (state.evaluater) {
    return state.evaluater.evaluateExpression(result)
  }

  crashEstree(state)
}

/**
 * @template {Jsx} [JsxFunction=Jsx]
 *   The type of the `jsx` function impoted from `${jsxImportSource}/jsx-runtime`.
 * @param {State<JsxFunction>} state
 * @param {Position | undefined} [place]
 * @returns {never}
 */
function crashEstree(state, place) {
  const message = new VFileMessage(
    'Cannot handle MDX estrees without `createEvaluater`',
    {
      ancestors: state.ancestors,
      place,
      ruleId: 'mdx-estree',
      source: 'hast-util-to-jsx-runtime'
    }
  )
  message.file = state.filePath || undefined
  message.url = docs + '#cannot-handle-mdx-estrees-without-createevaluater'

  throw message
}

/**
 * Transform a DOM casing style object to a CSS casing style object.
 *
 * @param {Style} domCasing
 * @returns {Style}
 */
function transformStylesToCssCasing(domCasing) {
  /** @type {Style} */
  const cssCasing = {}
  /** @type {string} */
  let from

  for (from in domCasing) {
    if (own.call(domCasing, from)) {
      cssCasing[transformStyleToCssCasing(from)] = domCasing[from]
    }
  }

  return cssCasing
}

/**
 * Transform a DOM casing style field to a CSS casing style field.
 *
 * @param {string} from
 * @returns {string}
 */
function transformStyleToCssCasing(from) {
  let to = from.replace(cap, toDash)
  // Handle `ms-xxx` -> `-ms-xxx`.
  if (to.slice(0, 3) === 'ms-') to = '-' + to
  return to
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
function toCamel(_, $1) {
  return $1.toUpperCase()
}

/**
 * Make `$0` dash cased.
 *
 * @param {string} $0
 *   Capitalized ASCII leter.
 * @returns {string}
 *   Dash and lower letter.
 */
function toDash($0) {
  return '-' + $0.toLowerCase()
}
