import { App, Modal, Setting } from "obsidian";
import { DEFAULT_SETTINGS, InsertVideoModalSettings } from "src/settings";
import { importExternalFiles } from "src/utils/external-file";

export class InsertVideoModal extends Modal {
    private settings: InsertVideoModalSettings = DEFAULT_SETTINGS;

    constructor(app: App, private onSubmit?: (settings?: InsertVideoModalSettings) => void) {
        super(app);
    }

    async onOpen() {
        const { contentEl } = this;

        contentEl.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.onSubmit?.(undefined);
                this.onClose();
            }

            if (event.key === 'Enter') {
                this.onSubmit?.(this.settings);
            }
        })

        new Setting(contentEl)
            .setName('Select Video Source')
            .setDesc('Choose to input a URL or browse and upload a local video file')
            .addDropdown((dropdown) => {
                dropdown.addOptions({
                    'local': 'Local File',
                    'url': 'Video URL'
                })
                    .setValue('local')
                    .onChange(_ => updateVisibility());
            });

        const urlCard = new Setting(contentEl)
            .setName('Video URL')
            .setDesc('The URL of the video to insert')
            .addText((text) => {
                text.setPlaceholder('Input video URL here...')
                    .setValue(this.settings.urlImport?.url || '')
                    .onChange((value) => {
                        if (!this.settings.urlImport) {
                            console.log('urlImport settings is null');
                            return;
                        }
                        this.settings.urlImport.url = value;
                    })
            });

        const localCard = [
            new Setting(contentEl)
                .setName('Import to')
                .setDesc('Select a folder to import videos to')
                .addDropdown((dropdown) => {
                    const folders = this.app.vault.getAllFolders();
                    dropdown.addOptions(Object.fromEntries(folders.map(f => [f.path, f.name])))
                        .setValue(folders[0].path)
                        .onChange((value) => {
                            if (!this.settings.localImport) {
                                console.log('localImport settings is null');
                                return;
                            }
                            this.settings.localImport.importFolder = value;
                        });
                }),
            new Setting(contentEl)
                .setName('Browse Video File')
                .setDesc('Select a local video file to import')
                .addButton((button) => {
                    button.setButtonText('Browse')
                        .onClick(async () => {
                            if (!this.settings.localImport) {
                                console.log('localImport settings is null');
                                return;
                            }
                            button.setDisabled(true);
                            button.setCta();
                            try {
                                await importExternalFiles(this.app, {
                                    destDir: this.settings.localImport.importFolder || "Imported Videos",
                                    allowMulti: false,
                                    accept: "video/*",
                                    conflict: "rename"
                                }).then((files) => {
                                    if (!this.settings.localImport) {
                                        console.log('localImport settings is null');
                                        return;
                                    }
                                    if (files.length <= 0) {
                                        console.log('No files imported');
                                        return;
                                    }

                                    const file = files[0];
                                    this.settings.localImport.fullPath = this.app.vault.getResourcePath(file.tfile);
                                    this.settings.localImport.format = file.type;
                                    console.log('settings:', this.settings);
                                    localCard[1].setDesc(`Selected: ${file.tfile.path}`);
                                });
                            } catch (err) {
                                console.error(err);
                            } finally {
                                button.setDisabled(false);
                                button.removeCta();
                            }
                        });
                })
        ];


        new Setting(contentEl)
            .setName('Size')
            .setDesc('The size of the video player')
            .addText((text) => {
                text.setPlaceholder('Set video size, e.g., 640x360 or auto')
                    .setValue(this.settings.width)
                    .onChange((value) => {
                        this.settings.width = value;
                    });
                text.inputEl.style.width = '80px';
                text.inputEl.style.textAlign = 'center';
            })
            .addText((text) => {
                text.setValue('x')
                    .setDisabled(true);
                text.inputEl.style.width = '30px';
                text.inputEl.style.textAlign = 'center';
            })
            .addText((text) => {
                text.setPlaceholder('Set video size, e.g., 640x360 or auto')
                    .setValue(this.settings.height)
                    .onChange((value) => {
                        this.settings.height = value;
                    });
                text.inputEl.style.width = '80px';
                text.inputEl.style.textAlign = 'center';
            });

        new Setting(contentEl)
            .addButton((button) => {
                button.setButtonText('Insert')
                    .onClick(() => {
                        this.onSubmit?.(this.settings);
                        this.close();
                    });
            });

        const updateVisibility = () => {
            const method = (contentEl.querySelector('select') as HTMLSelectElement).value;
            if (method === 'url') {
                this.settings.urlImport = {
                    url: ''
                }
                this.settings.localImport = null;
                urlCard.settingEl.style.display = '';
                localCard.forEach(card => card.settingEl.style.display = 'none');
            } else {
                this.settings.localImport = {
                    fullPath: '',
                    importFolder: '',
                    format: ''
                };
                this.settings.urlImport = null;
                urlCard.settingEl.style.display = 'none';
                localCard.forEach(card => card.settingEl.style.display = '');
            }
        };

        updateVisibility();
    }

    onClose() {
        super.onClose();
        const { contentEl } = this;
        contentEl.empty();
    }

}