import 'reflect-metadata';
import { NonEmptyArray, Query, Resolver } from 'type-graphql';
import { GQLDocument } from './object/document'
import fs from 'fs'

@Resolver()
export class TestResolver {
    @Query(() => [GQLDocument])
    getDocument() {
        return JSON.parse(fs.readFileSync('./test/data.json').toString()) as GQLDocument[]
    }
}

export const GrahpQLResolverList: NonEmptyArray<Function> | NonEmptyArray<string> = [TestResolver]