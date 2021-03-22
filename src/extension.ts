// Based on https://github.com/mjbvz/vscode-lit-html/blob/master/src/index.ts
import * as vscode from 'vscode'

import {name, version as extensionVersion, publisher} from '../package.json'

const typeScriptExtensionId = 'vscode.typescript-language-features'
const pluginId = '@twind/typescript-plugin'
const configurationSection = 'twind'

const extensionName = `${publisher}.${name}`

interface SynchronizedConfiguration {
  tags: ReadonlyArray<string>
  attributes: ReadonlyArray<string>
  styles: ReadonlyArray<string>
  debug: boolean
  enable: boolean
  // Readonly validate: boolean;
  // readonly lint: { [key: string]: any };
  // readonly emmet: { [key: string]: any };
}

type Logger = (message: string) => void

interface State {
  hasTwind?: boolean
}

export async function activate(context: vscode.ExtensionContext) {
  const log = createLogger(vscode.window.createOutputChannel('Twind IntelliSense'))
  log(`Extension Name: ${extensionName}.`)
  log(`Extension Version: ${extensionVersion}.`)

  await enableExtension(context, log).catch((error) => {
    log(`Activating ${pluginId} failed: ${error.stack}`)
  })
}

async function enableExtension(context: vscode.ExtensionContext, log: Logger) {
  const state: State = { hasTwind: undefined }

  const update = async () => {
    const localTwindManifestFiles = await vscode.workspace.findFiles(
      '**/node_modules/twind/package.json',
      null,
      1,
    )

    const twindConfigFiles = localTwindManifestFiles.length
      ? []
      : await vscode.workspace.findFiles('**/twind.config.{ts,js,mjs,cjs}', '**/node_modules/**', 1)

    let hasTwind = false
    if (localTwindManifestFiles.length) {
      log(`Using local twind`)
      hasTwind = true
    } else if (twindConfigFiles.length) {
      log(`Using builtin twind`)
      hasTwind = true
    } else {
      log(`No twind package and no twind config file found. Not activating Twind IntelliSense.`)
      hasTwind = false
    }

    if (hasTwind !== state.hasTwind) {
      state.hasTwind = hasTwind
      synchronizeConfiguration(api, state, log)
    }
  }

  const api = await activateTypescriptPlugin(log)

  const listener = () => {
    update().catch((error) => {
      log(error.stacktrace)
    })
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('twind.restart', () => {
      state.hasTwind = undefined
      listener()
    }),
  )

  const twindWatcher = vscode.workspace.createFileSystemWatcher(
    '**/node_modules/twind/package.json',
  )

  context.subscriptions.push(twindWatcher)
  context.subscriptions.push(twindWatcher.onDidCreate(listener))
  context.subscriptions.push(twindWatcher.onDidChange(listener))
  context.subscriptions.push(twindWatcher.onDidDelete(listener))

  const configWatcher = vscode.workspace.createFileSystemWatcher('**/twind.config.{ts,js,mjs,cjs}')

  context.subscriptions.push(configWatcher)
  context.subscriptions.push(configWatcher.onDidCreate(listener))
  context.subscriptions.push(configWatcher.onDidDelete(listener))

  const packageWatcher = vscode.workspace.createFileSystemWatcher(
    '**/{package,package-lock.json,yarn.lock,pnpm-lock.yaml}',
  )

  context.subscriptions.push(packageWatcher)
  context.subscriptions.push(packageWatcher.onDidCreate(listener))
  context.subscriptions.push(packageWatcher.onDidCreate(listener))
  context.subscriptions.push(packageWatcher.onDidDelete(listener))

  await update()
}

async function activateTypescriptPlugin(log: Logger) {
  const extension = vscode.extensions.getExtension(typeScriptExtensionId)
  if (!extension) {
    log(`Extension ${typeScriptExtensionId} not found. No IntelliSense will be provided.`)
    return
  }

  await extension.activate()

  const api = extension.exports?.getAPI?.(0)

  if (!api) {
    log(
      `Extension ${typeScriptExtensionId} did not export an API. No IntelliSense will be provided.`,
    )
    return
  }

  return api
}

function createLogger(outputChannel: vscode.OutputChannel): Logger {
  return (message) => {
    const title = new Date().toLocaleTimeString()
    outputChannel.appendLine(`[${title}] ${message}`)
  }
}

function synchronizeConfiguration(api: any, state: State, log: Logger) {
  const config = getConfiguration()

  if (config.enable) {
    log('Extension is enabled. To disable, change the `twind.enable` setting to `false`.')

    if (state.hasTwind) {
      log(`Configuring ${pluginId} using: ${JSON.stringify(config, null, 2)}`)
    } else {
      config.enable = false
    }
  } else {
    log(
      'Extension is disabled. No IntelliSense will be provided. To enable, change the `twind.enable` setting to `true`.',
    )
  }

  api.configurePlugin(pluginId, config)
}

function getConfiguration(): SynchronizedConfiguration {
  const config = vscode.workspace.getConfiguration(configurationSection)
  const outConfig: SynchronizedConfiguration = {
    tags: ['tw', 'apply'],
    attributes: ['tw', 'class', 'className'],
    styles: ['style', 'styled'],
    debug: false,
    enable: true,
  }

  withConfigValue<string[]>(config, 'tags', (tags) => {
    outConfig.tags = tags
  })

  withConfigValue<string[]>(config, 'attributes', (attributes) => {
    outConfig.attributes = attributes
  })

  withConfigValue<string[]>(config, 'styles', (styles) => {
    outConfig.styles = styles
  })

  withConfigValue<boolean>(config, 'debug', (debug) => {
    outConfig.debug = debug
  })

  withConfigValue<boolean>(config, 'enable', (enable) => {
    outConfig.enable = enable
  })

  return outConfig
}

function withConfigValue<T>(
  config: vscode.WorkspaceConfiguration,
  key: string,
  withValue: (value: T) => void,
): void {
  const configSetting = config.inspect(key)
  if (!configSetting) {
    return
  }

  // Make sure the user has actually set the value.
  // VS Code will return the default values instead of `undefined`, even if user has not don't set anything.
  if (
    typeof configSetting.globalValue === 'undefined' &&
    typeof configSetting.workspaceFolderValue === 'undefined' &&
    typeof configSetting.workspaceValue === 'undefined'
  ) {
    return
  }

  const value = config.get<T | undefined>(key, undefined)
  if (typeof value !== 'undefined') {
    withValue(value)
  }
}
