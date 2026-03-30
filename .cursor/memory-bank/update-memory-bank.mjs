#!/usr/bin/env node
/**
 * Memory bank — frontend Woodkraft (Vue / Vite).
 * Usage : depuis wood-kraft/ — node .cursor/memory-bank/update-memory-bank.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const OUT = path.join(__dirname, 'PROJECT.md')

const MANUAL_START = '<!-- MEMORY_BANK_MANUAL_START -->'
const MANUAL_END = '<!-- MEMORY_BANK_MANUAL_END -->'

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch {
    return null
  }
}

function countByExt(dir, ext, acc = { n: 0 }) {
  if (!fs.existsSync(dir)) return acc.n
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'vendor' || e.name === 'dist') continue
      countByExt(full, ext, acc)
    } else if (e.isFile() && e.name.endsWith(ext)) acc.n++
  }
  return acc.n
}

function listRouteNames(routerPath) {
  if (!fs.existsSync(routerPath)) return []
  const src = fs.readFileSync(routerPath, 'utf8')
  const names = []
  const re = /name:\s*['"]([^'"]+)['"]/g
  let m
  while ((m = re.exec(src)) !== null) names.push(m[1])
  return [...new Set(names)].sort()
}

function buildDoc() {
  const pkg = readJson(path.join(ROOT, 'package.json'))
  const vueCount = countByExt(path.join(ROOT, 'src'), '.vue')
  const jsCount = countByExt(path.join(ROOT, 'src'), '.js')
  const scssCount = countByExt(path.join(ROOT, 'src'), '.scss')
  const routeNames = listRouteNames(path.join(ROOT, 'src/router/index.js'))

  const deps = pkg?.dependencies ?? {}
  const dev = pkg?.devDependencies ?? {}
  const keys = ['vue', 'vue-router', 'pinia', 'vite'].filter((k) => deps[k] || dev[k])
  const stackLines = keys.map((k) => `- ${k} ${deps[k] ?? dev[k]}`)

  const generatedAt = new Date().toISOString()

  const lines = [
    '# Memory bank — Woodkraft (frontend)',
    '',
    '> Section auto entre `MEMORY_BANK_AUTO_START` et `MEMORY_BANK_AUTO_END`. Zone manuelle préservée.',
    '',
    MANUAL_START,
    '',
    '_Décisions UI, tokens, parcours utilisateur, URLs de preview, etc._',
    '',
    MANUAL_END,
    '',
    '<!-- MEMORY_BANK_AUTO_START -->',
    '## Métadonnées',
    '',
    `- **Dernière génération** : ${generatedAt}`,
    `- **Racine app** : \`${ROOT}\` (\`wood-kraft\`)`,
    '',
    '## Stack (extraits package.json)',
    '',
    stackLines.length ? stackLines.join('\n') : '- _(aucune clé listée)_',
    '',
    '## API client',
    '',
    '- Fichier : `src/services/api.js`',
    '- `VITE_API_BASE_URL` → défaut `http://localhost:8000/api/v1`',
    '- `VITE_APP_URL` → défaut `http://localhost:8000`',
    '',
    '## Inventaire `src/`',
    '',
    `- Fichiers \`.vue\` : **${vueCount}**`,
    `- Fichiers \`.js\` : **${jsCount}**`,
    `- Fichiers \`.scss\` : **${scssCount}**`,
    '',
    '## Routes nommées (Vue Router)',
    '',
    routeNames.length
      ? routeNames.map((n) => `- \`${n}\``).join('\n')
      : '- _(aucune route détectée)_',
    '',
    '<!-- MEMORY_BANK_AUTO_END -->',
    '',
  ]

  return lines.join('\n')
}

function mergeManual(existing, autoDoc) {
  const hasManual =
    existing.includes(MANUAL_START) && existing.includes(MANUAL_END)
  if (!hasManual) return autoDoc

  const manualBlock = existing.slice(
    existing.indexOf(MANUAL_START),
    existing.indexOf(MANUAL_END) + MANUAL_END.length
  )
  return autoDoc.replace(
    new RegExp(
      `${escapeRegex(MANUAL_START)}[\\s\\S]*?${escapeRegex(MANUAL_END)}`,
      'm'
    ),
    manualBlock
  )
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const auto = buildDoc()
let finalDoc = auto
if (fs.existsSync(OUT)) {
  finalDoc = mergeManual(fs.readFileSync(OUT, 'utf8'), auto)
}
fs.writeFileSync(OUT, finalDoc, 'utf8')
console.log(`Memory bank (frontend) mise à jour : ${OUT}`)
