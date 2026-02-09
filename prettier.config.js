/** @type {import('prettier').Config} */
const config = {
  // 基础格式规则
  printWidth: 100,                // 单行代码最大长度 
  tabWidth: 2,                    // 缩进空格数 
  useTabs: false,                 // 禁用制表符缩进
  semi: true,                     // 语句末尾加分号
  singleQuote: true,              // 使用单引号
  
  bracketSpacing: true,           // 对象括号内加空格 { foo: bar }
  bracketSameLine: false,         // 多行 HTML 标签闭合符换行 
  
  overrides: [
    {
      files: '*.{css,scss}',
      options: {
        singleQuote: false        // CSS 属性值使用双引号 
      }
    },
    {
      files: '*.{json,jsonc}',
      options: {
        useTabs: false,
        tabWidth: 2
      }
    }
  ]
};

export default config;