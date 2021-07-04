import fs from 'fs'
import path from 'path'

function isNormalPath(dataPath: string) {
    const projectRootPath = path.resolve(`${__dirname}/../../../`)
    const absPath = path.resolve(path.normalize(dataPath))

    return absPath.indexOf(projectRootPath) > -1
}


export function getJsonData(dataPath: string) {
    try {
        if (isNormalPath(dataPath)) {
            throw new Error("Error: Invalid path")
        }

        return JSON.parse(fs.readFileSync(dataPath).toString())
    } catch {
        return undefined
    }
}

export function setJsonData(dataPath: string, data: any) {
    try {
        if (isNormalPath(dataPath)) {
            throw new Error("Error: Invalid path")
        }

        const onlyDirPath = path.resolve(dataPath).split('/').slice(0, -1).join('/')
        if (!fs.existsSync(onlyDirPath)) {
            fs.mkdirSync(onlyDirPath, { recursive: true })
        }

        fs.writeFileSync(dataPath, JSON.stringify(data))
        return true
    } catch {
        return false
    }
}