const _ = require('lodash')
const flatten = require('flat')


const FLATTEN_CONFIG = { delimiter: '-', maxDepth: 2 }
const handleName = (name, className) => {
  const split = name.split(`${className}-`)
  const prefixedName = `${split[0]}${prefixNegativeModifiers(className, split[1])}`

  return prefixedName.split('-default').join('')
}
const prefixNegativeModifiers = function(base, modifier) {
  return _.startsWith(modifier, '-')
    ? `-${base}-${modifier.slice(1)}`
    : `${base}-${modifier}`
}


module.exports = function () {
  return function ({
    addUtilities, addComponents, addBase, addVariant,
    e, prefix, theme, variants, config,
  }) {
    const buildConfig = (themeKey, ...fallbackKeys) => {
      return buildConfigFromTheme(themeKey, ...fallbackKeys) || buildConfigFromArray(themeKey)
    }
    const buildConfigFromTheme = (themeKey, ...fallbackKeys) => {
      const buildObject = ([ modifier, value ]) => [ modifier, { [themeKey]: value } ]
      const getThemeSettings = (themeKey, fallbackKeys) => {
        const [newThemeKey, ...newFallbackKeys] = fallbackKeys || []

        return theme(themeKey, false) || (fallbackKeys.length && getThemeSettings(newThemeKey, [...newFallbackKeys]))
      }

      const themeSettings = getThemeSettings(themeKey, fallbackKeys)
      const themeObject = _.isArray(themeSettings) ? _.zipObject(themeSettings, themeSettings) : themeSettings
      const themeEntries = themeSettings && Object
        .entries(flatten(themeObject, FLATTEN_CONFIG))
        .map(entry => buildObject(entry))

      return themeSettings ? _.fromPairs(themeEntries) : false
    }
    const buildConfigFromArray = (property) => {
      const defaultSettings = defaultValues[property]
      const defaultEntries = defaultSettings && defaultSettings
        .map((value) => ([value, { [property]: value }]))

      return defaultSettings ? _.fromPairs(defaultEntries) : false
    }

    const defaultValues = {}
    const pluginUtilities = {
      'indent': buildConfig('textIndent'),
    }

    Object.entries(pluginUtilities)
      .filter(([ modifier, values ]) => !_.isEmpty(values))
      .forEach(([ modifier, values ]) => {
        const className = _.kebabCase(modifier)
        const variantName = Object.keys(Object.entries(values)[0][1])[0]
        const utilities = flatten({ [`.${e(`${className}`)}`]: values }, FLATTEN_CONFIG)

        addUtilities(
          _.mapKeys(utilities, (value, key) => handleName(key, className)),
          variants(variantName, ['responsive'])
        )
      })
  }
}
