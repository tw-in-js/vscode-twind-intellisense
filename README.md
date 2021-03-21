<div align="center">

# Twind Intellisense for VS Code

Intelligent [Twind](https://twind.dev) tooling for VS Code

[![MIT License](https://flat.badgen.net/github/license/tw-in-js/vscode-twind-intellisense)](https://github.com/tw-in-js/vscode-twind-intellisense/blob/main/LICENSE)
[![Latest Release](https://vsmarketplacebadge.apphb.com/version/sastan.twind-intellisense.svg)](https://marketplace.visualstudio.com/items?itemName=sastan.twind-intellisense)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Fvscode-twind-intellisense?icon=github&label)](https://github.com/tw-in-js/vscode-twind-intellisense)

![Demo](https://raw.githubusercontent.com/tw-in-js/vscode-twind-intellisense/main/assets/demo.gif)

</div>

---

## Features

Provides editor support for `tw` tagged template syntax including:

- IntelliSense for [twind](https://twind.dev) variants and classes
- IntelliSense within JSX attributes
- Quick info hovers
- Details about the generated CSS
- Support for grouping of variants and classes
- Warnings on unknown classes
- Warnings on unknown theme values
- Warnings on unknown variants

## Installation

**[Install via the Visual Studio Code Marketplace →](https://marketplace.visualstudio.com/items?itemName=sastan.twind-intellisense)**

**[Install via the Open VSX Registry →](https://open-vsx.org/extension/sastan/twind-intellisense)**

## Usage

The twind extension adds highlighting and IntelliSense for Twind classes in JavaScript and TypeScript. It works out of the box when you use VS Code's built-in version of TypeScript.

If you have a custom twind configuration you need to extract that into an own file. Create a `twind.config.{ts,js,cjs,mjs}` in the root , `src`, `config`, or `public` folder. Then import it for use with setup. Here is example using a custom plugin:

```js
import { forms, formInput } from '@twind/forms'

/** @type {import('twind').Configuration} */
export default {
  plugins: { forms, 'form-input': formInput}
}

// Augment the twind module to add addtional completions
declare module 'twind' {
  interface Plugins {
    // forms should have been detected from setup – not need to add it
    // forms: ''

    // We want to add sm and lg modifiers to the form-input
    'form-input':
      | ''    // plain form-input
      | 'sm' // form-input-sm
      | 'lg' // form-input-lg
  }
}
```

> If no `twind.config.{ts,js,cjs,mjs}` exists and a `tailwind.config.{ts,js,cjs,mjs}` is found, the compatible values from the tailwind config will be used.

## Configuration

You can either configure the plugin using VS Code (Extensions - Twind) or configure this plugin using a `tsconfig` or `jsconfig` as described [here](https://github.com/tw-in-js/typescript-plugin/#with-vs-code). This requires VS Code 1.53+ and TS 4.1+. Note the VS Code based configuration override the `tsconfig` or `jsconfig` configuration.

This extension contributes the following settings:

- `twind.tags`: use different tagged template tags (default: `['tw', 'apply']`)
- `twind.attributes`: use different attributes (default: `['tw', 'class', 'className']`)
- `twind.styles`: use different style/styled functions (default: `['style', 'styled']`)
- `twind.debug`: enable/disable additional debug information (default: `false`)

By default VS Code will not trigger completions when editing "string" content, for example within JSX attribute values. Updating the `editor.quickSuggestions` setting may improve your experience, particularly when editing Twind classes within JSX:

```json
{
  "editor.suggest.showStatusBar": true,
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

## Release Notes

See [the changelog](https://github.com/tw-in-js/vscode-twind-intellisense/blob/main/CHANGELOG.md).

## For more information

- [Github](https://github.com/tw-in-js/twind)
- [Documentation](https://twind.dev)
- [Discussions](https://github.com/tw-in-js/twind/discussions)
- [Issues](https://github.com/tw-in-js/vscode-twind-intellisense/issues)

## License

[MIT](https://github.com/tw-in-js/vscode-twind-intellisense/blob/main/LICENSE)
