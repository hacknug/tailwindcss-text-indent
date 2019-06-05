const _ = require('lodash')

const plugin = require('./index.js')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')

// const defaultConfig = require('tailwindcss/defaultConfig')
const generatePluginCss = (testConfig = {}, pluginOptions = {}) => {
  const sandboxConfig = {
    theme: {
      screens: { 'sm': '640px' },
    },
    corePlugins: false,
    plugins: [ plugin(pluginOptions) ],
  }
  const postcssPlugins =[
    tailwindcss(_.merge(sandboxConfig, testConfig)),
  ]

  return postcss(postcssPlugins)
    .process('@tailwind utilities', { from: undefined })
    .then(result => result.css)
}

expect.extend({ toMatchCss: require('jest-matcher-css') })

test('generates default utilities and responsive variants', () => {
  const testConfig = {}
  const expectedCss = ``

  return generatePluginCss(testConfig).then(css => expect(css).toMatchCss(expectedCss))
})

test('variants can be customized', () => {
  const testConfig = {
    theme: {
      textIndent: {
        sm: '2rem',
        md: '3rem',
        lg: '4rem',
      },
    },
    variants: {
      textIndent: [ 'hover' ],
    },
  }
  const expectedCss = `
    .indent-sm { text-indent: 2rem; }
    .indent-md { text-indent: 3rem; }
    .indent-lg { text-indent: 4rem; }

    .hover\\:indent-sm:hover { text-indent: 2rem; }
    .hover\\:indent-md:hover { text-indent: 3rem; }
    .hover\\:indent-lg:hover { text-indent: 4rem; }
  `

  return generatePluginCss(testConfig).then(css => expect(css).toMatchCss(expectedCss))
})

test('utilities can be customized', () => {
  const testConfig = {
    theme: {
      textIndent: {
        sm: '2rem',
        md: '3rem',
        lg: '4rem',
      },
    },
  }
  const expectedCss = `
    .indent-sm { text-indent: 2rem; }
    .indent-md { text-indent: 3rem; }
    .indent-lg { text-indent: 4rem; }

    @media (min-width: 640px) {
      .sm\\:indent-sm { text-indent: 2rem; }
      .sm\\:indent-md { text-indent: 3rem; }
      .sm\\:indent-lg { text-indent: 4rem; }
    }
  `

  return generatePluginCss(testConfig).then(css => expect(css).toMatchCss(expectedCss))
})

test('generates negative utilities', () => {
  const testConfig = {
    theme: {
      textIndent: (theme, { negative }) => ({
        ...negative({
          sm: '2rem',
          md: '3rem',
          lg: '4rem',
        })
      }),
    },
  }
  const expectedCss = `
    .-indent-sm { text-indent: -2rem }
    .-indent-md { text-indent: -3rem }
    .-indent-lg { text-indent: -4rem }

    @media (min-width: 640px) {
      .sm\\:-indent-sm { text-indent: -2rem }
      .sm\\:-indent-md { text-indent: -3rem }
      .sm\\:-indent-lg { text-indent: -4rem }
    }
  `

  return generatePluginCss(testConfig).then(css => expect(css).toMatchCss(expectedCss))
})

test('handles mixed utilities correctly', () => {
  const testConfig = {
    theme: {
      textIndent: (theme, { negative }) => ({
        ...{
          sm: '2rem',
          md: '3rem',
          lg: '4rem',
        },
        ...negative({
          sm: '2rem',
          md: '3rem',
          lg: '4rem',
        })
      }),
    },
  }
  const expectedCss = `
    .indent-sm { text-indent: 2rem }
    .indent-md { text-indent: 3rem }
    .indent-lg { text-indent: 4rem }

    .-indent-sm { text-indent: -2rem }
    .-indent-md { text-indent: -3rem }
    .-indent-lg { text-indent: -4rem }

    @media (min-width: 640px) {
      .sm\\:indent-sm { text-indent: 2rem }
      .sm\\:indent-md { text-indent: 3rem }
      .sm\\:indent-lg { text-indent: 4rem }

      .sm\\:-indent-sm { text-indent: -2rem }
      .sm\\:-indent-md { text-indent: -3rem }
      .sm\\:-indent-lg { text-indent: -4rem }
    }
  `

  return generatePluginCss(testConfig).then(css => expect(css).toMatchCss(expectedCss))
})
