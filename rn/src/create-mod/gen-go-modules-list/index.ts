import path from 'path'
import { generateGoModulesList } from '../common'

const labsRoot = path.relative('.', path.join(__dirname, '..', '..', '..', '..'))
const goModsRoot = path.relative('.', path.join(labsRoot, 'go', 'mod'))
generateGoModulesList(labsRoot, goModsRoot)
