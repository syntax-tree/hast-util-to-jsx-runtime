/**
 * @typedef {import('estree').Program} Program
 *
 * @typedef {import('hast-util-to-jsx-runtime').CreateEvaluater<React.ElementType>} CreateEvaluater
 *
 * @typedef {import('../lib/index.js').Source} Source
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {visit} from 'estree-util-visit'
import {h, s} from 'hastscript'
import {toJsxRuntime} from 'hast-util-to-jsx-runtime'
import * as sval from 'sval'
import React from 'react'
import * as development from 'react/jsx-dev-runtime'
import * as production from 'react/jsx-runtime'
import {renderToStaticMarkup} from 'react-dom/server'

/** @type {import('sval')['default']} */
// @ts-expect-error: ESM types are wrong.
const Sval = sval.default

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

  await t.test(
    'should not crash on invalid style strings w/ `ignoreInvalidStyle`',
    async function () {
      assert.equal(
        renderToStaticMarkup(
          toJsxRuntime(h('div', {style: 'color:red; /*'}), {
            ...production,
            ignoreInvalidStyle: true
          })
        ),
        '<div></div>'
      )
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
   * @param {React.ReactElement} node
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
            /**
             * @param {{id: unknown}} props
             */
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
               * @param {React.ComponentPropsWithoutRef<'b'>} props
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
              /**
               * @param {{node: unknown}} props
               */
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
            /**
             * @param {{node: unknown}} props
             */
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

  await t.test('should not pas `node` to basic components', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime(h('h1', 'a'), {
          ...production,
          passNode: true,
          components: {h1: 'h2'}
        })
      ),
      '<h2>a</h2>'
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

test('react specific: `align` to `style`', async function (t) {
  const tree = h(null, [
    h('th', {style: 'color:red', align: 'center'}, 'alpha'),
    h('td', {style: 'background-color:blue;', align: 'left'}, 'bravo'),
    h('td', {align: 'right'}, 'charlie'),
    h('td', 'delta')
  ])

  await t.test(
    'should not transform `align` w/ `tableCellAlignToStyle: false`',
    async function () {
      assert.equal(
        renderToStaticMarkup(
          toJsxRuntime(tree, {...production, tableCellAlignToStyle: false})
        ),
        '<th style="color:red" align="center">alpha</th><td style="background-color:blue" align="left">bravo</td><td align="right">charlie</td><td>delta</td>'
      )
    }
  )

  await t.test(
    'should transform `align` w/o `tableCellAlignToStyle`',
    async function () {
      assert.equal(
        renderToStaticMarkup(toJsxRuntime(tree, production)),
        '<th style="color:red;text-align:center">alpha</th><td style="background-color:blue;text-align:left">bravo</td><td style="text-align:right">charlie</td><td>delta</td>'
      )
    }
  )

  await t.test(
    "should support `tableCellAlignToStyle` w/ `stylePropertyNameCase: 'css'`",
    async function () {
      /** @type {unknown} */
      let foundProps

      assert.equal(
        renderToStaticMarkup(
          toJsxRuntime(h('td', {align: 'center'}), {
            ...production,
            jsx(type, props) {
              foundProps = props
              return production.jsx(type, {})
            },
            stylePropertyNameCase: 'css'
          })
        ),
        '<td></td>'
      )

      assert.deepEqual(foundProps, {style: {'text-align': 'center'}})
    }
  )

  await t.test(
    "should support `tableCellAlignToStyle` w/ `stylePropertyNameCase: 'dom'`",
    async function () {
      /** @type {unknown} */
      let foundProps

      assert.equal(
        renderToStaticMarkup(
          toJsxRuntime(h('td', {align: 'center'}), {
            ...production,
            jsx(type, props) {
              foundProps = props
              return production.jsx(type, {})
            },
            stylePropertyNameCase: 'dom'
          })
        ),
        '<td></td>'
      )

      assert.deepEqual(foundProps, {style: {textAlign: 'center'}})
    }
  )
})

test('mdx: jsx', async function (t) {
  await t.test('should transform MDX JSX (text)', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime(
          {type: 'mdxJsxTextElement', name: 'a', attributes: [], children: []},
          production
        )
      ),
      '<a></a>'
    )
  })

  await t.test('should transform MDX JSX (flow)', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime(
          {type: 'mdxJsxTextElement', name: 'h1', attributes: [], children: []},
          production
        )
      ),
      '<h1></h1>'
    )
  })

  await t.test('should transform MDX JSX (fragment)', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime(
          {
            type: 'mdxJsxTextElement',
            name: null,
            attributes: [],
            children: [{type: 'text', value: 'a'}]
          },
          production
        )
      ),
      'a'
    )
  })

  await t.test('should transform MDX JSX (fragment)', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime(
          {type: 'mdxJsxTextElement', name: null, attributes: [], children: []},
          production
        )
      ),
      ''
    )
  })

  await t.test(
    'should transform MDX JSX (attribute, w/o value)',
    async function () {
      assert.equal(
        renderToStaticMarkup(
          toJsxRuntime(
            {
              type: 'mdxJsxTextElement',
              name: 'a',
              attributes: [
                {type: 'mdxJsxAttribute', name: 'hidden', value: null}
              ],
              children: []
            },
            production
          )
        ),
        '<a hidden=""></a>'
      )
    }
  )

  await t.test(
    'should transform MDX JSX (attribute, w/ value)',
    async function () {
      assert.equal(
        renderToStaticMarkup(
          toJsxRuntime(
            {
              type: 'mdxJsxTextElement',
              name: 'a',
              attributes: [{type: 'mdxJsxAttribute', name: 'x', value: 'y'}],
              children: []
            },
            production
          )
        ),
        '<a x="y"></a>'
      )
    }
  )

  await t.test('should transform MDX JSX (SVG)', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime(
          {
            type: 'mdxJsxTextElement',
            name: 'svg',
            attributes: [],
            children: [
              s('g', {
                colorInterpolationFilters: 'sRGB',
                xmlSpace: 'preserve',
                xmlnsXLink: 'http://www.w3.org/1999/xlink',
                xLinkArcRole: 'http://www.example.com'
              })
            ]
          },
          production
        )
      ),
      '<svg><g color-interpolation-filters="sRGB" xml:space="preserve" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:arcrole="http://www.example.com"></g></svg>'
    )
  })

  await t.test('should transform MDX JSX (literal)', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime(
          {type: 'mdxJsxTextElement', name: 'a', attributes: [], children: []},
          {...production, components: {a: 'b'}}
        )
      ),
      '<b></b>'
    )
  })

  await t.test('should transform MDX JSX (namespace)', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime(
          {
            type: 'mdxJsxTextElement',
            name: 'a:b',
            attributes: [],
            children: []
          },
          {
            ...production,
            components: {
              'a:b': 'b'
            }
          }
        )
      ),
      '<b></b>'
    )
  })

  await t.test('should throw on identifier by default', async function () {
    assert.throws(function () {
      toJsxRuntime(
        {
          type: 'mdxJsxFlowElement',
          name: 'A',
          attributes: [],
          children: []
        },
        production
      )
    }, /Cannot handle MDX estrees without `createEvaluater`/)
  })

  await t.test('should transform MDX JSX (component)', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime(
          {
            type: 'root',
            children: [
              {
                type: 'mdxjsEsm',
                value: "export const A = 'b'",
                data: {
                  estree: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ExportNamedDeclaration',
                        declaration: {
                          type: 'VariableDeclaration',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {type: 'Identifier', name: 'A'},
                              init: {type: 'Literal', value: 'b'}
                            }
                          ],
                          kind: 'const'
                        },
                        specifiers: [],
                        source: null
                      }
                    ],
                    sourceType: 'module',
                    comments: []
                  }
                }
              },
              {
                type: 'mdxJsxFlowElement',
                name: 'A',
                attributes: [],
                children: []
              }
            ]
          },
          {...production, createEvaluater}
        )
      ),
      '<b></b>'
    )
  })

  await t.test(
    'should transform MDX JSX (member expression, non-identifier)',
    async function () {
      assert.equal(
        renderToStaticMarkup(
          toJsxRuntime(
            {
              type: 'root',
              children: [
                {
                  type: 'mdxjsEsm',
                  value: "export const a = {'b-c': 'c'}",
                  data: {
                    estree: {
                      type: 'Program',
                      body: [
                        {
                          type: 'ExportNamedDeclaration',
                          declaration: {
                            type: 'VariableDeclaration',
                            declarations: [
                              {
                                type: 'VariableDeclarator',
                                id: {type: 'Identifier', name: 'a'},
                                init: {
                                  type: 'ObjectExpression',
                                  properties: [
                                    {
                                      type: 'Property',
                                      method: false,
                                      shorthand: false,
                                      computed: false,
                                      key: {type: 'Literal', value: 'b-c'},
                                      value: {type: 'Literal', value: 'c'},
                                      kind: 'init'
                                    }
                                  ]
                                }
                              }
                            ],
                            kind: 'const'
                          },
                          specifiers: [],
                          source: null
                        }
                      ],
                      sourceType: 'module',
                      comments: []
                    }
                  }
                },
                {
                  type: 'mdxJsxFlowElement',
                  name: 'a.b-c',
                  attributes: [],
                  children: []
                }
              ]
            },
            {...production, createEvaluater}
          )
        ),
        '<c></c>'
      )
    }
  )

  await t.test(
    'should throw on expression attribute by default',
    async function () {
      assert.throws(function () {
        toJsxRuntime(
          {
            type: 'mdxJsxFlowElement',
            name: 'a',
            attributes: [{type: 'mdxJsxExpressionAttribute', value: '...x'}],
            children: []
          },
          production
        )
      }, /Cannot handle MDX estrees without `createEvaluater`/)
    }
  )

  await t.test(
    'should throw on attribute value expression by default',
    async function () {
      assert.throws(function () {
        toJsxRuntime(
          {
            type: 'mdxJsxFlowElement',
            name: 'a',
            attributes: [
              {
                type: 'mdxJsxAttribute',
                name: 'x',
                value: {type: 'mdxJsxAttributeValueExpression', value: '1'}
              }
            ],
            children: []
          },
          production
        )
      }, /Cannot handle MDX estrees without `createEvaluater`/)
    }
  )

  await t.test(
    'should support expression attribute w/ `createEvaluater`',
    async function () {
      assert.equal(
        renderToStaticMarkup(
          toJsxRuntime(
            {
              type: 'mdxJsxTextElement',
              name: 'a',
              attributes: [
                {
                  type: 'mdxJsxExpressionAttribute',
                  value: "...{x: 'y'}",
                  data: {
                    estree: {
                      type: 'Program',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'ObjectExpression',
                            properties: [
                              {
                                type: 'SpreadElement',
                                argument: {
                                  type: 'ObjectExpression',
                                  properties: [
                                    {
                                      type: 'Property',
                                      method: false,
                                      shorthand: false,
                                      computed: false,
                                      key: {type: 'Identifier', name: 'x'},
                                      value: {type: 'Literal', value: 'y'},
                                      kind: 'init'
                                    }
                                  ]
                                }
                              }
                            ]
                          }
                        }
                      ],
                      sourceType: 'module',
                      comments: []
                    }
                  }
                }
              ],
              children: []
            },
            {...production, createEvaluater}
          )
        ),
        '<a x="y"></a>'
      )
    }
  )

  await t.test(
    'should support attribute value expression w/ `createEvaluater`',
    async function () {
      assert.equal(
        renderToStaticMarkup(
          toJsxRuntime(
            {
              type: 'mdxJsxTextElement',
              name: 'a',
              attributes: [
                {
                  type: 'mdxJsxAttribute',
                  name: 'x',
                  value: {
                    type: 'mdxJsxAttributeValueExpression',
                    value: "'y'",
                    data: {
                      estree: {
                        type: 'Program',
                        body: [
                          {
                            type: 'ExpressionStatement',
                            expression: {type: 'Literal', value: 'y'}
                          }
                        ],
                        sourceType: 'module',
                        comments: []
                      }
                    }
                  }
                }
              ],
              children: []
            },
            {...production, createEvaluater}
          )
        ),
        '<a x="y"></a>'
      )
    }
  )
})

test('mdx: expression', async function (t) {
  await t.test('should throw on expression by default', async function () {
    assert.throws(function () {
      toJsxRuntime({type: 'mdxFlowExpression', value: "'a'"}, production)
    }, /Cannot handle MDX estrees without `createEvaluater`/)
  })

  await t.test(
    'should support expression w/ `createEvaluater`',
    async function () {
      assert.equal(
        renderToStaticMarkup(
          toJsxRuntime(
            {
              type: 'mdxFlowExpression',
              value: "'a'",
              data: {
                estree: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {type: 'Literal', value: 'a'}
                    }
                  ],
                  sourceType: 'module',
                  comments: []
                }
              }
            },
            {...production, createEvaluater}
          )
        ),
        'a'
      )
    }
  )
})

test('mdx: ESM', async function (t) {
  await t.test('should throw on ESM by default', async function () {
    assert.throws(function () {
      toJsxRuntime(
        {type: 'mdxjsEsm', value: "export const a = 'a'"},
        production
      )
    }, /Cannot handle MDX estrees without `createEvaluater`/)
  })

  await t.test('should support ESM w/ `createEvaluater`', async function () {
    assert.equal(
      renderToStaticMarkup(
        toJsxRuntime(
          {
            type: 'root',
            children: [
              {
                type: 'mdxjsEsm',
                value: "export const a = 'b'",
                data: {
                  estree: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ExportNamedDeclaration',
                        declaration: {
                          type: 'VariableDeclaration',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {type: 'Identifier', name: 'a'},
                              init: {type: 'Literal', value: 'b'}
                            }
                          ],
                          kind: 'const'
                        },
                        specifiers: [],
                        source: null
                      }
                    ],
                    sourceType: 'module',
                    comments: []
                  }
                }
              },
              {
                type: 'mdxFlowExpression',
                value: 'a',
                data: {
                  estree: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {type: 'Identifier', name: 'a'}
                      }
                    ],
                    sourceType: 'module',
                    comments: []
                  }
                }
              }
            ]
          },
          {...production, createEvaluater}
        )
      ),
      'b'
    )
  })
})

/**
 * @type {CreateEvaluater}
 */
function createEvaluater() {
  const interpreter = new Sval({sandBox: true})

  return {
    evaluateExpression(expression) {
      /** @type {Program} */
      const program = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'MemberExpression',
                object: {type: 'Identifier', name: 'exports'},
                property: {
                  type: 'Identifier',
                  name: '_evaluateExpressionValue'
                },
                computed: false,
                optional: false
              },
              right: expression
            }
          }
        ],
        sourceType: 'module'
      }

      interpreter.run(program)
      const value = /** @type {React.ElementType} */ (
        // type-coverage:ignore-next-line
        interpreter.exports._evaluateExpressionValue
      )
      // type-coverage:ignore-next-line
      interpreter.exports._evaluateExpressionValue = undefined
      return value
    },
    /**
     * @returns {undefined}
     */
    evaluateProgram(program) {
      visit(program, function (node, key, index, parents) {
        // Sval doesn’t support exports yet.
        if (node.type === 'ExportNamedDeclaration' && node.declaration) {
          const parent = parents[parents.length - 1]
          assert(parent)
          assert(typeof key === 'string')
          assert(typeof index === 'number')
          // @ts-expect-error: fine.
          parent[key][index] = node.declaration
        }
      })

      interpreter.run(program)
    }
  }
}
