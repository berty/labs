import path from 'path'
import fs from 'fs'

import {
	askInfo,
	createInfoJSON,
	generateFromTemplate,
	logExecSync,
	PresetFunc,
	testModule,
} from '../../common'

const createBare = async (modsRoot: string, name: string) => {
	const moduleRoot = path.join(modsRoot, name)

	fs.mkdirSync(moduleRoot, { recursive: true })

	// Copy template
	logExecSync(`cp -r ${path.join(__dirname, 'public')} ${path.join(moduleRoot, 'public')}`, {
		stdio: 'inherit',
	})

	// Generate Makefile
	generateFromTemplate(path.join(__dirname, 'bare.mk'), path.join(moduleRoot, 'Makefile'), {
		name,
	})
}

export const bare: PresetFunc = async ({ rl, htmlModsRoot: modsRoot, name, steps }) => {
	const modInfo = await askInfo(rl, name, { icon: '🏜️' })

	steps.push(createBare.bind(undefined, modsRoot, name))
	steps.push(createInfoJSON.bind(undefined, modsRoot, name, modInfo))

	steps.push(testModule.bind(undefined, modsRoot, name))

	return path.join(modsRoot, name)
}
