import Mirador from 'mirador/dist/es/src/index';
import miradorComparePlugins from '../../src';

const config = {
  id: 'demo',
  miradorComparePlugin: {
  },
  windows: [

    {
      loadedManifest: 'https://raw.githubusercontent.com/nakamura196/mirador-compare-plugin/main/assets/json/agriculture.json',
    },
    {
      loadedManifest: 'https://raw.githubusercontent.com/nakamura196/mirador-compare-plugin/main/assets/json/shashincho.json',
    },
  ],
};

Mirador.viewer(config, [
  ...miradorComparePlugins,
]);
