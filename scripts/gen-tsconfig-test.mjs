#!/usr/bin/env node
/**
 * Regenerate tsconfig.test.json from the sibling harness checkout's
 * tsconfig.base.json: same path mappings, rebased onto ../deepseek-harness,
 * with an include scope covering this repo's src/tests plus the harness's
 * packages/ and vendor/ trees. Run after the harness adds or renames packages.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const basePath = resolve(root, '../deepseek-harness/tsconfig.base.json')
const base = ts.parseConfigFileTextToJson(basePath, readFileSync(basePath, 'utf8')).config
const paths = Object.fromEntries(
  Object.entries(base.compilerOptions.paths).map(([key, values]) => [
    key,
    values.map((value) => `../deepseek-harness/${value.replace(/^\.\//, '')}`),
  ]),
)
const output = {
  '//': 'Generated from ../deepseek-harness/tsconfig.base.json by scripts/gen-tsconfig-test.mjs — do not edit by hand.',
  include: ['src/**/*', 'tests/**/*', '../deepseek-harness/packages/**/*', '../deepseek-harness/vendor/**/*'],
  compilerOptions: { baseUrl: '.', paths },
}
writeFileSync(resolve(root, 'tsconfig.test.json'), `${JSON.stringify(output, null, 2)}\n`)
console.log(`tsconfig.test.json: ${Object.keys(paths).length} mappings`)
