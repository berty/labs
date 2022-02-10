import fs from 'fs'
import path from 'path'

import { blmod } from '../../../api'
import { utf8 } from '../../../encoding'

import { askInfo, generateFromTemplate, generateGoModulesList, PresetFunc } from '../../common'

const createGoModule = async ({
	labsRoot,
	modsRoot,
	name,
	info,
}: {
	labsRoot: string
	modsRoot: string
	name: string
	info: blmod.ModuleInfo
}) => {
	const goName = name.replace('-', '_')

	const moduleRoot = path.join(modsRoot, goName)
	fs.mkdirSync(moduleRoot, { recursive: true })

	generateFromTemplate(path.join(__dirname, 'mod.go.tmpl'), path.join(moduleRoot, `${name}.go`), {
		goName,
		name,
		displayName: info.getDisplayName(),
		shortDescription: info.getShortDescription(),
		iconUTF: utf8.decode(info.getIconData_asU8()),
	})

	generateGoModulesList(labsRoot, modsRoot)
}

export const go: PresetFunc = async ({ rl, labsRoot, goModsRoot: modsRoot, name, steps }) => {
	const info = await askInfo(rl, name, { icon: '🐹' })
	if (info.getIconKind() !== blmod.ModuleInfo.IconKind.ICON_KIND_UTF) {
		throw new Error('only utf icons are supported')
	}

	steps.push(createGoModule.bind(undefined, { labsRoot, modsRoot, name, info }))

	return path.join(modsRoot, name)
}
