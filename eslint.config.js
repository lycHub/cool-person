import eslint from '@eslint/js';
import eslintConfigPrettier from "eslint-config-prettier/flat";
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import vue from 'eslint-plugin-vue';
import globals from "globals";
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    name: '@ysx/eslint/base',
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      }
    },
    settings: {
      "import/resolver": {
        "typescript": true,
      }, 
    },
    rules: {
      'no-console': 'error',
      'eqeqeq': ["error", "always", {"null": "ignore"}],
      'curly': 'error',
      'import/no-named-as-default-member': 'off',
      "import/order": [
        "error",
        {
          groups: [
            "builtin",     // Node.js 内置模块（如 fs、path）
            "external",    // 第三方库（如 lodash）
            "internal",    // 项目内部模块（别名路径如 @/*）
            "parent",      // 父目录模块
            "sibling",     // 同级目录模块
            "index",       // 当前目录的 index 文件
            "object",      // ES6 对象导入语法
            "type"         // TypeScript 类型导入（如 import type）
          ],
        
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",    // 分组间强制空行
          alphabetize: {
            caseInsensitive: true         // 忽略大小写
          },
          warnOnUnassignedImports: true    // 对未分组导入发出警告
        }
      ]
    }
  },

  // Vue相关
  {
    name: '@ysx/eslint/vue',
    files: ['packages/**/*.{vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      }
    },
    extends: [
      vue.configs['flat/essential'],
      vue.configs['flat/recommended'],
      vue.configs['flat/strongly-recommended']
    ],
    processor: vue.processors['.vue'],
   
    settings: {
      vue: {
        version: 'detect'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }, 


 

  {
    name: '@ysx/eslint/typescript',
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/unbound-method': 'off',
       "@typescript-eslint/ban-ts-comment": ["error", {
        minimumDescriptionLength: 5,
       }]
    }
  },

   {
    name: '@ysx/eslint/prettier',
    extends: [eslintPluginPrettierRecommended],
    rules: {
      'prettier/prettier': ['error', { endOfLine: "auto" }]
    }
  },
  eslintConfigPrettier,
  {
    ignores: [
      '**/dist/**',
      'node_modules/**',
      'packages/icons/**',
      'packages/**/*.mock.ts',
      '**/bacs/**',
      '**/express/**',
      '*.config.cjs',
      'packages/cool/spa.js'
    ]
  }
);