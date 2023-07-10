import Mirador from 'mirador/dist/es/src/index';
import miradorComparePlugins from '../../src';

const config = {
  id: 'demo',
  miradorComparePlugin: {
    // restrictCompareOnSizeDefinition: true,
  },
  windows: [
    {
      // loadedManifest: 'https://www.hi.u-tokyo.ac.jp/collection/digitalgallery/ryukyu/data/iiif/0001/manifest.json',
      loadedManifest: 'http://127.0.0.1:5501/local/manifest2.json',
    },
    {
      // loadedManifest: 'https://www.hi.u-tokyo.ac.jp/collection/digitalgallery/ryukyu/data/iiif/0001/manifest.json',
      loadedManifest: 'http://127.0.0.1:5501/local/0001.json',
    },
    {
      // loadedManifest: 'https://www.hi.u-tokyo.ac.jp/collection/digitalgallery/ryukyu/data/iiif/0001/manifest.json',
      loadedManifest: 'http://127.0.0.1:5501/local/0002.json',
    },
    {
      // loadedManifest: 'https://www.hi.u-tokyo.ac.jp/collection/digitalgallery/ryukyu/data/iiif/0001/manifest.json',
      loadedManifest: 'http://127.0.0.1:5501/local/0003.json',
    },
  ],
};

Mirador.viewer(config, [
  ...miradorComparePlugins,
]);
