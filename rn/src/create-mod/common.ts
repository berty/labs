import path from 'path'
import child_process from 'child_process'
import readline from 'readline'
import fs from 'fs'

import { blmod } from '../api'
import { capitalize } from '../reactutil'
import { utf8 } from '../encoding'

export type PresetFunc = (props: {
	rl: readline.Interface
	name: string
	steps: (() => Promise<void>)[]

	labsRoot: string
	htmlModsRoot: string
	goModsRoot: string
}) => Promise<string>

export const testModule = async (modsRoot: string, name: string) => {
	console.log('🧪 Testing module...')
	const moduleRoot = path.join(modsRoot, name)
	// FIXME: use MAKE from env if specified
	logExecSync(`cd ${moduleRoot} && make`, { stdio: 'inherit' })
}

const regExpEscape = (str: string) => {
	// eslint-disable-next-line no-useless-escape
	return String(str).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
}

export const generateFromTemplate = (templatePath: string, outPath: string, params: any) => {
	console.log(
		`⚙️  Generating file from template ${path.relative('.', templatePath)} -> ${path.relative(
			'.',
			outPath,
		)} with:\n${JSON.stringify(params, null, 4)}`,
	)
	const template = fs.readFileSync(templatePath).toString('utf-8')
	let content = template
	for (const [key, value] of Object.entries(params)) {
		content = content.replace(new RegExp(`<${regExpEscape(key)}>`, 'g'), `${value}`)
	}
	fs.writeFileSync(outPath, content)
}

export const question = (rl: readline.Interface, q: string) =>
	new Promise<string>(resolve => {
		rl.question(`❓ ${q}`, resolve)
	})

export const askInfo = async (
	rl: readline.Interface,
	name: string,
	defaults?: { icon?: string },
) => {
	const info = new blmod.ModuleInfo()

	const defaultDisplayName = capitalize(name).replace('-', ' ').trim()
	let displayName = await question(rl, `Display name (${defaultDisplayName}): `)
	if (!displayName) {
		displayName = defaultDisplayName
	}
	info.setDisplayName(displayName)

	const defaultDescription = defaultDisplayName
	let shortDescription = await question(rl, `Description (${defaultDescription}): `)
	if (!shortDescription) {
		shortDescription = defaultDescription
	}
	info.setShortDescription(shortDescription)

	// TODO: support more icon kinds
	const iconKind = blmod.ModuleInfo.IconKind.ICON_KIND_UTF
	const defaultIcon = defaults?.icon || defaultDisplayName[0]
	let iconUTF = await question(rl, `UTF icon (${defaultIcon}): `)
	iconUTF = iconUTF.trim()
	console.log('got icon', iconUTF)
	if (!iconUTF) {
		iconUTF = defaultIcon
	}
	const iconData = utf8.encode(iconUTF)
	info.setIconKind(iconKind)
	info.setIconData(iconData)

	return info
}

export const createInfoJSON = async (modsRoot: string, name: string, info: blmod.ModuleInfo) => {
	const moduleRoot = path.join(modsRoot, name)
	const cleanInfo = info.toObject()
	delete (cleanInfo as any).name
	const infoJSON = JSON.stringify(cleanInfo, null, 4)
	fs.mkdirSync(moduleRoot, { recursive: true })
	logWriteFileSync(`${moduleRoot}/info.json`, infoJSON)
}

export const logWriteFileSync: typeof fs.writeFileSync = (...args) => {
	const [file, content] = args
	console.log(
		`⚙️  Creating ${file} with${typeof content === 'string' ? `:\n${content}` : ' binary data'}`,
	)
	return fs.writeFileSync(...args)
}

export const logExecSync = (command: string, options?: child_process.ExecSyncOptions) => {
	console.log(`⚙️  Running: ${command}`)
	return child_process.execSync(command, options)
}

export const generateGoModulesList = (labsRoot: string, modsRoot: string) => {
	const mods = fs.readdirSync(modsRoot).sort((a, b) => a.localeCompare(b))
	return generateFromTemplate(
		path.relative('.', path.join(__dirname, 'presets', 'go', 'modules.go.tmpl')),
		path.join(labsRoot, 'go', 'bind', 'labs', 'modules.go'),
		{
			imports: mods.map(m => `"berty.tech/labs/go/mod/${m}"`).join('\n	'),
			modules: mods.map(m => `${m}.New,`).join('\n	'),
		},
	)
}
