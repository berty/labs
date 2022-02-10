import readline from 'readline'
import fs from 'fs'
import path from 'path'

import { question } from './common'
import * as presets from './presets'

type PresetName = keyof typeof presets

const main = async () => {
	const labsRoot = path.relative('.', path.join(__dirname, '..', '..', '..'))
	const htmlModsRoot = path.join('.', 'html-mods')
	const goModsRoot = path.relative('.', path.join(labsRoot, 'go', 'mod'))

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: false,
	})

	const steps: (() => Promise<void>)[] = []

	// ask for module name, used a id
	let name = ''
	while (!name) {
		name = await question(rl, 'Name, used as id: ')
		if (!name) {
			console.warn('❌ Error: empty name')
			continue
		}
		const nameInvalidator = /[^a-z0-9-]/
		const invalidIndex = name.search(nameInvalidator)
		if (invalidIndex >= 0) {
			console.warn(`❌ Error: invalid character '${name[invalidIndex]}' in name`)
			name = ''
			continue
		}
		const hmRoot = path.join(htmlModsRoot, name)
		if (fs.existsSync(hmRoot)) {
			console.warn(`❌ Error: an HTML module with this name already exists at ${hmRoot}`)
			name = ''
			continue
		}
		const gmRoot = path.join(goModsRoot, name)
		if (fs.existsSync(gmRoot)) {
			console.warn(`❌ Error: a Go module with this name already exists at ${gmRoot}`)
			name = ''
			continue
		}
	}

	let mRoot = ''

	try {
		// ask for preset
		const defaultPreset: PresetName = 'bare'
		let preset: PresetName = defaultPreset
		while (true) {
			console.log('ℹ️  Available presets:', Object.keys(presets).join(', '))
			let presetInput = await question(rl, `Preset (${defaultPreset}): `)
			presetInput = presetInput.trim()
			if (!presetInput) {
				break
			}
			if (!Object.keys(presets).includes(presetInput)) {
				console.warn(`❌ Error: unknown preset '${presetInput}'`)
				continue
			}
			preset = presetInput as PresetName
			break
		}

		// run preset
		mRoot = await presets[preset as PresetName]({
			rl,
			labsRoot,
			htmlModsRoot,
			goModsRoot,
			name,
			steps,
		})
		console.log(`ℹ️  Creating ${preset} HTML module at: ${path.join(htmlModsRoot, name)}`)
		for (const step of steps) {
			await step()
		}

		// FIXME: clean on ctrl-c

		// success
		console.log('\n✅ Done!')
	} catch (err) {
		console.error(err)
		fs.rmSync(mRoot, { recursive: true, force: true })
	}

	// close terminal
	rl.close()
}

main()
