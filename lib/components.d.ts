import type {Element} from 'hast'

/**
 * Basic functional component: given props, returns an element.
 *
 * @typeParam ComponentProps
 *   Props type.
 * @param props
 *   Props.
 * @returns
 *   Result.
 */
export type FunctionComponent<JsxElement, ComponentProps> = (
  props: ComponentProps
) => JsxElement | string | null | undefined

/**
 * Class component: given props, returns an instance.
 *
 * @typeParam ComponentProps
 *   Props type.
 * @param props
 *   Props.
 * @returns
 *   Instance.
 */
export type ClassComponent<JsxElementClass, ComponentProps> = new (
  props: ComponentProps
) => JsxElementClass

/**
 * Function or class component.
 *
 * You can access props at `LocalJsx.IntrinsicElements`.
 * For example, to find props for `a`, use `LocalJsx.IntrinsicElements['a']`.
 *
 * @typeParam ComponentProps
 *   Props type.
 */
export type Component<JsxElement, JsxElementClass, ComponentProps> =
  | ClassComponent<JsxElementClass, ComponentProps>
  | FunctionComponent<JsxElement, ComponentProps>

/**
 * Extra fields we pass.
 */
export type ExtraProps = {node?: Element | undefined}

/**
 * Possible components to use.
 *
 * Each key is a tag name typed in `LocalJsx.IntrinsicElements`.
 * Each value is either a different tag name, or a component accepting the
 * corresponding props (and an optional `node` prop if `passNode` is on).
 *
 * You can access props at `LocalJsx.IntrinsicElements`.
 * For example, to find props for `a`, use `LocalJsx.IntrinsicElements['a']`.
 */
// Note: this type has to be in `.ts` or `.d.ts`, otherwise TSC hardcodes
// react into the `.d.ts` file.
export type Components<JsxElement, JsxElementClass, JsxIntrinsicElements> = {
  [TagName in keyof JsxIntrinsicElements]:
    | Component<
        JsxElement,
        JsxElementClass,
        JsxIntrinsicElements[TagName] & ExtraProps
      >
    | keyof JsxIntrinsicElements
}
