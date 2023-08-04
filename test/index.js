/**
 * @typedef {import('hast-util-to-jsx-runtime').Fragment} Fragment
 * @typedef {import('hast-util-to-jsx-runtime').Jsx} Jsx
 * @typedef {import('hast-util-to-jsx-runtime').JsxDev} JsxDev
 *
 * @typedef {import('../lib/index.js').Source} Source
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {h, s} from 'hastscript'
import {toJsxRuntime} from 'hast-util-to-jsx-runtime'
import React from 'react'
import * as dev from 'react/jsx-dev-runtime'
import * as prod from 'react/jsx-runtime'
import {renderToStaticMarkup} from 'react-dom/server'

/** @type {{Fragment: Fragment, jsx: Jsx, jsxs: Jsx}} */
// @ts-expect-error: the react types are missing.
const production = {Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs}

/** @type {{Fragment: Fragment, jsxDEV: JsxDev}} */
// @ts-expect-error: the react types are missing.
const development = {Fragment: dev.Fragment, jsxDEV: dev.jsxDEV}

test('core', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('hast-util-to-jsx-runtime')).sort(),
      ['toJsxRuntime']
    )
  })

  await t.test(
    'should support a production runtime (default)',
    async function () {
      assert.equal(
        renderToStaticMarkup(toJsxRuntime(h('a', {b: 'c'}, 'd'), production)),
        '<a b="c">d</a>'
      )
    }
  )

  await t.test('should support a development runtime', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime(h('a', {b: 'c'}, 'd'), {...development, development: true})
      ),
      '<a b="c">d</a>'
    )
  })

  await t.test('should throw w/o `Fragment`', async function () {
    assert.throws(function () {
      // @ts-expect-error: check how the runtime handles no options
      toJsxRuntime(h())
    }, /Expected `Fragment` in options/)
  })

  await t.test('should throw w/ `Fragment`, w/o `jsx`', async function () {
    assert.throws(function () {
      // @ts-expect-error: check how the runtime handles `jsx`, `jsxs` missing.
      toJsxRuntime(h(), {Fragment: production.Fragment})
    }, /Expected `jsx` in production options/)
  })

  await t.test(
    'should throw w/ `Fragment`, `jsx`, w/o `jsxs`',
    async function () {
      assert.throws(function () {
        // @ts-expect-error: check how the runtime handles `jsxs` missing.
        toJsxRuntime(h(), {Fragment: production.Fragment, jsx: production.jsx})
      }, /Expected `jsxs` in production options/)
    }
  )

  await t.test(
    'should throw in development w/ `Fragment`, w/o `jsxDEV`',
    async function () {
      assert.throws(function () {
        toJsxRuntime(h(), {Fragment: production.Fragment, development: true})
      }, /Expected `jsxDEV` in options when `development: true`/)
    }
  )

  await t.test('should support a root (1)', async function () {
    assert.equal(
      // type-coverage:ignore-next-line
      toJsxRuntime(h(null, 'd'), production).type,
      production.Fragment
    )
  })

  await t.test('should support a root (2)', async function () {
    assert.equal(
      renderToStaticMarkup(toJsxRuntime(h(null, 'a'), production)),
      'a'
    )
  })

  await t.test('should support a text (1)', async function () {
    assert.equal(
      // type-coverage:ignore-next-line
      toJsxRuntime({type: 'text', value: 'a'}, production).type,
      production.Fragment
    )
  })

  await t.test('should support a text (2)', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime({type: 'text', value: 'a'}, production)
      ),
      'a'
    )
  })

  await t.test('should support a doctype (1)', async function () {
    assert.equal(
      // type-coverage:ignore-next-line
      toJsxRuntime({type: 'doctype'}, production).type,
      production.Fragment
    )
  })

  await t.test('should support a doctype (2)', async function () {
    assert.equal(
      renderToStaticMarkup(toJsxRuntime({type: 'doctype'}, production)),
      ''
    )
  })

  await t.test('should support a comment (1)', async function () {
    assert.equal(
      // type-coverage:ignore-next-line
      toJsxRuntime({type: 'comment', value: 'a'}, production).type,
      production.Fragment
    )
  })

  await t.test('should support a comment (2)', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime({type: 'comment', value: 'a'}, production)
      ),
      ''
    )
  })
})

test('properties', async function (t) {
  await t.test('should support a bunch of properties', async function () {
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
      '<div id="a" title="b" class="c" accept=".jpg, .jpeg" aria-valuenow="1" data-foo="true" data-123="true" data-foo-bar="true" allowfullscreen="" download="" data-a="false"></div>'
    )
  })

  await t.test('should support `style`', async function () {
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
      '<div style="color:red;background-color:blue;-webkit-border-radius:3px;-moz-transition:initial;-ms-transition:unset"></div>'
    )
  })

  await t.test('should support `style` as an object', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime(
          {
            type: 'element',
            tagName: 'div',
            // @ts-expect-error: check how the runtime handles `style` as an object.
            properties: {style: {color: 'red'}},
            children: []
          },
          production
        )
      ),
      '<div style="color:red"></div>'
    )
  })

  await t.test('should support vendor prefixes', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime(
          h('div', {style: '-webkit-transform: rotate(0.01turn)'}),
          production
        )
      ),
      '<div style="-webkit-transform:rotate(0.01turn)"></div>'
    )
  })

  await t.test('should support CSS variables', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime(
          h('div', {style: '--fg: #0366d6; color: var(--fg)'}),
          production
        )
      ),
      '<div style="--fg:#0366d6;color:var(--fg)"></div>'
    )
  })

  await t.test('should support CSS cased style objects', async function () {
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
              return production.jsx(type, {})
            },
            stylePropertyNameCase: 'css'
          }
        )
      ),
      '<div></div>'
    )

    assert.deepEqual(foundProps, {
      style: {
        '-webkit-transform': 'rotate(0.01turn)',
        '--fg': '#0366d6',
        color: 'var(--fg)',
        '-ms-transition': 'unset'
      }
    })
  })

  await t.test(
    'should crash on invalid style strings (default)',
    async function () {
      assert.throws(function () {
        toJsxRuntime(h('div', {style: 'color:red; /*'}), production)
      }, /Cannot parse `style` attribute/)
    }
  )

  await t.test(
    'should crash on invalid style strings (w/o file path, w/ positional info)',
    async function () {
      assert.throws(
        function () {
          toJsxRuntime(
            {
              type: 'element',
              tagName: 'a',
              properties: {style: 'color:red; /*'},
              children: [],
              position: {
                start: {line: 3, column: 2},
                end: {line: 3, column: 123}
              }
            },
            production
          )
        },
        /^3:2-3:123: Cannot parse `style` attribute/,
        'Cannot parse style attribute: End of comment missing'
      )
    }
  )

  await t.test(
    'should crash on invalid style strings (w/ file path, w/o positional info)',
    async function () {
      assert.throws(function () {
        toJsxRuntime(
          {
            type: 'element',
            tagName: 'a',
            properties: {style: 'color:red; /*'},
            children: []
          },
          {...production, filePath: 'example.html'}
        )
      }, /^1:1: Cannot parse `style` attribut/)
    }
  )

  await t.test(
    'should crash on invalid style strings (w/ file path, w/ positional info)',
    async function () {
      assert.throws(function () {
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
      }, /^3:2-3:123: Cannot parse `style` attribute/)
    }
  )

  await t.test('should support properties in the SVG space', async function () {
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
      '<g color-interpolation-filters="sRGB" xml:space="preserve" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:arcrole="http://www.example.com"></g>'
    )
  })
})

test('children', async function (t) {
  await t.test('should support no children', async function () {
    assert.equal(
      renderToStaticMarkup(toJsxRuntime(h('a'), production)),
      '<a></a>'
    )
  })

  await t.test('should support a child', async function () {
    assert.equal(
      renderToStaticMarkup(toJsxRuntime(h('a', [h('b')]), production)),
      '<a><b></b></a>'
    )
  })

  await t.test('should support two children', async function () {
    assert.equal(
      renderToStaticMarkup(toJsxRuntime(h('a', [h('b'), h('c')]), production)),
      '<a><b></b><c></c></a>'
    )
  })

  await t.test('should support svg in html', async function () {
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
      '<div class="article"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><circle cx="120" cy="120" r="100"></circle></svg></div>'
    )
  })

  await t.test('should support a void element', async function () {
    assert.equal(
      renderToStaticMarkup(toJsxRuntime(h('hr'), production)),
      '<hr/>'
    )
  })
})

test('source', async function (t) {
  await t.test('should not add a source in production', async function () {
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
      undefined
    )
  })

  await t.test('should add a source in development', async function () {
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
      {fileName: 'a/b/c.html', lineNumber: 3, columnNumber: 1}
    )
  })

  await t.test('should support `style`', async function () {
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
      {fileName: undefined, lineNumber: 3, columnNumber: 1}
    )
  })

  /**
   * @param {JSX.Element} node
   * @returns {Source | undefined}
   */
  function getSource(node) {
    // @ts-expect-error: `_source` is not typed by react but does exist.
    const source = /** @type {Source | undefined} */ (node._source)
    return source
  }
})

test('components', async function (t) {
  await t.test('should support function components', async function () {
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
      'a'
    )
  })

  await t.test('should support class components', async function () {
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
      'a'
    )
  })

  await t.test(
    'should support components w/ `passNode: true`',
    async function () {
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
        'a'
      )
    }
  )

  await t.test('should support components w/o `passNode`', async function () {
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
      'a'
    )
  })
})

test('react specific: filter whitespace in tables', async function (t) {
  await t.test(
    'should ignore whitespace in `table`, `thead`, `tbody`, `tfoot`, and `tr`',
    async function () {
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
        '<table><thead><tr><th> <b>a</b> </th></tr></thead><tbody><tr><td> <b>b</b> </td></tr></tbody><tfoot><tr><td> <b>c</b> </td></tr></tfoot></table>'
      )
    }
  )
})
