## 基本使用

像常规svg component一样，可直接用css改颜色和大小，

还有些快捷属性可参考：[iconify](https://iconify.design/docs/iconify-icon/)

```tsx
import { Icon } from '@iconify-icon/vue';
<Icon icon="zs:delete" />;
```

## 预览所有icon

run以下命令启动vite dev server：

```sh
pnpm start:icon
```

## 修改更新icon

比如要新增一个 test.svg:

1. 将test.svg下载到 svgs目录下
2. pnpm build:icon 后即可使用
