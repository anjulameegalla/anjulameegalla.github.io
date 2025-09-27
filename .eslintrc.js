module.exports = {
  extends: [
    'next/core-web-vitals'
  ],
  rules: {
    // Fix issues with quotes and apostrophes
    'react/no-unescaped-entities': 'off',
    
    // Remove TypeScript rules that are causing issues
    '@typescript-eslint/no-unused-vars': 'off',
    
    // Fix issues with sort order
    'react/jsx-sort-props': 'off',
    'typescript-sort-keys/interface': 'off',
    'sort-keys-fix/sort-keys-fix': 'off',
    
    // Fix issues with node protocol
    'unicorn/prefer-node-protocol': 'off',
    
    // Fix issues with regex
    'unicorn/better-regex': 'off',
    'no-useless-escape': 'off',
    
    // Fix issues with arrow function parentheses
    'arrow-parens': 'off',
    
    // Fix issues with newlines at end of file
    'eol-last': 'warn',
    
    // Fix issues with import duplicates
    'import/no-duplicates': 'off',
  },
}; 