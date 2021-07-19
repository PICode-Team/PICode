module.exports = {
  reactStrictMode: true,
}

const removeImports = require('next-remove-imports')({
  options: {},
})

module.exports = removeImports()