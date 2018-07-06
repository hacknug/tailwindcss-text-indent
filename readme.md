# Tailwind CSS Text Indent Plugin

This plugin adds utilities to use text-indent with Tailwind CSS.

## Installation

Add this plugin to your project:

```bash
# Install using npm
npm install --save-dev tailwindcss-text-indent

# Install using yarn
yarn add -D tailwindcss-text-indent
```

## Usage

Because the plugin preprends a dash to the class name when the value is negative, if you want both positive and negative classes to share the same name, you'll have to require the plugin twice. If you have a better idea on how to deal with this, feel free to open an issue to discuss it.

```js
require('tailwindcss-text-indent')({
  indents: {
    'sm': '2rem',
    'md': '3rem',
    'lg': '4rem',
  },
  variants: ['responsive'],
})
require('tailwindcss-text-indent')({
  indents: {
    'sm': '-2rem',
    'md': '-3rem',
    'lg': '-4rem',
  },
  variants: ['responsive'],
})
```

```css
.indent-sm { text-indent: 2rem; }
.indent-md { text-indent: 3rem; }
.indent-lg { text-indent: 4rem; }
.-indent-sm { text-indent: -2rem; }
.-indent-md { text-indent: -3rem; }
.-indent-lg { text-indent: -4rem; }
```
