/**
 * Standalone component-spec rig. Resolves `@deepseek-ai/*` imports through the
 * sibling harness checkout's `src` (mirroring the harness's own
 * vite-tsconfig-paths facade), so suites never evaluate a ModuleLoader-wrapped
 * `lib/client.js` bundle — jsdom has no browser bootstrap to serve it.
 *
 * vite-tsconfig-paths only applies path mappings to files inside the tsconfig's
 * own include scope, which cannot cover the sibling checkout; this plugin
 * applies the same mappings to every importer. The mapping table is
 * `tsconfig.test.json`, generated from the harness's `tsconfig.base.json`.
 */
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vitest/config'

interface PathRule {
  regex: RegExp
  replacements: string[]
}

function pathRules(paths: Record<string, string[]>, root: string): PathRule[] {
  return Object.entries(paths).map(([find, replacements]) => ({
    regex: new RegExp(`^${find.split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('(.*)')}$`),
    replacements: replacements.map((rep) => resolve(root, rep)),
  }))
}

function dshWorkspacePaths(): Plugin {
  const root = import.meta.dirname
  let rules: PathRule[] | null = null
  return {
    name: 'dsh-workspace-paths',
    enforce: 'pre',
    async resolveId(source, importer) {
      if (!importer?.includes('/deepseek-harness/') && !importer?.includes('dsh-client-ui-session-pin')) return null
      if (!source.startsWith('@deepseek-ai/')) return null
      rules ??= pathRules(
        (JSON.parse(await readFile(resolve(root, 'tsconfig.test.json'), 'utf8')) as {
          compilerOptions: { paths: Record<string, string[]> }
        }).compilerOptions.paths,
        root,
      )
      for (const { regex, replacements } of rules) {
        const match = regex.exec(source)
        if (match === null) continue
        for (const replacement of replacements) {
          const target = replacement.replaceAll('*', match[1] ?? '')
          const candidates = /\.[cm]?[jt]sx?$/.test(target)
            ? [target]
            : [`${target}.ts`, `${target}.tsx`, `${target}.js`, resolve(target, 'index.ts'), resolve(target, 'index.tsx')]
          for (const candidate of candidates) {
            if (existsSync(candidate)) return candidate
          }
        }
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [dshWorkspacePaths()],
})
