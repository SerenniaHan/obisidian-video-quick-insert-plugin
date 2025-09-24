import { Plugin } from 'obsidian';
import { CommandContext } from './types';
import { InsertVideoModal } from 'src/modals';
import { InsertVideoModalSettings } from 'src/settings';

export function registerCommands(plugin: Plugin, context: CommandContext): void {

    console.log('registerCommands');

    plugin.addCommand({
        id: 'insert-video-link',
        name: 'Insert Video Link',
        editorCallback: (editor) => {
            new InsertVideoModal(context.app, (settings?: InsertVideoModalSettings) => {
                if (settings === undefined) {
                    return;
                }

                if (settings.localImport != null) {
                    console.log('Inserting local video:', settings.localImport);
                    const videoMarkdownStr = `
                <video controls width="${settings.width}" height="${settings.height}">
                    <source src="${settings.localImport?.fullPath}" type="${settings.localImport?.format}">
                </video>
                `.split('\n').map(line => line.trim()).join('\n');

                    editor.replaceSelection(videoMarkdownStr);

                    return;
                }

                if (settings.urlImport != null) {
                    console.log('Inserting URL video:', settings.urlImport);
                    const videoMarkdownStr = `
                        <iframe width="${settings.width}" height="${settings.height}" src="${settings.urlImport?.url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen/>
                    `.trim();
                    editor.replaceSelection(videoMarkdownStr);
                }
            }).open();
        }
    });
}
