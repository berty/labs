import path from 'path'

import {
	askInfo,
	createInfoJSON,
	generateFromTemplate,
	logExecSync,
	PresetFunc,
	question,
	testModule,
} from '../../common'

const createReactApp = async ({
	modsRoot,
	name,
	reactTemplate,
}: {
	modsRoot: string
	name: string
	reactTemplate: string
}) => {
	const moduleRoot = path.join(modsRoot, name)
	logExecSync(
		`cd ${modsRoot} && npx create-react-app ${name}${
			reactTemplate && ` --template ${reactTemplate}`
		}`,
		{ stdio: 'inherit' },
	)
	generateFromTemplate(path.join(__dirname, 'react.mk'), path.join(moduleRoot, 'Makefile'), {
		name,
	})
}

export const react: PresetFunc = async ({ rl, htmlModsRoot: modsRoot, name, steps }) => {
	const modInfo = await askInfo(rl, name, { icon: '🔋' })
	const reactTemplate = (await question(rl, 'React template (none): ')).trim()

	steps.push(createReactApp.bind(undefined, { modsRoot, name, reactTemplate }))
	steps.push(createInfoJSON.bind(undefined, modsRoot, name, modInfo))

	steps.push(testModule.bind(undefined, modsRoot, name))

	return path.join(modsRoot, name)
}
