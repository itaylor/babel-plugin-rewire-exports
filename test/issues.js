import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from '@babel/core';
import { trim } from './util';
import plugin from '../src';

describe.skip('issues', () => {
  const options = {
    babelrc: false,
    presets: ['@babel/preset-env'],
    plugins: [plugin]
  };

  const assertIssue = (id, options) => {
    const actual = transformFileSync(`./test/issues/${id}/input.js`, options).code;
    const expected = fs.readFileSync(`./test/issues/${id}/output.js`).toString();

    assert.strictEqual(trim(actual), trim(expected));
  };

  it('#1 undefined wire', () => {
    assertIssue(1, options);
  });

  it('#5 Explicit re-export is not working', () => {
    assertIssue(5, options);
  });

  it('#6 Fail to rewire named exported constant functions', () => {
    const options = {
      babelrc: false,
      plugins: [[plugin, {
        unsafeConst: true
      }]]
    };
    assertIssue(6, options);
  });

  it('#13 Wrong names are exported', () => {
    const options = {
      babelrc: false,
      presets: [[
        '@babel/preset-env',
        { modules: false }
      ]],
      plugins: [plugin]
    };
    assertIssue(13, options);
  });

  it('#15 Problem trying to rewire function within same file', () => {
    const options = {
      babelrc: false,
      plugins: [[plugin, {
        unsafeConst: true
      }]]
    };
    assertIssue(15, options);
  });

  it('#19 Duplicate exports in es5', () => {
    const options = {
      babelrc: false,
      presets: [[
        '@babel/preset-env',
        { modules: false }
      ]],
      plugins: [plugin]
    };
    assertIssue(19, options);
  });

  it('#20 export functional components', () => {
    const options = {
      babelrc: false,
      presets: [[
        '@babel/preset-env',
        { modules: false }
      ]],
      plugins: [plugin]
    };
    assertIssue(20, options);
  });

  it('#23 warnings in combination with typescript', () => {
    const options = {
      babelrc: false,
      plugins:
        [plugin, '@babel/plugin-transform-typescript']
    };
    assertIssue(23, options);
  });

  it('#25 Build fails when using export const', () => {
    const options = {
      babelrc: false,
      plugins: [plugin]
    };
    assertIssue(25, options);
  });

  it('#28 JSX is not transformed properly in development mode', () => {
    const options = {
      babelrc: false,
      presets: [[
        '@babel/preset-react',
        { development: true }
      ]],
      plugins: [plugin]
    };

    const path = './test/issues/28';
    const actual = transformFileSync(`${path}/input.jsx`, options).code;
    const expected = fs.readFileSync(`${path}/output.js`).toString();

    const tweaked = actual.replace(/"[^"]+\binput\.jsx"/, '"input.jsx"');
    assert.strictEqual(trim(tweaked), trim(expected));
  });
});
