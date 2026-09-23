/**
 * Standalone client-bundle preset for this plugin. Mirrors the harness's
 * dynamic-bundle contract: the artifact calls
 * `window.__ModuleLoader__.load({id, factory})` and resolves externals
 * through the injected require (shell module table). CSS Modules compile
 * through lightningcss into a hashed class map plus one tagged style
 * injection. Baseline externals are the shell-seeded shared modules only.
 */
import { readFileSync } from 'node:fs'
import { basename, dirname, isAbsolute, resolve as resolvePath } from 'node:path'
import { defineConfig, type Plugin } from 'tsdown'
import { transform } from 'lightningcss'

/** The module-table identity this bundle registers under. */
const ID = '@deepseek-ai/dsh-client-ui-session-pin'

/** Shell-seeded shared modules (the harness client baseline). */
const EXTERNAL = [
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-store', '@deepseek-ai/dsh-client-ui-slots', '@deepseek-ai/dsh-client-ui-primitives',
]

/** Virtual-id wrapper keeping module CSS out of tsdown's own css pipeline. */
const CSS_PREFIX = '\0dsh-css:'
const CSS_SUFFIX = '.mjs'

/** Emit one plugin-owned style injector and the CSS Modules class map. */
function styleModule(fileId: string, css: string, classMap: Readonly<Record<string, string>>): string {
  return [
    `const css = ${JSON.stringify(css)};`,
    `const tagId = ${JSON.stringify(`${ID}/${basename(fileId)}`)};`,
    'if (typeof document !== \'undefined\' && document.querySelector(\'style[data-plugin-css=\' + JSON.stringify(tagId) + \']\') === null) {',
    '  const tag = document.createElement(\'style\');',
    `  tag.dataset.plugin = ${JSON.stringify(ID)};`,
    '  tag.dataset.pluginCss = tagId;',
    '  tag.textContent = css;',
    '  document.head.appendChild(tag);',
    '}',
    `export default ${JSON.stringify(classMap)};`,
  ].join('\n')
}

/** Compile `*.module.css` into an inline-injection module with a class-map default export. */
function cssModules(): Plugin {
  return {
    name: 'dsh-css-modules',
    transform: {
      filter: { id: /\.module\.css(?:\.mjs)?$/ },
      handler(code, id) {
        const result = transform({
          filename: id,
          code: Buffer.from(code),
          cssModules: true,
          minify: true,
        })
        const classMap = (result.exports ?? {}) as Record<string, { name: string }>
        const map = Object.fromEntries(Object.entries(classMap).map(([key, value]) => [key, value.name]))
        const fileId = id.startsWith(CSS_PREFIX) ? id.slice(CSS_PREFIX.length, -CSS_SUFFIX.length) : id
        return {
          code: styleModule(fileId, result.code.toString(), map),
          map: { mappings: '' },
        }
      },
    },
    resolveId: {
      filter: { id: /\.module\.css$/ },
      handler(id, importer) {
        if (id.startsWith(CSS_PREFIX)) return id
        const file = isAbsolute(id) || importer === undefined
          ? id
          : resolvePath(dirname(importer), id)
        return `${CSS_PREFIX}${file}${CSS_SUFFIX}`
      },
    },
    load: {
      filter: { id: new RegExp(`^${CSS_PREFIX}`) },
      handler(id) {
        const file = id.slice(CSS_PREFIX.length, -CSS_SUFFIX.length)
        return readFileSync(file, 'utf8')
      },
    },
  }
}

/** Node half: ESM no-op bundled straight from source (no imports to resolve). */
const nodeConfig = defineConfig({
  entry: { index: 'src/index.ts' },
  format: 'esm',
  platform: 'neutral',
  target: 'es2024',
  outDir: 'lib',
  dts: false,
  outputOptions: { entryFileNames: '[name].js' },
})

/** Browser half: the ModuleLoader closure-factory bundle. */
const clientConfig = defineConfig({
  entry: { client: 'src/client/index.ts' },
  format: 'cjs',
  platform: 'browser',
  target: 'es2024',
  outDir: 'lib',
  dts: false,
  sourcemap: true,
  external: EXTERNAL,
  plugins: [cssModules()],
  outputOptions: {
    entryFileNames: '[name].js',
    banner: (chunk) => chunk.name === 'client'
      ? `window.__ModuleLoader__.load({\n\tid: ${JSON.stringify(ID)},\n\tfactory: (require) => {`
      : '',
    footer: (chunk) => chunk.name === 'client' ? '}\n});' : '',
  },
})

export default [nodeConfig, clientConfig]
