import { App, normalizePath, TFile } from "obsidian";

/** 选外部文件并导入到 Vault
 * @param app Obsidian App
 * @param destDir 目标目录（Vault 相对路径）。不存在会自动创建
 * @param allowMulti 是否允许多选
 * @param accept input accept，如 "image/*,.pdf"、"video/*"、".mp4,.mov"
 * @param conflict "skip" | "overwrite" | "rename"（默认 rename：自动在重名时加 (1)、(2)…）
 * @returns 成功导入的 TFile 数组
 */
export async function importExternalFiles(
    app: App,
    {
        destDir = "Imported",
        allowMulti = true,
        accept = "video/*",
        conflict = "rename" as "skip" | "overwrite" | "rename",
    } = {}
): Promise<{ tfile: TFile, type: string }[]> {
    // 1) 选择外部文件
    const files = await pickFilesAsBlobs(accept, allowMulti);

    if (!files.length) return [];

    // 2) 确保目标文件夹存在
    destDir = normalizePath(destDir);
    await ensureFolder(app, destDir);

    // 3) 逐个写入
    const imported: { tfile: TFile, type: string }[] = [];
    for (const f of files) {
        const { name } = f.file;
        const target = await resolveConflict(app, `${destDir}/${name}`, conflict);
        if (!target) continue; // skip

        const buf = await f.file.arrayBuffer();
        // 二进制写入（适用于任何类型，包括视频/图片/PDF/音频）
        const tfile = await app.vault.createBinary(target, buf);
        imported.push({ tfile, type: f.type });
    }
    return imported;
}

/** 通过 <input type="file"> 获取 File 列表 */
function pickFilesAsBlobs(accept = "", multiple = true): Promise<{
    file: File,
    type: string
}[]> {
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;
        input.multiple = multiple;
        input.style.display = "none";
        document.body.appendChild(input);
        input.onchange = () => {
            const files = Array.from(input.files || []);
            input.remove();
            resolve(files.map(f => { return { file: f, type: f.type } }));
        };

        input.onabort = () => {
            onAbortOrCancel();
        };

        input.oncancel = () => {
            onAbortOrCancel();
        };
        input.click();

        const onAbortOrCancel = () => {
            console.log("File selection aborted or canceled");
            input.remove();
            resolve([]);
        };
    });
}

/** 确保文件夹存在（深层路径也能创建） */
async function ensureFolder(app: App, folderPath: string) {
    const parts = normalizePath(folderPath).split("/");
    for (let i = 1; i <= parts.length; i++) {
        const seg = parts.slice(0, i).join("/");
        if (!seg) continue;
        if (!(await app.vault.adapter.exists(seg))) {
            await app.vault.createFolder(seg);
        }
    }
}

/** 重名处理策略 */
async function resolveConflict(
    app: App,
    wantedPath: string,
    conflict: "skip" | "overwrite" | "rename"
): Promise<string | null> {
    wantedPath = normalizePath(wantedPath);
    const exists = await app.vault.adapter.exists(wantedPath);
    if (!exists) return wantedPath;

    if (conflict === "overwrite") {
        // 先删除再写入
        const file = app.vault.getAbstractFileByPath(wantedPath);
        if (file instanceof TFile) await app.vault.delete(file);
        return wantedPath;
    }

    if (conflict === "skip") return null;

    // rename：文件名自动加 (1)…(n)
    const dot = wantedPath.lastIndexOf(".");
    const dir = wantedPath.substring(0, wantedPath.lastIndexOf("/"));
    const base = wantedPath.substring(wantedPath.lastIndexOf("/") + 1, dot === -1 ? undefined : dot);
    const ext = dot === -1 ? "" : wantedPath.substring(dot);

    let i = 1;
    // 尝试 base (1).ext、base (2).ext …
    // 注意 normalizePath 保持统一斜杠
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const trial = normalizePath(`${dir}/${base} (${i})${ext}`);
        const ok = !(await app.vault.adapter.exists(trial));
        if (ok) return trial;
        i++;
    }
}
