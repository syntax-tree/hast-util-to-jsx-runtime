// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/68600
declare module 'react/jsx-runtime' {
  import {ElementType, Fragment, Key, ReactElement} from 'react'

  function jsx(type: ElementType, props: unknown, key?: Key): ReactElement

  export {Fragment, jsx, jsx as jsxs}
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/68600
declare module 'react/jsx-dev-runtime' {
  import {ElementType, Fragment, Key, ReactElement} from 'react'
  import {Source} from 'hast-util-to-jsx-runtime'

  function jsxDEV(
    type: ElementType,
    props: unknown,
    key: Key | undefined,
    isStatic: boolean,
    source?: Source,
    self?: unknown
  ): ReactElement

  export {Fragment, jsxDEV}
}

declare module 'https://esm.sh/hastscript@8?dev' {
  export * from 'hastscript'
}
