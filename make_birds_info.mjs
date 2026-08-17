import fs from 'node:fs'
import { BIRDS } from './src/data/birds/index.js'

fs.writeFileSync(
  '../birds-info.json',
  JSON.stringify(BIRDS.map(({ id, name, sci, en, alias }) => ({ id, name, sci, en, alias })), null, 2),
  'utf8',
)
