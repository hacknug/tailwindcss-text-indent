const _ = require('lodash')

module.exports = function ({ indents, variants }) {
  return function ({ addUtilities, e }) {
    const utilities = _.map(indents, (size, name) => ({
      [`.${size.charAt(0) === '-' ? '-' : ''}indent-${name}`]: {
        textIndent: size,
      },
    }))

    addUtilities(utilities, variants)
  }
}
