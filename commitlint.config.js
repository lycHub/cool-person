export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 自定义提交类型（默认含 feat/fix/docs 等）
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // Bug修复
        'docs',     // 文档更新
        'style',    // 代码格式调整（非 CSS）
        'refactor', // 代码重构
        'perf',     // 性能优化
        'test',     // 测试代码
        'chore',    // 构建/工具变更
        'revert',   // 版本回退
        'build'     // 构建流程调整
      ]
    ],
  },
  defaultIgnores: true,
  helpUrl: "https://github.com/conventional-changelog/commitlint/#what-is-commitlint",
}