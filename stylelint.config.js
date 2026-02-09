import recommendedVue from 'stylelint-config-recommended-vue';
import sassGuidelines from 'stylelint-config-sass-guidelines';
import standardScss from 'stylelint-config-standard-scss';

/** @type {import('stylelint').Config} */
export default {
  extends: [
    standardScss,
    sassGuidelines,
    recommendedVue
  ],
  plugins: ['stylelint-order'],
  customSyntax: 'postcss-html',
  rules: {
    'scss/dollar-variable-pattern': '^[a-z][a-z0-9_-]*$',
    'scss/at-mixin-pattern': '^[a-z][a-z0-9_-]*$',
    'max-nesting-depth': null,
    'selector-max-id': 1,
    'selector-max-compound-selectors': null,
     "declaration-property-value-disallowed-list": {
      "border": ["!none"],
      "/^border-/": ["!none"]
    },
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ],
    'order/order': [
      'custom-properties',
      'dollar-variables',
      'declarations',
      'rules',
      'at-rules'
    ],
    "selector-no-qualifying-type": [true, { "ignore": ["class"] }]
  },
  ignoreFiles: [
    'node_modules',
    'dist',
  ],
  overrides: [
    {
      files: ['**/*.{scss,sass}'],
      customSyntax: 'postcss-scss'
    }
  ]
}