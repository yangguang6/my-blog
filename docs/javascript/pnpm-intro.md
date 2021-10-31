# 是时候使用 pnpm 了！

## 什么是 pnpm ？

[pnpm](https://pnpm.io/) 是一个快速的、节省磁盘空间的包管理器，它包括了以下几个特点：

- ⚡ **快速** - pnpm 比替代方案快 2 倍

- 💾 **高效** - node_modules 中的文件是从一个基于内容可寻址的仓库中链接过来的

- 🐙 **支持 monorepos** - pnpm 内置支持单仓多包

- 🧐 **严格** - pnpm 创建了一个非扁平结构的 node_modules 文件夹，因此代码无法访问任意包

## 快速

pnpm 有多快？这是一张 [官方的对比图](https://pnpm.io/benchmarks) ：

![pnpm-benchmark](../images/pnpm-benchmarks.svg)

可以看到，在大多数情况下，pnpm 要比 npm / yarn 快 2 倍以上！

## 高效

在使用 npm / yarn 时，如果你有 100 个项目使用了某个依赖，那么就会有 100 份这个依赖的副本保存在硬盘上。

pnpm 将依赖统一存储在一个内容可寻址的全局仓库（默认在 `~/.pnpm-store`）中，因此：

1. 依赖只会被安装一次，对于不同的版本，pnpm 只会把有差异的文件添加到仓库中。
2. 所有的依赖都会被存储在硬盘上的同一位置。所有的包在安装时都会从同一位置创建硬链接（关于软/硬链接的概念可以参考这篇 [文章](https://www.ruanyifeng.com/blog/2011/12/inode.html) ），不会占用额外的硬盘空间。这使得我们可以跨项目的使用同一依赖。

通过这种文件系统，对于某个依赖，相对于 npm / yarn 每次的下载和拷贝，pnpm 只需要在第一次下载后创建硬链接。这样的方式大大节约了磁盘空间并提升了安装速度。

## 支持 monorepos

pnpm 内置支持 monorepos。在项目根目录执行 `pnpm i` 会自动安装所有子包的依赖。另外，还提供了 `--filter` 参数支持指定包的命令。

如果子包之间互相依赖，pnpm 还提供了 `workspace:` 协议。如果子包 A 依赖子包 B，那么在子包 A 中的 `package.json` 中可以这样写：

```json
{
  "dependencies": {
    "B": "workspace:*"
  }
}
```

更多用法可以参考官方文档 [Workspace](https://pnpm.io/workspaces) 。

## 严格

以安装 Vite 为例，先来看看 npm（8.0 版本） 的 `node_modules` ：

```shell
.bin
.package-lock.json
esbuild
esbuild-darwin-64
fsevents
function-bind
has
is-core-module
nanoid
path-parse
picocolors
postcss
resolve
rollup
source-map-js
vite
```

可以看到，npm@3 以后的版本（包括yarn）会把所有包的依赖提升到 `node_modules` 根目录，这种扁平化的结构形式虽然解决了之前依赖嵌套过深、包重复安装等问题，但同时也带来了一些新问题，例如：

1. 模块可以访问未声明过的包
2. 扁平化依赖树的算法过于复杂，耗时较长

另外，相对于 pnpm ，其硬盘空间的使用也过多。

下面是 pnpm 的 `node_modules` ：

```shell
.bin
.modules.yaml
.pnpm
vite -> .pnpm/vite@2.6.13/node_modules/vite
```

pnpm 使用了一个非扁平结构的形式：  
首先，`node_modules` 中的文件只是一个软链接（在 Windows 中 使用 [junctions](https://docs.microsoft.com/en-us/windows/win32/fileio/hard-links-and-junctions) )，实际位置是在 `.pnpm/vite@2.6.13/node_modules/vite`。
其次，只有声明过的包才会在 `node_modules` 中，其它依赖都被放在 `.pnpm` 目录下（称作"虚拟仓库"）。

`.pnpm/vite@2.6.13/node_modules/` 的目录结构如下：

```shell
esbuild -> ../../esbuild@0.13.12/node_modules/esbuild
fsevents -> ../../fsevents@2.3.2/node_modules/fsevents
postcss -> ../../postcss@8.3.11/node_modules/postcss
resolve -> ../../resolve@1.20.0/node_modules/resolve
rollup -> ../../rollup@2.58.3/node_modules/rollup
vite
```

可以看到 vite 的依赖也是软链接，实际位置也在 `.pnpm` 中。并且会和 vite 在同一级 `node_modules` 目录。`vite` 中的文件是创建的硬链接。

通过以上方式，既于 Node.js 寻找依赖的算法兼容，又保证了只有声明的包才可以访问，防止依赖未声明的包的问题。

## 谁在使用？

[Vue 3](https://github.com/vuejs/vue-next) 、 [Vite](https://github.com/vitejs/vite) 、 [Rollup plugins](https://github.com/rollup/plugins) 等许多项目已经使用 pnpm。

## corepack

[corepack](https://github.com/nodejs/corepack) 是一个零运行时依赖包，作为 Node 项目和其包管理器间的桥梁。简单来说，就是"包管理器的管理器"。它可以让我们在不安装 yarn 或 pnpm 的情况下来使用它们。

如果你不想安装 pnpm 也没关系，Node.js 16.9 之后的版本已内置 corepack。我们可以通过以下方法来直接使用 pnpm 而无需手动安装：

首先，在 `package.json` 文件中声明项目使用的包管理器：

```json
{
  "packageManager": "pnpm"
}
```

接着，命令行运行 `corepack enable` 即可愉快使用了😄。


## 总结

通过对 pnpm 一些核心特点的介绍，可以了解到 pnpm 不但几乎包括了 npm / yarn 所有的功能，而且安装速度要更快，也节省更多的磁盘空间，还多了对 monorepos 的内置支持。是时候抛弃 npm / yarn，使用 pnpm 了！
