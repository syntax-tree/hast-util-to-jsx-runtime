# hast-util-to-jsx-runtime

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

hast utility to transform a tree to preact, react, solid, svelte, vue, etc.,
with an automatic JSX runtime.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`toJsxRuntime(tree, options)`](#tojsxruntimetree-options)
    *   [`Options`](#options)
    *   [`Fragment`](#fragment-1)
    *   [`Jsx`](#jsx-1)
    *   [`JsxDev`](#jsxdev-1)
    *   [`Props`](#props)
    *   [`Source`](#source)
    *   [`Space`](#space-1)
*   [Examples](#examples)
    *   [Example: Preact](#example-preact)
    *   [Example: Vue](#example-vue)
    *   [Example: Solid](#example-solid)
    *   [Example: Svelte](#example-svelte)
*   [Syntax](#syntax)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a utility that takes a [hast][] tree and an
[automatic JSX runtime][jsx-runtime] and turns the tree into anything you
whish.

## When should I use this?

You can use this package when you have a hast syntax tree and want to use it
with whatever framework.

This package uses an automatic JSX runtime, which is a sort of lingua franca
for frameworks to support JSX.

Notably, automatic runtimes have support for passing extra information in
development, and have guaranteed support for fragments.

## Install

This package is [ESM only][esm].
In Node.js (version 14.14+ and 16.0+), install with [npm][]:

```sh
npm install hast-util-to-jsx-runtime
```

In Deno with [`esm.sh`][esmsh]:

```js
import {toJsxRuntime} from "https://esm.sh/hast-util-to-jsx-runtime@1"
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {toJsxRuntime} from "https://esm.sh/hast-util-to-jsx-runtime@1?bundle"
</script>
```

## Use

```js
import {h} from 'hastscript'
import {toJsxRuntime} from 'hast-util-to-jsx-runtime'
import {Fragment, jsx, jsxs} from 'react/jsx-runtime'
import {renderToStaticMarkup} from 'react-dom/server'

const tree = h('h1', 'Hello, world!')

const doc = renderToStaticMarkup(toJsxRuntime(tree, {Fragment, jsx, jsxs}))

console.log(doc)
```

Yields:

```html
<h1>Hello, world!</h1>
```

## API

This package exports the identifier [`toJsxRuntime`][tojsxruntime].
There is no default export.

### `toJsxRuntime(tree, options)`

Transform a hast tree to preact, react, solid, svelte, vue, etc., with an
automatic JSX runtime.

###### Parameters

*   `tree` ([`Node`][node])
    — tree to transform
*   `options` ([`Options`][options], required)
    — configuration

###### Returns

Result from your configured JSX runtime (`JSX.Element`).

### `Options`

Configuration (TypeScript type).

##### Fields

###### `Fragment`

Fragment ([`Fragment`][fragment], required).

###### `jsx`

Dynamic JSX ([`Jsx`][jsx], required in production).

###### `jsxs`

Static JSX ([`Jsx`][jsx], required in production).

###### `jsxDEV`

Development JSX ([`JsxDev`][jsxdev], required in development).

###### `development`

Whether to use `jsxDEV` when on or `jsx` and `jsxs` when off (`boolean`,
default: `false`).

###### `filePath`

File path to the original source file (`string`, optional).

Passed in source info to `jsxDEV` when using the automatic runtime with
`development: true`.

###### `space`

Whether `tree` is in the `'html'` or `'svg'` space ([`Space`][space], default:
`'html'`).

When an `<svg>` element is found in the HTML space, this package already
automatically switches to and from the SVG space when entering and exiting
it.

> 👉 **Note**: hast is not XML.
> It supports SVG as embedded in HTML.
> It does not support the features available in XML.
> Passing SVG might break but fragments of modern SVG should be fine.
> Use `xast` if you need to support SVG as XML.

### `Fragment`

Represent the children, typically a symbol (TypeScript type).

###### Type

```ts
type Fragment = unknown
```

### `Jsx`

Create a production element (TypeScript type).

###### Parameters

*   `type` (`unknown`)
    — element type: the `Fragment` symbol or a tag name (`string`)
*   `props` ([`Props`][props])
    — element props and also includes `children`
*   `key` (`string` or `undefined`)
    — dynamicly generated key to use

###### Returns

An element from your framework (`JSX.Element`).

### `JsxDev`

Create a development element (TypeScript type).

###### Parameters

*   `type` (`unknown`)
    — element type: the `Fragment` symbol or a tag name (`string`)
*   `props` ([`Props`][props])
    — element props and also includes `children`
*   `key` (`string` or `undefined`)
    — dynamicly generated key to use
*   `isStaticChildren` (`boolean`)
    — whether more than one children are used
*   `source` ([`Source`][source])
    — info about source
*   `self` (`undefined`)
    — nothing (this is used by frameworks that have components, we don’t)

###### Returns

An element from your framework (`JSX.Element`).

### `Props`

Properties and children (TypeScript type).

###### Type

```ts
type Props = {
  children: Array<JSX.Element | string>
  [prop: string]:
    | string
    | number
    | boolean
    | Record<string, string> // For `style`.
    | Array<JSX.Element | string> // For `children`.
}
```

### `Source`

Info about source (TypeScript type).

###### Fields

*   `fileName` (`string` or `undefined`)
    — name of source file
*   `lineNumber` (`number` or `undefined`)
    — line where thing starts (1-indexed)
*   `columnNumber` (`number` or `undefined`)
    — column where thing starts (0-indexed)

### `Space`

Namespace (TypeScript type).

###### Type

```ts
type Space = 'html' | 'svg'
```

## Examples

### Example: Preact

```js
import {h} from 'hastscript'
import {toJsxRuntime} from 'hast-util-to-jsx-runtime'
import {Fragment, jsx, jsxs} from 'preact/jsx-runtime'
import {render} from 'preact-render-to-string'

const result = render(toJsxRuntime(h('h1', 'hi!'), {Fragment, jsx, jsxs}))

console.log(result)
```

Yields:

```html
<h1>hi!</h1>
```

### Example: Vue

```js
import {h} from 'hastscript'
import {toJsxRuntime} from 'hast-util-to-jsx-runtime'
import {Fragment, jsx, jsxs} from 'vue-jsx-runtime/jsx-runtime'
import serverRenderer from '@vue/server-renderer'

console.log(
  await serverRenderer.renderToString(
    toJsxRuntime(h('h1', 'hi!'), {Fragment, jsx, jsxs})
  )
)
```

Yields:

```html
<h1>hi!</h1>
```

### Example: Solid

```js
import {h} from 'hastscript'
import {toJsxRuntime} from 'hast-util-to-jsx-runtime'
import {Fragment, jsx, jsxs} from 'solid-jsx/jsx-runtime'

console.log(toJsxRuntime(h('h1', 'hi!'), {Fragment, jsx, jsxs}).t)
```

Yields:

```html
<h1 >hi!</h1>
```

### Example: Svelte

I have no clue how to render a Svelte component in Node, but you can get that
component with:

```js
import {h} from 'hastscript'
import {toJsxRuntime} from 'hast-util-to-jsx-runtime'
import {Fragment, jsx, jsxs} from 'svelte-jsx'

const svelteComponent = toJsxRuntime(h('h1', 'hi!'), {Fragment, jsx, jsxs})

console.log(svelteComponent)
```

Yields:

```text
[class Component extends SvelteComponent]
```

## Syntax

HTML is parsed according to WHATWG HTML (the living standard), which is also
followed by browsers such as Chrome, Firefox, and Safari.

## Types

This package is fully typed with [TypeScript][].
It exports the additional types [`Fragment`][fragment], [`Jsx`][jsx],
[`JsxDev`][jsxdev], [`Options`][options], [`Props`][props], [`Source`][source],
and [`Space`][Space].

The function `toJsxRuntime` returns a `JSX.Element`, which means that the JSX
namespace has to by typed.
Typically this is done by installing your frameworks types (e.g.,
`@types/react`), which you likely already have.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 14.14+ and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Security

Be careful with user input in your hast tree.
Use [`hast-util-santize`][hast-util-sanitize] to make hast trees safe.

## Related

*   [`hastscript`](https://github.com/syntax-tree/hastscript)
    — build hast trees
*   [`hast-util-to-html`](https://github.com/syntax-tree/hast-util-to-html)
    — serialize hast as HTML
*   [`hast-util-sanitize`](https://github.com/syntax-tree/hast-util-sanitize)
    — sanitize hast

## Contribute

See [`contributing.md`][contributing] in [`syntax-tree/.github`][health] for
ways to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/syntax-tree/hast-util-to-jsx-runtime/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/hast-util-to-jsx-runtime/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/hast-util-to-jsx-runtime.svg

[coverage]: https://codecov.io/github/syntax-tree/hast-util-to-jsx-runtime

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-to-jsx-runtime.svg

[downloads]: https://www.npmjs.com/package/hast-util-to-jsx-runtime

[size-badge]: https://img.shields.io/bundlephobia/minzip/hast-util-to-jsx-runtime.svg

[size]: https://bundlephobia.com/result?p=hast-util-to-jsx-runtime

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[license]: license

[author]: https://wooorm.com

[health]: https://github.com/syntax-tree/.github

[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/main/support.md

[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[hast]: https://github.com/syntax-tree/hast

[node]: https://github.com/syntax-tree/hast#nodes

[hast-util-sanitize]: https://github.com/syntax-tree/hast-util-sanitize

[jsx-runtime]: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html

[options]: #options

[tojsxruntime]: #tojsxruntimetree-options

[fragment]: #fragment-1

[jsx]: #jsx-1

[jsxdev]: #jsxdev-1

[props]: #props

[source]: #source

[space]: #space-1
