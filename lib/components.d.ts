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
export type FunctionComponent<ComponentProps> = (
  props: ComponentProps
) => JSX.Element | string | null | undefined

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
export type ClassComponent<ComponentProps> = new (
  props: ComponentProps
) => JSX.ElementClass

/**
 * Function or class component.
 *
 * You can access props at `JSX.IntrinsicElements`.
 * For example, to find props for `a`, use `JSX.IntrinsicElements['a']`.
 *
 * @typeParam ComponentProps
 *   Props type.
 */
export type Component<ComponentProps> =
  | FunctionComponent<ComponentProps>
  | ClassComponent<ComponentProps>

/**
 * Possible components to use.
 *
 * Each key is a tag name typed in `JSX.IntrinsicElements`.
 * Each value is a component accepting the corresponding props or a different
 * tag name.
 *
 * You can access props at `JSX.IntrinsicElements`.
 * For example, to find props for `a`, use `JSX.IntrinsicElements['a']`.

 */
export type Components = {
  [TagName in keyof JSX.IntrinsicElements]:
    | Component<JSX.IntrinsicElements[TagName]>
    | keyof JSX.IntrinsicElements
}
