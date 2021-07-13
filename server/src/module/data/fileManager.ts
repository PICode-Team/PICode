import fs from "fs";
import path from "path";
import log from "../log";

function isNormalPath(dataPath: string) {
    const projectRootPath = path.resolve(`${__dirname}/../../../../`);
    const absPath = path.resolve(path.normalize(dataPath));

    return absPath.indexOf(projectRootPath) > -1;
}

export function isExists(dataPath: string) {
    if (!isNormalPath(dataPath)) {
        return false;
    }

    return fs.existsSync(dataPath);
}

export function removeData(dataPath: string) {
    if (!isNormalPath(dataPath)) {
        return false;
    }
    try {
        fs.rmdirSync(dataPath, { recursive: true });
        return true;
    } catch (e) {
        log.error(e.stack);
        return false;
    }
}

export function getJsonData(dataPath: string) {
    try {
        if (!isNormalPath(dataPath)) {
            throw new Error("Error: Invalid path");
        }

        return JSON.parse(fs.readFileSync(dataPath).toString());
    } catch (e) {
        log.error(e.stack);
        return undefined;
    }
}

export function setJsonData(dataPath: string, data: any) {
    try {
        if (!isNormalPath(dataPath)) {
            throw new Error("Error: Invalid path");
        }
        const onlyDirPath = path.resolve(dataPath).replace(/\\/g, "/").split("/").slice(0, -1).join("/");

        if (!fs.existsSync(onlyDirPath)) {
            fs.mkdirSync(onlyDirPath, { recursive: true });
        }

        fs.writeFileSync(dataPath, JSON.stringify(data));
        return true;
    } catch (e) {
        log.error(e.stack);
        return false;
    }
}
