# Tailwind CSS Text Indent Plugin

This plugin adds utilities to use text-indent with Tailwind CSS.

## Installation

Add this plugin to your project:

```bash
# Install using pnpm
pnpm install --save-dev tailwindcss-text-indent

# Install using npm
npm install --save-dev tailwindcss-text-indent

# Install using yarn
yarn add -D tailwindcss-text-indent
```

## Usage

```js
// tailwind.config.js
{
  theme: { // defaults to these values
    textIndent: (theme, { negative }) => ({
      ...{
        // sm: '2rem',
        // md: '3rem',
        // lg: '4rem',
      },
      ...negative({
        // sm: '2rem',
        // md: '3rem',
        // lg: '4rem',
      }),
    }),
  },

  variants: { // all the following default to ['responsive']
    textIndent: ['responsive'],
  },

  plugins: [
    require('tailwindcss-text-indent')(), // no options to configure
  ],
}
```

```css
.indent-sm { text-indent: 2rem; }
.indent-md { text-indent: 3rem; }
.indent-lg { text-indent: 4rem; }

.-indent-sm { text-indent: -2rem; }
.-indent-md { text-indent: -3rem; }
.-indent-lg { text-indent: -4rem; }
```
