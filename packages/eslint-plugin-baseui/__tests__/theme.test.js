/*
Copyright (c) 2018-2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/

'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../src/theme.js');
const MESSAGES = require('../src/messages.js');

RuleTester.setDefaultConfig({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

const tests = {
  valid: [
    {
      code: `
        // style function - renaming a valid property to one of our deprecated properties
        styled('div', ({$theme: {colors: {foo: foreground}}}) => {
          return {
            color: foreground,
          };
        });
      `,
    },
    {
      code: `
        // TODO(should-fail)
        // style function - using deprecated property in a nested function
        styled('div', props => {
          const foo = () => props.$theme.colors.foreground;
          return {
            color: foo(),
          };
        });
      `,
    },
    {
      code: `
        // TODO(should-fail)
        // overrides - object defined elsewhere
        const fooOverrides = {
          Root: {
            style: ({$theme}) => ({ color: $theme.colors.foreground }),
          },
        };
        export default () => <Foo overrides={fooOverrides} />;
      `,
    },
  ],
  invalid: [
    {
      code: `
        // styled - no destructuring
        styled('div', props => {
          return {
            color: props.$theme.colors.foreground,
          };
        });
      `,
      output: `
        // styled - no destructuring
        styled('div', props => {
          return {
            color: props.$theme.colors.contentPrimary,
          };
        });
      `,
      errors: [
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
      ],
    },
    {
      code: `
        // withStyle - no destructuring
        withStyle(<Foo />, props => {
          return {
            color: props.$theme.colors.foreground,
          };
        });
      `,
      output: `
        // withStyle - no destructuring
        withStyle(<Foo />, props => {
          return {
            color: props.$theme.colors.contentPrimary,
          };
        });
      `,
      errors: [
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
      ],
    },
    {
      code: `
        // styled - $theme destructured
        styled('div', ({ $theme }) => {
          return {
            color: $theme.colors.foreground,
          };
        });
      `,
      output: `
        // styled - $theme destructured
        styled('div', ({ $theme }) => {
          return {
            color: $theme.colors.contentPrimary,
          };
        });
      `,
      errors: [
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
      ],
    },
    {
      code: `
        // withStyle - $theme destructured
        withStyle(<Foo />, ({ $theme }) => {
          return {
            color: $theme.colors.foreground,
          };
        });
      `,
      output: `
        // withStyle - $theme destructured
        withStyle(<Foo />, ({ $theme }) => {
          return {
            color: $theme.colors.contentPrimary,
          };
        });
      `,
      errors: [
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
      ],
    },
    {
      code: `
        // styled - nested destructuring for "concern"
        styled('div', ({ $theme: {colors} }) => {
          return {
            color: colors.foreground,
          };
        });
      `,
      output: `
        // styled - nested destructuring for "concern"
        styled('div', ({ $theme: {colors} }) => {
          return {
            color: colors.contentPrimary,
          };
        });
      `,
      errors: [
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
      ],
    },
    {
      code: `
        // withStyle - nested destructuring for "concern"
        withStyle(<Foo />, ({ $theme: {colors} }) => {
          return {
            color: colors.foreground,
          };
        });
      `,
      output: `
        // withStyle - nested destructuring for "concern"
        withStyle(<Foo />, ({ $theme: {colors} }) => {
          return {
            color: colors.contentPrimary,
          };
        });
      `,
      errors: [
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
      ],
    },
    {
      code: `
        // styled - nested destructuring of the deprecated theme property
        styled('div', ({ $theme: {colors: {foreground}} }) => {
          return {
            color: foreground,
          };
        });
      `,
      output: `
        // styled - nested destructuring of the deprecated theme property
        styled('div', ({ $theme: {colors: {contentPrimary}} }) => {
          return {
            color: contentPrimary,
          };
        });
      `,
      errors: [
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
      ],
    },
    {
      code: `
        // withStyle - nested destructuring of the deprecated theme property
        withStyle(<Foo />, ({ $theme: {colors: {foreground}} }) => {
          return {
            color: foreground,
          };
        });
      `,
      output: `
        // withStyle - nested destructuring of the deprecated theme property
        withStyle(<Foo />, ({ $theme: {colors: {contentPrimary}} }) => {
          return {
            color: contentPrimary,
          };
        });
      `,
      errors: [
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
      ],
    },
    {
      code: `
        // styled - renaming a nested & destructured & deprecated theme property
        styled('div', ({$theme: {colors: {foreground: foo}}}) => {
          return {
            color: foo,
          };
        });
      `,
      output: `
        // styled - renaming a nested & destructured & deprecated theme property
        styled('div', ({$theme: {colors: {contentPrimary: foo}}}) => {
          return {
            color: foo,
          };
        });
      `,
      errors: [
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
      ],
    },
    {
      code: `
        // overrides - no destructuring
        export default () => (
          <Foo
            overrides={{
              Root: { style: props => ({ color: props.$theme.colors.foreground }) }
            }}
          />
        )
      `,
      output: `
        // overrides - no destructuring
        export default () => (
          <Foo
            overrides={{
              Root: { style: props => ({ color: props.$theme.colors.contentPrimary }) }
            }}
          />
        )
      `,
      errors: [
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
      ],
    },
    {
      code: `
        // overrides - $theme destructured
        export default () => (
          <Foo
            overrides={{
              Root: { style: ({$theme}) => ({ color: $theme.colors.foreground }) }
            }}
          />
        )
      `,
      output: `
        // overrides - $theme destructured
        export default () => (
          <Foo
            overrides={{
              Root: { style: ({$theme}) => ({ color: $theme.colors.contentPrimary }) }
            }}
          />
        )
      `,
      errors: [
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
      ],
    },
    {
      code: `
        // overrides - "concern" destructured
        export default () => (
          <Foo
            overrides={{
              Root: { style: ({$theme: {colors}}) => ({ color: colors.foreground }) }
            }}
          />
        )
      `,
      output: `
        // overrides - "concern" destructured
        export default () => (
          <Foo
            overrides={{
              Root: { style: ({$theme: {colors}}) => ({ color: colors.contentPrimary }) }
            }}
          />
        )
      `,
      errors: [
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
      ],
    },
    {
      code: `
        // overrides - deprecated property destructured
        export default () => (
          <Foo
            overrides={{
              Root: {
                style: ({
                  $theme: {
                    colors: { foreground }
                  }
                }) => ({ color: foreground })
              }
            }}
          />
        )
      `,
      output: `
        // overrides - deprecated property destructured
        export default () => (
          <Foo
            overrides={{
              Root: {
                style: ({
                  $theme: {
                    colors: { contentPrimary }
                  }
                }) => ({ color: contentPrimary })
              }
            }}
          />
        )
      `,
      errors: [
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
      ],
    },
    {
      code: `
        // overrides - deprecated property destructured and renamed
        export default () => (
          <Foo
            overrides={{
              Root: {
                style: ({
                  $theme: {
                    colors: { foreground: foo }
                  }
                }) => ({ color: foo })
              }
            }}
          />
        )
      `,
      output: `
        // overrides - deprecated property destructured and renamed
        export default () => (
          <Foo
            overrides={{
              Root: {
                style: ({
                  $theme: {
                    colors: { contentPrimary: foo }
                  }
                }) => ({ color: foo })
              }
            }}
          />
        )
      `,
      errors: [
        {
          messageId: MESSAGES.replaceThemeProperty.id,
          data: {
            old: 'foreground',
            new: 'contentPrimary',
          },
        },
      ],
    },
  ],
};

// For easier local testing
if (!process.env.CI) {
  let only = [];
  let skipped = [];
  [...tests.valid, ...tests.invalid].forEach(t => {
    if (t.skip) {
      delete t.skip;
      skipped.push(t);
    }
    if (t.only) {
      delete t.only;
      only.push(t);
    }
  });
  const predicate = t => {
    if (only.length > 0) {
      return only.indexOf(t) !== -1;
    }
    if (skipped.length > 0) {
      return skipped.indexOf(t) === -1;
    }
    return true;
  };
  tests.valid = tests.valid.filter(predicate);
  tests.invalid = tests.invalid.filter(predicate);
}

const ruleTester = new RuleTester();
ruleTester.run('theme', rule, tests);
