const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const path = require('path');

const rootPackagePath = process.cwd();
const input = path.join(rootPackagePath, 'src/index.ts');
const pkg = require(path.join(rootPackagePath, 'package.json'));

const outputDir = path.join(rootPackagePath, 'lib');
const pgkName = pkg.name.split('/').pop();

const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

const plugins = [json(), typescript()];

module.exports = [
    // ESM
    {
        input,
        output: {
            exports: 'named',
            file: path.join(outputDir, `esm/${pgkName}.js`),
            format: 'esm',
        },
        external,
        plugins,
    },

    // Minified ESM
    {
        input,
        output: {
            exports: 'named',
            file: path.join(outputDir, `esm/${pgkName}.min.js`),
            format: 'esm',
        },
        external,
        plugins: plugins.concat([terser()]),
    },
];
