export interface InsertVideoModalSettings {
    width: string;
    height: string;
    localImport: ImportFromLocalSettings | null;
    urlImport: ImportFromUrlSettings | null;
}

export const DEFAULT_SETTINGS: InsertVideoModalSettings = {
    width: 'auto',
    height: 'auto',
    localImport: null,
    urlImport: null
};


export interface ImportFromLocalSettings {
    importFolder: string;
    fullPath: string;
    format: string;
}

export interface ImportFromUrlSettings {
    url: string;
}