/**
 * The following is modified based on source found in
 * https://github.com/facebook/create-react-app
 *
 * MIT Licensed
 * Copyright (c) 2015-present, Facebook, Inc.
 * https://github.com/facebook/create-react-app/blob/master/LICENSE
 *
 */

import {join, resolve} from 'node:path'
import {exec} from 'node:child_process'
import type {ExecOptions} from 'node:child_process'
import open from 'open'
import spawn from 'cross-spawn'
import colors from 'picocolors'
import {fileURLToPath} from 'node:url'

export const VITE_PACKAGE_DIR = resolve(
    // import.meta.url is `dist/node/constants.js` after bundle
    fileURLToPath(import.meta.url),
    '../../..',
)
type Logger = typeof console
export interface ResolvedServerUrls {
    local: string[]
    network: string[]
}

export function printServerUrls(
    urls: ResolvedServerUrls,
    optionsHost: string | boolean | undefined,
    info: typeof console.log,
): void {
    const colorUrl = (url: string) =>
        colors.cyan(url.replace(/:(\d+)\//, (_, port) => `:${colors.bold(port)}/`))
    for (const url of urls.local) {
        info(`  ${colors.green('➜')}  ${colors.bold('Local')}:   ${colorUrl(url)}`)
    }
    for (const url of urls.network) {
        info(`  ${colors.green('➜')}  ${colors.bold('Network')}: ${colorUrl(url)}`)
    }
    if (urls.network.length === 0 && optionsHost === undefined) {
        info(
            colors.dim(`  ${colors.green('➜')}  ${colors.bold('Network')}: use `) +
            colors.bold('--host') +
            colors.dim(' to expose'),
        )
    }
}

/**
 * Reads the BROWSER environment variable and decides what to do with it.
 */
export function openBrowser(
    url: string,
    opt: string | true,
    logger: Logger,
): void {
    const env = process.env as { BROWSER: string, BROWSER_ARGS: string };
    // The browser executable to open.
    // See https://github.com/sindresorhus/open#app for documentation.
    const browser = typeof opt === 'string' ? opt : env.BROWSER || ''
    if (browser.toLowerCase().endsWith('.js')) {
        executeNodeScript(browser, url, logger)
    } else if (browser.toLowerCase() !== 'none') {
        const browserArgs = env.BROWSER_ARGS
            ? env.BROWSER_ARGS.split(' ')
            : []
        startBrowserProcess(browser, browserArgs, url)
    }
}

function executeNodeScript(scriptPath: string, url: string, logger: Logger) {
    const extraArgs = process.argv.slice(2)
    const child = spawn(process.execPath, [scriptPath, ...extraArgs, url], {
        stdio: 'inherit',
    })
    child.on('close', (code) => {
        if (code !== 0) {
            logger.error(
                colors.red(
                    `\nThe script specified as BROWSER environment variable failed.\n\n${colors.cyan(
                        scriptPath,
                    )} exited with code ${code}.`,
                ),
                {error: null},
            )
        }
    })
}

const supportedChromiumBrowsers = [
    'Google Chrome Canary',
    'Google Chrome Dev',
    'Google Chrome Beta',
    'Google Chrome',
    'Microsoft Edge',
    'Brave Browser',
    'Vivaldi',
    'Chromium',
]

async function startBrowserProcess(
    browser: string | undefined,
    browserArgs: string[],
    url: string,
) {
    // If we're on OS X, the user hasn't specifically
    // requested a different browser, we can try opening
    // a Chromium browser with AppleScript. This lets us reuse an
    // existing tab when possible instead of creating a new one.
    const preferredOSXBrowser =
        browser === 'google chrome' ? 'Google Chrome' : browser
    const shouldTryOpenChromeWithAppleScript =
        process.platform === 'darwin' &&
        (!preferredOSXBrowser ||
            supportedChromiumBrowsers.includes(preferredOSXBrowser))

    if (shouldTryOpenChromeWithAppleScript) {
        try {
            const ps = await execAsync('ps cax')
            const openedBrowser =
                preferredOSXBrowser && ps.includes(preferredOSXBrowser)
                    ? preferredOSXBrowser
                    : supportedChromiumBrowsers.find((b) => ps.includes(b))
            if (openedBrowser) {
                // Try our best to reuse existing tab with AppleScript
                await execAsync(
                    `osascript openChrome.applescript "${encodeURI(
                        url,
                    )}" "${openedBrowser}"`,
                    {
                        cwd: join(VITE_PACKAGE_DIR, 'bin'),
                    },
                )
                return true
            }
        } catch (err) {
            // Ignore errors
        }
    }

    // Another special case: on OS X, check if BROWSER has been set to "open".
    // In this case, instead of passing the string `open` to `open` function (which won't work),
    // just ignore it (thus ensuring the intended behavior, i.e. opening the system browser):
    // https://github.com/facebook/create-react-app/pull/1690#issuecomment-283518768
    if (process.platform === 'darwin' && browser === 'open') {
        browser = undefined
    }

    // Fallback to open
    // (It will always open new tab)
    try {
        const options: open.Options = browser
            ? {app: {name: browser, arguments: browserArgs}}
            : {}
        open(url, options).catch(() => {
        }) // Prevent `unhandledRejection` error.
        return true
    } catch (err) {
        return false
    }
}

function execAsync(command: string, options?: ExecOptions): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout) => {
            if (error) {
                reject(error)
            } else {
                resolve(stdout.toString())
            }
        })
    })
}
