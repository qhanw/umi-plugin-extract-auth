import { IApi } from "umi-types";

const path = require("path");
const fs = require("fs");
// 需要操作的目录
let sourceDir = "pages";
// const outputConfig = "config/authority";
// 需要过滤的关键字
const routeFilterRules = ["exception", "error", "404", "403", "500"];
// 可以解析的模块后缀名
const resolvedExtensions = [".tsx", ".ts", ".jsx", ".js"];
// ast
const babel = require("@babel/core");
const traverse = require("@babel/traverse").default;
const commentType = "@CONFIGURE_AUTH";
// 菜单资源
export const menuSources = [];
// 所有资源
// let allSources = [];

// 匹配page中权限相关配置的字段
const authFields = ["title", "path", "type", "action"];

// 封装路由权限资源
const genSource = (properties: any, parent?: any) => {
  let obj: any = {};
  properties.forEach(property => {
    if (property.key.name === "name") {
      // 设置当前叶子路由的名称和中文名称
      obj["title"] = property.value.value;
    }
    if (property.key.name === "cName") {
      obj["cName"] = property.value.value || "";
    }
    if (property.key.name === "path") {
      let key = property.value.value.replace(/\//, "").replace(/\//g, ":");
      key = key.toUpperCase().replace(/\-/g, "_");
      obj["action"] = key;
    }
    if (property.key.name === "component") {
      obj["component"] = property.value.value;
    }
  });
  obj.children = [];
  return obj;
};
// 迭代路由配置的ast
const BabelTraverseMenu = {
  ObjectExpression: path => {
    let properties = path.node.properties;
    // 根据当前节点找到节点所有的key
    let keys = properties.map(property => property.key.name);
    if (
      keys.includes("path") &&
      keys.includes("name") &&
      keys.includes("routes")
    ) {
      // 有path、name、routes三个属性的对象提取为上层资源
      menuSources.push(genSource(properties));
    }
    if (
      keys.includes("path") &&
      !keys.includes("routes") &&
      !keys.includes("redirect")
    ) {
      // 叶子路由 component加上  需要根据component查找页面上的权限资源配置
      let obj = genSource(properties);
      obj.isLeaf = true;
      menuSources.push(obj);
    }
  },
  ArrayExpression: path => {
    // 当前路径上的node
    const currentNode = path.node;
    currentNode.elements.forEach(element => {
      console.log(element.parentPath);
    });
    // console.log(path.parentPath.parentPath.node)
  }
};
// page ast 解析auth配置
const parsePageAst = (file, source) => {
  const content = fs.readFileSync(file, "utf-8");
  const plugins =
    path.extname(file) === ".tsx"
      ? [["@babel/plugin-transform-typescript", { isTSX: true }]]
      : [];
  // ast解析配置
  const options = {
    ast: true,
    presets: ["@babel/preset-react"],
    plugins: plugins
  };
  const { ast } = babel.transform(content, options);
  // 筛选出权限资源的配置
  let comments = ast.comments.filter(
    comment =>
      (comment.type === "CommentBlock" || comment.type === "Block") &&
      comment.value.includes(commentType)
  );
  comments.forEach(comment => {
    const value = comment.value;
    let obj = {};
    authFields.forEach(field => {
      let reg = new RegExp(`${field}:(.+)`);
      let result = value.match(reg);
      result = (result && result[1]) || "";
      result = result.replace(/\s+/g, "");
      obj[field] = result;
    });
    source.children.push(obj);
  });
};
/**
 * 解析页面权限资源配置
 */
export const parsePage = (api: IApi) => {
  const sources = menuSources;
  sources.forEach(source => {
    if (source.isLeaf) {
      //
      let pagePath = source.component;
      pagePath = path.resolve(api.paths.absSrcPath, sourceDir, pagePath);
      try {
        const stat = fs.statSync(pagePath);
        if (stat.isDirectory()) {
          // component是个目录则取目录下index文件解析
          const files = fs.readdirSync(pagePath);
          let file = files.filter(file => file.split(".")[0] === "index")[0];
          file = path.join(pagePath, file);
          parsePageAst(file, source);
        } else if (stat.isFile()) {
          // 如果是单个文件
          parsePageAst(pagePath, source);
        }
      } catch (error) {
        if (error.code === "ENOENT") {
          // 无此文件或目录 再根据可解析的后缀名查找一次
          for (let i = 0; i < resolvedExtensions.length; i++) {
            const ext = resolvedExtensions[i];
            let page = `${pagePath}${ext}`;
            page = require.resolve(page);
            if (page) {
              parsePageAst(page, source);
              break;
            }
          }
        }
      }
    }
  });
};
// 过滤文件
const filterFiles = (files, rules) => {
  files = files.filter(file => {
    const arr = file.split(".");
    if (arr.length === 2 && !rules.includes(arr[0])) {
      // 排除ts类型定义文件和默认过滤文件
      return file;
    }
  });
  return files;
};
/**
 * 解析路由
 */
export const parseRouter = (api: IApi) => {
  const routeConfigPath = path.resolve(api.paths.cwd, "./config");
  const stat = fs.statSync(routeConfigPath);
  if (stat.isDirectory()) {
    // 目录
    let files = fs.readdirSync(routeConfigPath);
    files = filterFiles(files, routeFilterRules);
    files.map(file => {
      const filePath = `${routeConfigPath}/${file}`;
      const content = fs.readFileSync(filePath, "utf8");
      const options = {
        ast: true,
        // presets: ["@babel/env"],
        plugins: ["@babel/plugin-transform-typescript"]
      };
      try {
        const { ast } = babel.transform(content, options);
        // 迭代ast
        traverse(ast, BabelTraverseMenu);
        //
      } catch (error) {
        console.error(error);
      }
    });
  }
};

export const genContent = (api: IApi, allSources) => {
  console.log("allSources----", allSources);
  const content = `const sources = ${JSON.stringify(
    allSources
  )}; export default sources`;

  // let writeFilePath = options.outputFile || "./config/auth.ts";

  const dir = `${api.paths.cwd}/.auth`;


  fs.rmdirSync(dir, { recursive: true });
  fs.mkdirSync(dir);
  fs.writeFileSync(`${dir}/index.ts`, content, "utf-8");


};
