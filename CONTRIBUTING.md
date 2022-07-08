# Contributing to OpenSCD Core
Thanks for showing interest in contributing to the OpenSCD Core project 🤝 



## Github Actions
As part of our CI pipeline (both upon code being pushed into a remote branch and whenever a pull-request is created) we clean-install the project's dependency packages, then run `prettier` and `eslint` to find wrongly formatted code or undesired patterns. Finally unit and visual-regression tests are run by using [@web/test-runner](https://modern-web.dev/docs/test-runner/overview/) and [@web/test-runner-visual-regression](https://github.com/modernweb-dev/web/tree/master/packages/test-runner-visual-regression). Make sure that all checks are passing before marking your PR as 'Ready for review'.

## Linting & Formatting

If you use VSCode to develop, we recommend you install and use the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions in order to automatically lint and format your code as you edit it. There are similar plugins available for using ESLint and Prettier from within other IDEs and text editors.

## Code Style
Here are some important code style resources:

* We try to follow [Deno's Style Guide](https://deno.land/manual/contributing/style_guide) for our Typescript files, although there are cases where it will make sense to break the rules (as in life).
* Our commit messages are written in accordance with [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Commits also must tackle one topic at a time. If your commit message consits on a list of affairs addressed there, this can be hint that you need to create sepparate commits for each affair instead.

## Documentation
For automatic documentation generation we use [TypeDoc](https://typedoc.org/guides/overview/). When executed it will check all source files to find TSDoc/JSDoc tags in our code and generate markdown language documentation to be parsed and exported as HTML. Write descriptions only for exported types, functions, classes, etc. Documented symbols that only exist inside of their own source file will not be considered by TypeDoc because we are using the <nobr>`--excludeNotExported`</nobr> flag.   