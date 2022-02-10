import path from 'path'
import readline from 'readline'
import fs from 'fs'

import {
	askInfo,
	createInfoJSON,
	generateFromTemplate,
	logExecSync,
	logWriteFileSync,
	PresetFunc,
	question,
	testModule,
} from '../../common'

type GitInfo = {
	remote: string
	head: string
	distDir: string
	buildCommand: string
	devCommand: string
}

const askGitInfo = async (rl: readline.Interface) => {
	let remote = ''
	while (!remote) {
		remote = await question(rl, 'Remote: ')
		if (!remote) {
			console.warn('❌ Error: empty remote')
			continue
		}
	}

	const head = await question(
		rl,
		'Branch, tag or commit (leave empty to checkout the default branch): ',
	)

	// FIXME: switch to npm ci
	const defaultBuildCommand = 'npm install && npm run build'
	const buildCommand = await question(rl, `Build command (${defaultBuildCommand}): `)

	const defaultDistDir = 'dist'
	const distDir = await question(rl, `Distribution directory (${defaultDistDir}): `)

	const devCommand = await question(rl, 'Dev command (leave empty if none): ')

	const gitInfo: GitInfo = {
		remote: remote.trim(),
		head: head.trim(),
		distDir: distDir || defaultDistDir,
		buildCommand: buildCommand || defaultBuildCommand,
		devCommand: devCommand || 'echo Dev mode disabled && false',
	}

	return gitInfo
}

const createGitModule = async (modsRoot: string, name: string, gitInfo: GitInfo) => {
	const repoDir = 'repo'
	const moduleRoot = path.join(modsRoot, name)

	// Create module directory
	fs.mkdirSync(moduleRoot, { recursive: true })

	// Generate Makefile
	generateFromTemplate(path.join(__dirname, 'git.mk'), path.join(moduleRoot, 'Makefile'), {
		...gitInfo,
		repoDir,
		name,
	})

	// Generate commit file
	let commit
	if (/^[a-f0-9]{40}$/.test(gitInfo.head)) {
		commit = gitInfo.head
	} else {
		const lsRemoteOutput = logExecSync(
			`git ls-remote ${gitInfo.remote} ${gitInfo.head || 'HEAD'}`,
		).toString('utf-8')
		const matches = lsRemoteOutput.trim().match(/[a-f0-9]+/)
		if (!matches?.length) {
			throw new Error('commit hash not found in ls-remote output: ' + lsRemoteOutput)
		}
		commit = matches[0]
	}
	logWriteFileSync(path.join(moduleRoot, 'commit'), commit)

	// Generate remote file
	logWriteFileSync(path.join(moduleRoot, 'remote'), gitInfo.remote)

	// Generate .gitignore file
	logWriteFileSync(path.join(moduleRoot, '.gitignore'), `/${repoDir}`)
}

export const git: PresetFunc = async ({ rl, htmlModsRoot: modsRoot, name, steps }) => {
	const modInfo = await askInfo(rl, name, { icon: '🌳' })
	const gitInfo = await askGitInfo(rl)

	steps.push(createGitModule.bind(undefined, modsRoot, name, gitInfo))
	steps.push(createInfoJSON.bind(undefined, modsRoot, name, modInfo))

	steps.push(testModule.bind(undefined, modsRoot, name))

	return path.join(modsRoot, name)
}
