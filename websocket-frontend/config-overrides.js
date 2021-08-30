const { addBabelPlugin, override } = require('customize-cra');

module.exports = override(
  addBabelPlugin([
    'babel-plugin-root-import', // Plugin
    // Abaixo configurações do plugin
    {
      rootPathSuffix: 'src', // Pasta onde está a maioria do meu código
    },
  ])
);
