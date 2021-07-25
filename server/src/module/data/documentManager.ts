import { DataDirectoryPath } from "../../types/module/data/data.types";
import { GQLDocument } from "../graphql/object/document";
import { getJsonData, setJsonData } from "./fileManager";

export default class DataDocumentManager {
    static getDocumentDataPath() {
        return `${DataDirectoryPath}/document`;
    }

    static get(documentId?: string) {
        return (getJsonData(`${this.getDocumentDataPath()}/documentData.json`) as GQLDocument[]).filter((v) => documentId === undefined || v.documentId === documentId);
    }

    static create(data: GQLDocument) {
        const originData = this.get();

        return setJsonData(`${this.getDocumentDataPath()}/documentData.json`, [...originData, data]);
    }

    static update(documentId: string, newData: TDataDocumentUpdataSet) {
        const originData = this.get();
        const targetData = originData.find((v) => v.documentId === documentId);

        if (targetData === undefined) {
            return false;
        }

        for (const key of (Object.keys(newData) as (keyof TDataDocumentUpdataSet)[]).filter((v) => newData[v] !== undefined)) {
            targetData[key] = newData[key];
        }

        return setJsonData(`${this.getDocumentDataPath()}/documentData.json`, originData);
    }

    static delete(documentId: string) {
        const originData = this.get();

        const targetIndex = originData.findIndex((v) => v.documentId === documentId);

        if (targetIndex < 0) {
            return false;
        }

        originData.splice(targetIndex, 1);

        return setJsonData(`${this.getDocumentDataPath()}/documentData.json`, originData);
    }
}

interface TDataDocumentUpdataSet {
    content?: string;
    path?: string;
}
