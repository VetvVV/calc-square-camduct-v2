import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const version = packageJson.version && packageJson.version !== '0.0.0' ? packageJson.version : '2.0.0'
const label = 'MVP'
const now = new Date()

const buildDateTime = new Intl.DateTimeFormat('uk-UA', {
  timeZone: 'Europe/Kyiv',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}).format(now).replace(',', '')

let commitHash = 'local'
try {
  commitHash = execSync('git rev-parse --short HEAD', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
} catch {
  commitHash = 'local'
}

const source = `export const BUILD_INFO = {\n  version: ${JSON.stringify(version)},\n  label: ${JSON.stringify(label)},\n  buildDateTime: ${JSON.stringify(buildDateTime)},\n  commitHash: ${JSON.stringify(commitHash)},\n}\n`

writeFileSync(resolve(root, 'src', 'build-info.ts'), source, 'utf8')


