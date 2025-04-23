export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore']],
    'subject-max-length': [2, 'always', 72],
    'subject-case': [2, 'always', ['sentence-case']],
  },
};
