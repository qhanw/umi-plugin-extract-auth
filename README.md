# umi-plugin-extract-auth

[![NPM version](https://img.shields.io/npm/v/umi-plugin-extract-auth.svg?style=flat)](https://npmjs.org/package/umi-plugin-extract-auth)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-extract-auth.svg?style=flat)](https://npmjs.org/package/umi-plugin-extract-auth)


## Install

```bash
# or yarn
$ npm install
```

```bash
$ npm run build --watch
$ npm run start
```

## Usage

Install

```bash
npm install --save umi-plugin-extract-auth
```


Configure in `.umirc.js`,

```js
export default {
  plugins: [
    ['umi-plugin-extract-auth', options],
  ],
}
```

Configure in AntdPro,

```ts
const plugins: IPlugin[] = [
  [
    'umi-plugin-extract-auth',
    options,
  ],
];
```

## Options

| 属性 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :----- |
| routerPath       | 路由配置位置         | string   | config                                      |
| sourceDir        | 业务权限配置位置     | string   | pages                                       |
| outputFile       | 生成权限配置文件名称 | string   | authorization.ts                            |
| routeFilterRules | 过滤未配置权限页面   | string[] | ["exception", "error", "404", "403", "500"] |

## LICENSE

MIT
