/**
 * Generate a hast tree for checking.
 *
 * > 👉 **Note**: this file is actual ESM that runs in browsers.
 */

/* eslint-env browser */

// To do: note: update this once in a while.
import {h, s} from 'https://esm.sh/hastscript@9?dev'

export function createTree() {
  return h('div', [
    h('p', [
      'note: to show that state is kept, this is rerendered every second, it’s now ',
      h('b', new Date().toLocaleString()),
      '!'
    ]),
    h('hr'),
    h('h2', 'Event handlers'),
    h('p', [
      'You should be able to click on this and print something to the console.'
    ]),
    h('button', {onClick: 'console.log("it worked!")'}, 'Print to console'),
    h('hr'),
    h('h2', 'Inputs with control'),
    h('p', ['You should be able to change this text input:']),
    h('div', [
      h('input#text-a', {type: 'text', value: 'Some text?'}),
      h('label', {htmlFor: 'text-a'}, 'Text input')
    ]),
    h('hr'),
    h('p', ['You should be able to change this range input:']),
    h('div', [
      h('input#range-a', {type: 'range', value: 5, min: 0, max: 10}),
      h('label', {htmlFor: 'range-a'}, 'Range input')
    ]),
    h('hr'),
    h('p', ['You should be able to change this radio group:']),
    h('div', [
      h('input#radio-a', {
        type: 'radio',
        name: 'radios',
        value: 'a',
        checked: true
      }),
      h('label', {htmlFor: 'radio-a'}, 'Alpha'),
      h('input#radio-b', {type: 'radio', name: 'radios', value: 'b'}),
      h('label', {htmlFor: 'radio-b'}, 'Bravo'),
      h('input#radio-c', {type: 'radio', name: 'radios', value: 'c'}),
      h('label', {htmlFor: 'radio-c'}, 'Charlie')
    ]),
    h('hr'),
    h('h2', 'Style attribute'),
    h(
      'p',
      {style: {color: '#0366d6'}},
      'is this blue? Then style objects work'
    ),
    h('p', {style: 'color: #0366d6'}, 'is this blue? Then style strings work'),
    h(
      'p',
      {style: '-webkit-transform: rotate(0.01turn)'},
      'is this tilted in webkit? Then vendor prefixes in style strings work'
    ),
    h(
      'p',
      {style: {'-webkit-transform': 'rotate(0.01turn)'}},
      'is this tilted in webkit? Then prefixes in style objects work'
    ),
    h(
      'p',
      {style: {WebkitTransform: 'rotate(0.01turn)'}},
      'is this tilted in webkit? Then camelcased in style objects work'
    ),
    h(
      'p',
      {
        style:
          'display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2'
      },
      'This should be capped at 2 lines in webkit! Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus natus similique eum. Dolorem est at aliquam, explicabo similique repudiandae veritatis? Eum aliquam hic eaque tenetur, enim ex odio voluptatum repellendus!'
    ),
    h(
      'p',
      {style: '--fg: #0366d6; color: var(--fg)'},
      'Is this blue? Then CSS variables work.'
    ),
    h('h2', 'SVG: camel- and dash-cased attributes'),
    h('p', [
      'You should see two bright blue circles, the second skewed. ',
      'This checks that the ',
      h('code', 'gradientUnits'),
      ' attribute (camel case), ',
      h('code', 'gradientTransform'),
      ' attribute (camel case), and ',
      h('code', 'stop-color'),
      ' attribute (dash case), all work. ',
      'It also checks that the ',
      h('code', 'radialGradient'),
      ' element (camel case) works.'
    ]),
    // Example based on <https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/gradientTransform>
    s('svg', {viewBox: '0 0 420 200', xmlns: 'http://www.w3.org/2000/svg'}, [
      s(
        'radialGradient#gradient-a',
        {gradientUnits: 'userSpaceOnUse', cx: 100, cy: 100, r: 100},
        [
          s('stop', {offset: '50%', stopColor: '#0366d6'}),
          s('stop', {offset: '50.1%', stopColor: 'transparent'})
        ]
      ),
      s(
        'radialGradient#gradient-b',
        {
          gradientUnits: 'userSpaceOnUse',
          cx: 100,
          cy: 100,
          r: 100,
          gradientTransform: 'skewX(25) translate(-50, 0)'
        },
        [
          s('stop', {offset: '50%', stopColor: '#0366d6'}),
          s('stop', {offset: '50.1%', stopColor: 'transparent'})
        ]
      ),
      s('rect', {
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        fill: 'url(#gradient-a)'
      }),
      s('rect', {
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        fill: 'url(#gradient-b)',
        style: {transform: 'translateX(220px)'}
      })
    ]),
    h('h2', 'xlink:href'),
    h('p', [
      'You should see one big circle broken down over four squares. ',
      'The top right square is different, it instead contains one small circle. ',
      'This checks that the ',
      h('code', 'clipPathUnits'),
      ' attribute (camel case), ',
      h('code', 'clip-path'),
      ' attribute (dash case), and',
      h('code', 'clipPath'),
      ' element (camel case), all work. ',
      'Importantly, it also checks for ',
      h('code', 'xlink:href'),
      '!'
    ]),
    // Example from <https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/clipPathUnits>
    s('svg', {viewBox: '0 0 100 100'}, [
      s('clipPath#clip-a', {clipPathUnits: 'userSpaceOnUse'}, [
        s('circle', {cx: 50, cy: 50, r: 35})
      ]),
      s('clipPath#clip-b', {clipPathUnits: 'objectBoundingBox'}, [
        s('circle', {cx: 0.5, cy: 0.5, r: 0.35})
      ]),
      s('rect#rect-a', {x: 0, y: 0, width: 45, height: 45}),
      s('rect#rect-b', {x: 0, y: 55, width: 45, height: 45}),
      s('rect#rect-c', {x: 55, y: 55, width: 45, height: 45}),
      s('rect#rect-d', {x: 55, y: 0, width: 45, height: 45}),
      s('use', {
        clipPath: 'url(#clip-a)',
        xLinkHref: '#rect-a',
        fill: '#0366d6'
      }),
      s('use', {
        clipPath: 'url(#clip-a)',
        xLinkHref: '#rect-b',
        fill: '#0366d6'
      }),
      s('use', {
        clipPath: 'url(#clip-a)',
        xLinkHref: '#rect-c',
        fill: '#0366d6'
      }),
      s('use', {
        clipPath: 'url(#clip-b)',
        xLinkHref: '#rect-d',
        fill: '#0366d6'
      })
    ]),
    h('h2', 'mathml'),
    h('p', [
      'You should see a formula that has 100% width, where the content is ',
      'centered, and with a big blue border. ',
      'There should also be visible whitespace between ',
      h('code', '∀A'),
      ' and ',
      h('code', '∃P')
    ]),
    h(
      'math',
      {
        xmlns: 'http://www.w3.org/1998/Math/MathML',
        display: 'block',
        className: ['mathml-class-works']
      },
      [
        h(
          'mrow',
          h('mo', {rspace: '0'}, '∀'),
          h('mi', 'A'),
          h('mo', {lspace: '0.22em', rspace: '0'}, '∃'),
          h('mi', 'P'),
          h('mo', {lspace: '0.22em', rspace: '0'}, '∀'),
          h('mi', 'B'),
          h('mspace', {width: '0.17em'}),
          h('mrow', [
            h('mo', '['),
            h('mrow', [
              h('mi', 'B'),
              h('mo', '∈'),
              h('mi', 'P'),
              h('mo', {lspace: '0.28em', rspace: '0.28em'}, '⟺'),
              h('mo', {rspace: '0'}, '∀'),
              h('mi', 'C'),
              h('mspace', {width: '0.17em'}),
              h('mrow', [
                h('mo', '('),
                h('mrow', [
                  h('mi', 'C'),
                  h('mo', '∈'),
                  h('mi', 'B'),
                  h('mo', '⇒'),
                  h('mi', 'C'),
                  h('mo', '∈'),
                  h('mi', 'A')
                ]),
                h('mo', ')')
              ])
            ]),
            h('mo', ']')
          ])
        )
      ]
    ),
    h('h2', 'xml:lang'),
    h('style', ':lang(fr) { color: #0366d6; }'),
    h('p', {xmlLang: 'fr'}, "C'est bleu ? Ensuite ça marche")
  ])
}
