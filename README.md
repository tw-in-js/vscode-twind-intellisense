<div align="center">

# Twind Intellisense for VS Code

Intelligent [Twind](https://twind.dev) tooling for VS Code

[![MIT License](https://flat.badgen.net/github/license/tw-in-js/vscode-twind-intellisense)](https://github.com/tw-in-js/vscode-twind-intellisense/blob/main/LICENSE)
[![Latest Release](https://vsmarketplacebadge.apphb.com/version/sastan.twind-intellisense.svg)](https://marketplace.visualstudio.com/items?itemName=sastan.twind-intellisense)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Fvscode-twind-intellisense?icon=github&label)](https://github.com/tw-in-js/vscode-twind-intellisense)

![Demo](https://raw.githubusercontent.com/tw-in-js/vscode-twind-intellisense/main/assets/demo.gif)

</div>

---

## Installation

**[Install via the Visual Studio Code Marketplace →](https://marketplace.visualstudio.com/items?itemName=sastan.twind-intellisense)**

## Features

- IntelliSense for [twind](https://github.com/tw-in-js/twind) variants and classes within
  - `tw` and `apply`
  - JSX attributes (`tw`, `class`, and `className`)
  - [style](https://twind.dev/docs/modules/twind_style.html) and `styled` (like [@twind/react](https://github.com/tw-in-js/twind-react/#readme) or [@twind/solid](https://github.com/tw-in-js/use-twind-with/tree/main/packages/solid#readme))
- Quick Info about
  - generated CSS
  - used theme value
  - the `px` value for `rem` values
- Color preview
- Support for grouping of variants and classes
- Warnings on
  - unknown classes
  - unknown theme values
  - unknown variants

## Usage

The twind extension adds highlighting and IntelliSense for Twind classes in JavaScript and TypeScript. It works out of the box when you use VS Code's built-in version of TypeScript.

By default VS Code will not trigger completions when editing "string" content, for example within JSX attribute values. Updating the `editor.quickSuggestions` setting may improve your experience, particularly when editing Twind classes within JSX:

```json
{
  "editor.suggest.showStatusBar": true,
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

### Custom Twind Configuration

If you have a custom twind configuration you need to extract that into an own file. Create a `twind.config.{ts,js,cjs,mjs}` in the root, `src`, `config`, or `public` folder. Then import it for use with `setup`. Here is example using a custom plugin:

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

## Settings

You can either configure the plugin using VS Code (Extensions - Twind) or configure this plugin using a `tsconfig` or `jsconfig` as described [here](https://github.com/tw-in-js/typescript-plugin/#configuration). This requires VS Code 1.53+ and TS 4.1+. Note the VS Code based configuration override the `tsconfig` or `jsconfig` configuration.

This extension contributes the following settings:

- `twind.tags`: use different tagged template tags (default: `['tw', 'apply']`)
- `twind.attributes`: use different attributes (default: `['tw', 'class', 'className']`)
- `twind.styles`: use different style/styled functions (default: `['style', 'styled']`)
- `twind.debug`: enable/disable additional debug information (default: `false`)

### Tags

This extension adds IntelliSense to any template literal [tagged](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) with `tw` or `apply`:

```js
import { tw } from 'twind'

tw`
  sm:hover:(
    bg-black
    text-white
  )
  md:(bg-white hover:text-black)
`
```

You can enable IntelliSense for other tag names by configuring `twind.tags`.

### Attributes

This extension adds IntelliSense to JSX `tw`, `class`, and `className` attributes:

```js
<span
  className="text-purple-400"
  tw={`
    sm:hover:(
      bg-black
      text-white
    )
    md:(bg-white hover:text-black)
  `}
>...</span>
`
```

You can enable IntelliSense for other attributes by configuring `twind.attributes`

### Styles

This extensions adds IntelliSense to [style](https://twind.dev/docs/modules/twind_style.html) and `styled` (like [@twind/react](https://github.com/tw-in-js/twind-react/#readme) or [@twind/solid](https://github.com/tw-in-js/use-twind-with/tree/main/packages/solid#readme))

```js
// Same for style({... })
const Button = styled("button", {
  base: `
    appearance-none border-none bg-transparent
    rounded-full px-2.5
  `,

  variants: {
    variant: {
      gray: `
        bg-gray-500
        hover:bg-gray-600
      `,
      primary: `
        text-white bg-purple-500
        hover:bg-purple-600
      `,
    },

    outlined: {
      true: `bg-transparent ring-1`,
    },
  },

  matches: [
    {
      variant: "gray",
      outlined: true,
      use: `ring-gray-500`,
    },
  }
})
```

You can enable IntelliSense for other `style` like functions by configuring `twind.styles`.

### Debug

Allows to enabling/disabling additional debug information shown in hover and completion popups (default: `false`) by configuring `twind.debug`.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

## Release Notes

See [the changelog](https://github.com/tw-in-js/vscode-twind-intellisense/blob/main/CHANGELOG.md).

## For more information

- [Twind @ Github](https://github.com/tw-in-js/twind)
- [Documentation](https://twind.dev)
- [Discussions](https://github.com/tw-in-js/twind/discussions)
- [Issues](https://github.com/tw-in-js/vscode-twind-intellisense/issues)

## License

[MIT](https://github.com/tw-in-js/vscode-twind-intellisense/blob/main/LICENSE)
