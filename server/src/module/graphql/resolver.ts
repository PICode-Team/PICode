import 'reflect-metadata';
import { NonEmptyArray, Query, Resolver } from 'type-graphql';


@Resolver()
export class TestResolver {
    @Query(() => String)
    test(str: string) {
        return str.length;
    }
}

export const GrahpQLResolverList:NonEmptyArray<Function> | NonEmptyArray<string> = [TestResolver]