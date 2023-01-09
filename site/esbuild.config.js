// const importPlugin = require('esbuild-dynamic-import-plugin')

// let skipReactImports = {
//     name: 'skipReactImports',
//     setup(build) {
//         build.onResolve({ filter: /^react(-dom)?$/ }, (args) => {
//             return {
//                 path: args.path,
//                 namespace: `globalExternal_${args.path}`,
//             };
//         });

//         build.onLoad(
//             { filter: /.*/, namespace: 'globalExternal_react' },
//             () => {
//                 return {
//                     contents: `module.exports = globalThis.React`,
//                     loader: 'js',
//                 };
//             }
//         );

//         build.onLoad(
//             { filter: /.*/, namespace: 'globalExternal_react-dom' },
//             () => {
//                 return {
//                     contents: `module.exports = globalThis.ReactDOM`,
//                     loader: 'js',
//                 };
//             }
//         );
//     },
// };

// require('esbuild').build({
//     bundle: true,
//     plugins: [skipReactImports, importPlugin],
// }).catch(() => process.exit(1))