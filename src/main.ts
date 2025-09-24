import { Plugin } from 'obsidian';
import { registerCommands } from './commands';

export default class VideoQuickInsertPlugin extends Plugin {

	onload() {

		// register commands from commands module
		registerCommands(this, {
			app: this.app,
			plugin: this
		});
	}

	onunload() {

	}
}