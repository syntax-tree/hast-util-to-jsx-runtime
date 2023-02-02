/**
 * @typedef {import('../index.js').Fragment} Fragment
 * @typedef {import('../index.js').Jsx} Jsx
 * @typedef {import('../index.js').JsxDev} JsxDev
 * @typedef {import('../lib/index.js').Source} Source
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import * as prod from 'react/jsx-runtime'
import * as dev from 'react/jsx-dev-runtime'
import {renderToStaticMarkup} from 'react-dom/server'
import {h, s} from 'hastscript'
import {toJsxRuntime} from '../index.js'
import * as mod from '../index.js'

/** @type {{Fragment: Fragment, jsx: Jsx, jsxs: Jsx}} */
// @ts-expect-error: Types are wrong.
const production = {Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs}

/** @type {{Fragment: Fragment, jsxDEV: JsxDev}} */
// @ts-expect-error: Types are wrong.
const development = {Fragment: dev.Fragment, jsxDEV: dev.jsxDEV}

test('core', () => {
  assert.deepEqual(
    Object.keys(mod).sort(),
    ['toJsxRuntime'],
    'should expose the public api'
  )

  assert.equal(
    renderToStaticMarkup(toJsxRuntime(h('a', {b: 'c'}, 'd'), production)),
    '<a b="c">d</a>',
    'should support a production runtime (default)'
  )

  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime(h('a', {b: 'c'}, 'd'), {...development, development: true})
    ),
    '<a b="c">d</a>',
    'should support a development runtime'
  )

  assert.throws(
    function () {
      // @ts-expect-error: runtime error.
      toJsxRuntime(h())
    },
    /Expected `Fragment` in options/,
    'should throw w/o `Fragment`'
  )

  assert.throws(
    function () {
      // @ts-expect-error: runtime error.
      toJsxRuntime(h(), {Fragment: production.Fragment})
    },
    /Expected `jsx` in production options/,
    'should throw w/ `Fragment`, w/o `jsx`'
  )

  assert.throws(
    function () {
      // @ts-expect-error: runtime error.
      toJsxRuntime(h(), {Fragment: production.Fragment, jsx: production.jsx})
    },
    /Expected `jsxs` in production options/,
    'should throw w/ `Fragment`, `jsx`, w/o `jsxs`'
  )

  assert.throws(
    function () {
      toJsxRuntime(h(), {Fragment: production.Fragment, development: true})
    },
    /Expected `jsxDEV` in options when `development: true`/,
    'should throw in development w/ `Fragment`, w/o `jsxDEV`'
  )

  assert.equal(
    // type-coverage:ignore-next-line
    toJsxRuntime(h(null, 'd'), production).type,
    production.Fragment,
    'should support a root (1)'
  )

  assert.equal(
    renderToStaticMarkup(toJsxRuntime(h(null, 'a'), production)),
    'a',
    'should support a root (2)'
  )

  assert.equal(
    // type-coverage:ignore-next-line
    toJsxRuntime({type: 'text', value: 'a'}, production).type,
    production.Fragment,
    'should support a text (1)'
  )

  assert.equal(
    renderToStaticMarkup(toJsxRuntime({type: 'text', value: 'a'}, production)),
    'a',
    'should support a text (2)'
  )

  assert.equal(
    // @ts-expect-error: Types are out of date, `name` is no longer used.
    // type-coverage:ignore-next-line
    toJsxRuntime({type: 'doctype'}, production).type,
    production.Fragment,
    'should support a doctype (1)'
  )

  assert.equal(
    // @ts-expect-error: Types are out of date, `name` is no longer used.
    renderToStaticMarkup(toJsxRuntime({type: 'doctype'}, production)),
    '',
    'should support a doctype (2)'
  )

  assert.equal(
    // type-coverage:ignore-next-line
    toJsxRuntime({type: 'comment', value: 'a'}, production).type,
    production.Fragment,
    'should support a comment (1)'
  )

  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime({type: 'comment', value: 'a'}, production)
    ),
    '',
    'should support a comment (2)'
  )
})

test('properties', () => {
  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime(
        {
          type: 'element',
          tagName: 'div',
          properties: {
            id: 'a',
            title: 'b',
            className: ['c'],
            // Known comma-separated lists:
            accept: ['.jpg', '.jpeg'],
            ariaValueNow: 1,
            dataFoo: true,
            data123: true,
            dataFooBar: true,
            allowFullScreen: true,
            download: true,
            dataA: false,
            dataB: undefined,
            dataC: null
          },
          children: []
        },
        production
      )
    ),
    '<div id="a" title="b" class="c" accept=".jpg, .jpeg" aria-valuenow="1" data-foo="true" data-123="true" data-foo-bar="true" allowfullscreen="" download="" data-a="false"></div>',
    'should support a bunch of properties'
  )

  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime(
        h('div', {
          style:
            'color: /* ? */ red; background-color: blue; -webkit-border-radius: 3px; -moz-transition: initial; -ms-transition: unset'
        }),
        production
      )
    ),
    '<div style="color:red;background-color:blue;-webkit-border-radius:3px;-moz-transition:initial;-ms-transition:unset"></div>',
    'should support `style`'
  )

  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime(
        {
          type: 'element',
          tagName: 'div',
          // @ts-expect-error: style as object, normally not supported, but passed through here.
          properties: {style: {color: 'red'}},
          children: []
        },
        production
      )
    ),
    '<div style="color:red"></div>',
    'should support `style` as an object'
  )

  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime(
        h('div', {style: '-webkit-transform: rotate(0.01turn)'}),
        production
      )
    ),
    '<div style="-webkit-transform:rotate(0.01turn)"></div>',
    'should support vendor prefixes'
  )

  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime(
        h('div', {style: '--fg: #0366d6; color: var(--fg)'}),
        production
      )
    ),
    '<div style="--fg:#0366d6;color:var(--fg)"></div>',
    'should support CSS variables'
  )

  /** @type {unknown} */
  let foundProps

  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime(
        h('div', {
          style:
            '-webkit-transform:rotate(0.01turn); --fg: #0366d6; color: var(--fg); -ms-transition: unset'
        }),
        {
          ...production,
          jsx(type, props) {
            foundProps = props
            return production.jsx('div', {children: []}, undefined)
          },
          stylePropertyNameCase: 'css'
        }
      )
    ),
    '<div></div>',
    'should support CSS cased style objects (1)'
  )

  assert.deepEqual(
    foundProps,
    {
      children: undefined,
      style: {
        '-webkit-transform': 'rotate(0.01turn)',
        '--fg': '#0366d6',
        color: 'var(--fg)',
        '-ms-transition': 'unset'
      }
    },
    'should support CSS cased style objects (2)'
  )

  assert.throws(
    () => {
      toJsxRuntime(h('div', {style: 'color:red; /*'}), production)
    },
    /^1:1-1:1: Cannot parse style attribute: End of comment missing$/,
    'should crash on invalid style strings (default)'
  )

  assert.throws(
    () => {
      toJsxRuntime(
        {
          type: 'element',
          tagName: 'a',
          properties: {style: 'color:red; /*'},
          children: [],
          position: {start: {line: 3, column: 2}, end: {line: 3, column: 123}}
        },
        production
      )
    },
    /^3:2-3:123: Cannot parse style attribute: End of comment missing$/,
    'Cannot parse style attribute: End of comment missing'
  )

  assert.throws(
    () => {
      toJsxRuntime(
        {
          type: 'element',
          tagName: 'a',
          properties: {style: 'color:red; /*'},
          children: []
        },
        {...production, filePath: 'example.html'}
      )
    },
    /^1:1-1:1: Cannot parse style attribute: End of comment missing$/,
    'should crash on invalid style strings (w/ file path, w/o positional info)'
  )

  assert.throws(
    () => {
      toJsxRuntime(
        {
          type: 'element',
          tagName: 'a',
          properties: {style: 'color:red; /*'},
          children: [],
          position: {start: {line: 3, column: 2}, end: {line: 3, column: 123}}
        },
        {...production, filePath: 'example.html'}
      )
    },
    /^3:2-3:123: Cannot parse style attribute: End of comment missing$/,
    'should crash on invalid style strings (w/ file path, w/ positional info)'
  )

  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime(
        s('g', {
          colorInterpolationFilters: 'sRGB',
          xmlSpace: 'preserve',
          xmlnsXLink: 'http://www.w3.org/1999/xlink',
          xLinkArcRole: 'http://www.example.com'
        }),
        {...production, space: 'svg'}
      )
    ),
    '<g color-interpolation-filters="sRGB" xml:space="preserve" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:arcrole="http://www.example.com"></g>',
    'should support properties in the SVG space'
  )
})

test('children', () => {
  assert.equal(
    renderToStaticMarkup(toJsxRuntime(h('a'), production)),
    '<a></a>',
    'should support no children'
  )

  assert.equal(
    renderToStaticMarkup(toJsxRuntime(h('a', [h('b')]), production)),
    '<a><b></b></a>',
    'should support a child'
  )

  assert.equal(
    renderToStaticMarkup(toJsxRuntime(h('a', [h('b'), h('c')]), production)),
    '<a><b></b><c></c></a>',
    'should support two children'
  )

  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime(
        h('.article', [
          s(
            'svg',
            {xmlns: 'http://www.w3.org/2000/svg', viewBox: [0, 0, 500, 500]},
            [s('circle', {cx: 120, cy: 120, r: 100})]
          )
        ]),
        production
      )
    ),
    '<div class="article"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><circle cx="120" cy="120" r="100"></circle></svg></div>',
    'should support svg in html'
  )

  assert.equal(
    renderToStaticMarkup(toJsxRuntime(h('hr'), production)),
    '<hr/>',
    'should support a void element'
  )
})

test('source', () => {
  assert.deepEqual(
    getSource(
      toJsxRuntime(
        {
          type: 'element',
          tagName: 'a',
          properties: {},
          children: [],
          position: {start: {line: 3, column: 2}, end: {line: 3, column: 123}}
        },
        {...production, filePath: 'a/b/c.html'}
      )
    ),
    undefined,
    'should not add a source in production'
  )

  assert.deepEqual(
    getSource(
      toJsxRuntime(
        {
          type: 'element',
          tagName: 'a',
          properties: {},
          children: [],
          position: {start: {line: 3, column: 2}, end: {line: 3, column: 123}}
        },
        {...development, development: true, filePath: 'a/b/c.html'}
      )
    ),
    {fileName: 'a/b/c.html', lineNumber: 3, columnNumber: 1},
    'should add a source in development'
  )

  assert.deepEqual(
    getSource(
      toJsxRuntime(
        {
          type: 'element',
          tagName: 'a',
          properties: {},
          children: [],
          position: {start: {line: 3, column: 2}, end: {line: 3, column: 123}}
        },
        {...development, development: true}
      )
    ),
    {fileName: undefined, lineNumber: 3, columnNumber: 1},
    'should support `style`'
  )

  /**
   * @param {JSX.Element} node
   * @returns {Source | undefined}
   */
  function getSource(node) {
    // @ts-expect-error: untyped but exists.
    const source = /** @type {Source | undefined} */ (node._source)
    return source
  }
})

test('components', () => {
  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime(h('b#x'), {
        ...production,
        components: {
          b(props) {
            // Note: types for this are working.
            assert(props.id === 'x')
            return 'a'
          }
        }
      })
    ),
    'a',
    'should support function components'
  )

  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime(h('b#x'), {
        ...production,
        components: {
          b: class extends React.Component {
            /**
             * @param {JSX.IntrinsicElements['b']} props
             */
            constructor(props) {
              super(props)
              // Note: types for this are working.
              assert(props.id === 'x')
            }

            render() {
              return 'a'
            }
          }
        }
      })
    ),
    'a',
    'should support class components'
  )

  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime(h('b'), {
        ...production,
        passNode: true,
        components: {
          b(props) {
            assert.ok(props.node)
            return 'a'
          }
        }
      })
    ),
    'a',
    'should support components w/ `passNode: true`'
  )

  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime(h('b'), {
        ...production,
        components: {
          b(props) {
            assert.equal(props.node, undefined)
            return 'a'
          }
        }
      })
    ),
    'a',
    'should support components w/o `passNode`'
  )
})

test('react specific: filter whitespace in tables', () => {
  assert.equal(
    renderToStaticMarkup(
      toJsxRuntime(
        h(null, [
          h('table', [
            ' ',
            h('thead', [
              ' ',
              h('tr', [' ', h('th', [' ', h('b', 'a'), ' ']), ' ']),
              ' '
            ]),
            ' ',
            h('tbody', [
              ' ',
              h('tr', [' ', h('td', [' ', h('b', 'b'), ' ']), ' ']),
              ' '
            ]),
            ' ',
            h('tfoot', [
              ' ',
              h('tr', [' ', h('td', [' ', h('b', 'c'), ' ']), ' ']),
              ' '
            ]),
            ' '
          ])
        ]),
        production
      )
    ),
    '<table><thead><tr><th> <b>a</b> </th></tr></thead><tbody><tr><td> <b>b</b> </td></tr></tbody><tfoot><tr><td> <b>c</b> </td></tr></tfoot></table>',
    'should ignore whitespace in `table`, `thead`, `tbody`, `tfoot`, and `tr`'
  )
})
