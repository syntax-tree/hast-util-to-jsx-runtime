/**
 * @typedef {unknown} Components
 * @typedef {unknown} ExtraProps
 * @typedef {import('./lib/index.js').ElementAttributeNameCase} ElementAttributeNameCase
 * @typedef {import('./lib/index.js').EvaluateProgram} EvaluateProgram
 * @typedef {unknown} Fragment
 * @typedef {import('./lib/index.js').Source} Source
 * @typedef {import('./lib/index.js').Space} Space
 * @typedef {import('./lib/index.js').StylePropertyNameCase} StylePropertyNameCase
 */

/**
 * @template [JsxElementType=any]
 * @template [JsxProps=any]
 * @template [JsxKey=any]
 * @template [JsxElement=any]
 * @typedef {import('./lib/index.js').Jsx} Jsx
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 * @typedef {import('./lib/index.js').CreateEvaluater<JsxFunction>} CreateEvaluater
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 * @typedef {import('./lib/index.js').EvaluateExpression<JsxFunction>} EvaluateExpression
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 * @typedef {import('./lib/index.js').Evaluater<JsxFunction>} Evaluater
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 * @typedef {import('./lib/index.js').JsxDev<JsxFunction>} JsxDev
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 * @typedef {import('./lib/index.js').Options<JsxFunction>} Options
 */

/**
 * @template {Jsx} [JsxFunction=Jsx]
 * @typedef {import('./lib/index.js').Props<JsxFunction>} Props
 */

export {toJsxRuntime} from './lib/index.js'
