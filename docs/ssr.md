## SSR 开发部署


1. 切换到SSR分支
```shell
git switch ssr
```
2. 安装依赖
```shell
pnpm i
```
3. 启动dev server
```shell
pnpm dev:ssr
```
4. 生产打包
```shell
# 产出dist目录
pnpm build:ssr
```
5. 预览(部署)
```shell
pnpm server:ssr
```
6. 可选pm2部署，[文档](https://pm2.node.org.cn/docs/usage/process-management/)

简单参考：

```shell
pnpm add pm2 -D -w
pnpx pm2 start express/index.js
```


推荐参考：https://github.com/lycHub/cool-person/tree/ssr-deploy