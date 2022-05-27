/* eslint-disable import/no-extraneous-dependencies */
const { maxLineLength } = require('@commitlint/ensure')

const bodyMaxLineLength = 100

const validateBodyMaxLengthIgnoringDeps = (parsedCommit) => {
  const { type, scope, body } = parsedCommit
  const isDepsCommit =
    type === 'chore' && (scope === 'deps' || scope === 'deps-dev')

  return [
    isDepsCommit || !body || maxLineLength(body, bodyMaxLineLength),
    `body's lines must not be longer than ${bodyMaxLineLength}`,
  ]
}

module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: ['commitlint-plugin-function-rules'],
  rules: {
    'body-max-line-length': [0],
    'function-rules/body-max-line-length': [
      2,
      'always',
      validateBodyMaxLengthIgnoringDeps,
    ],
    'function-rules/body-full-stop': [
      2, // level: error
      'always',
      (parsedCommit) => {
        const jiraRegex = parsedCommit.body.toString().match(/[A-Z]+[-\d]+/g)
        const jiraIgnoreRegex = parsedCommit.body.toString().match(/TECH/g)
        if (jiraRegex != null || jiraIgnoreRegex != null) {
          return [true]
        }
        return [false, 'The body doesnot have Jira ID OR ignore quote']
      },
    ],
  },
}
