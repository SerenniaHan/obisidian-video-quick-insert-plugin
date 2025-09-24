import { App, Plugin } from 'obsidian';

export interface CommandContext {
    app: App;
    plugin: Plugin;
}