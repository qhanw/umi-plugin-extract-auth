// ref:
// - https://umijs.org/plugin/develop.html
import { IApi } from "umi-types";
import { join } from "path";

import generate from "./generate";

export default function(api: IApi, opts) {
  const { paths } = api;
  // api.onStart(() => {
  //    generate(api);
  // });

  api.addPageWatcher(join(paths.absSrcPath, "pages"));

  api.addRendererWrapperWithComponent(() => {
    generate(api);
    return (join(__dirname, "./tpl.js"));
  });

  // 导出文件到监时目录
  // api.addUmiExports([
  //   {
  //     specifiers: ['connect'],
  //     source: 'dva',
  //   },
  // ]);

  // api.chainWebpackConfig(webpackConfig => {
  //   webpackConfig.resolve.alias.set(
  //     "umi/lodash",
  //     dirname(require.resolve("lodash/package"))
  //   );
  // });

  // api.modifyAFWebpackOpts(memo => {
  //   if (opts.external) {
  //     return memo;
  //   }
  //   return {
  //     ...memo,
  //     babel: {
  //       ...(memo.babel || {}),
  //       plugins: [importPlugin("umi/lodash"), importPlugin("lodash")]
  //     }
  //   };
  // });

  // api.modifyAFWebpackOpts(memo => {
  //   if (opts.external) {
  //     return {
  //       ...memo,
  //       externals: {
  //         ...(memo.externals || []),
  //         "umi/lodash": "_",
  //         lodash: "_"
  //       }
  //     };
  //   }
  //   return memo;
  // });

  // api.addHTMLHeadScript(() => {
  //   if (opts.external) {
  //     if (opts.version) {
  //       return {
  //         src: `https://cdnjs.cloudflare.com/ajax/libs/lodash.js/${opts.version}/lodash.min.js`
  //       };
  //     } else {
  //       throw new Error("if you need external lodash, version is required!");
  //     }
  //   }
  //   return [];
  // });

  // Example: output the webpack config
  // api.chainWebpackConfig(config => {
  //   // console.log(config.toString());
  // });
}
