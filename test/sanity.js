import { transformFile } from 'babel-core';
import highlight from 'highlight-es';

function assertReactImport(result) {
  const match = result.code.match(/import React from 'react'/);
  if (!match) {
    throw new Error('no React import found');
  }
  if (match.length !== 1) {
    throw new Error('more or less than one match found');
  }
}
function assertReactPrimitivesSvgImport(result) {
  const match = result.code.match(/import Svg from 'react-primitives-svg'/g);
  if (!match) {
    throw new Error('no react-primitives-svg import found');
  }
  if (match.length !== 1) {
    throw new Error('more or less than one react-primitives-svg match found');
  }
}

transformFile('test/fixtures/test.jsx', {
  babelrc: false,
  presets: ['react'],
  plugins: [
    ['../../src/index', {
      defaultHeight: 32,
    }],
  ],
}, (err, result) => {
  if (err) throw err;
  assertReactImport(result);
  assertReactPrimitivesSvgImport(result);
  console.log('test/fixtures/test.jsx\n\n%s\n\n', highlight(result.code));
});

transformFile('test/fixtures/test-no-react.jsx', {
  babelrc: false,
  presets: ['react'],
  plugins: [
    '../../src/index',
  ],
}, (err, result) => {
  if (err) throw err;
  // console.log('test/fixtures/test-no-react.jsx', result.code);
  assertReactImport(result);
});

transformFile('test/fixtures/test-no-react-primitives-svg.jsx', {
  babelrc: false,
  presets: ['react'],
  plugins: [
    '../../src/index',
  ],
}, (err, result) => {
  if (err) throw err;
  // console.log('test/fixtures/test-no-react-primitives-svg.jsx', result.code);
  assertReactPrimitivesSvgImport(result);
});

transformFile('test/fixtures/test-case-sensitive.jsx', {
  babelrc: false,
  presets: ['react'],
  plugins: [
    ['../../src/index', {
      caseSensitive: true,
    }],
  ],
}, (err) => {
  if (err && err.message.indexOf('match case') !== -1) {
    // console.log('test/fixtures/test-case-sensitive.jsx',
    // 'Test passed: Expected case sensitive error was thrown');
  } else {
    throw new Error("Test failed: Expected case sensitive error wasn't thrown");
  }
});

transformFile('test/fixtures/test-no-svg-or-react.js', {
  babelrc: false,
  presets: [],
  plugins: [
    '../../src/index',
  ],
}, (err, result) => {
  if (err) throw err;
  // console.log('test/fixtures/test-no-svg-or-react.js', result.code);
  if (/React/.test(result.code)) {
    throw new Error('Test failed: React import was present');
  }
});
