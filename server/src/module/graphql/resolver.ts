import 'reflect-metadata';
import { Arg, Mutation, NonEmptyArray, Query, Resolver } from 'type-graphql';
import { GQLDocument } from './object/document'
import { v4 as uuidv4 } from 'uuid'
import log from '../log';
import { getTime } from '../datetime';
import DataDocumentManager from '../data/documentManager';

console.log(DataDocumentManager.get())

@Resolver()
export class TestResolver {
    @Query(() => [GQLDocument])
    getDocument() {
        try {
            return DataDocumentManager.get()
        } catch {
            return [] as GQLDocument[]
        }
    }

    @Mutation(() => Boolean)
    createDocument(
        @Arg('path') path: string,
        @Arg('creator') creator: string,
        @Arg('content') content: string,
    ) {
        try {
            const documentId = uuidv4()
            const createTime = getTime()

            DataDocumentManager.create({
                documentId, createTime, path, creator, content
            })

            return true
        } catch (e) {
            log.error(e.stack)
            return false
        }
    }

    @Mutation(() => Boolean)
    updateDocument(
        @Arg('documentId') documentId: string,
        @Arg('path', { nullable: true }) path: string,
        @Arg('content', { nullable: true }) content: string,
    ) {
        try {
            return DataDocumentManager.update(documentId, { path, content })
        } catch {
            return false
        }
    }

    @Mutation(() => Boolean)
    deleteDocument(
        @Arg('documentId') documentId: string
    ) {
        try {
            return DataDocumentManager.delete(documentId)
        } catch {
            return false
        }
    }
}

export const GrahpQLResolverList: NonEmptyArray<Function> | NonEmptyArray<string> = [TestResolver]