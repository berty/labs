/**
 * @format
 */

import 'text-encoding'
import { AppRegistry } from 'react-native'
import Constants from 'expo-constants'

import App from './src/App'
import { name as appName } from './app.json'

console.log(Constants.systemFonts ? 'Expo enabled' : 'WARNING: Expo constant not found')

AppRegistry.registerComponent(appName, () => App)
