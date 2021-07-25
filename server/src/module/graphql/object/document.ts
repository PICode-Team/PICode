import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class GQLDocument {
    @Field(() => ID)
    documentId?: string;

    @Field({ nullable: false })
    path?: string;

    @Field({ nullable: false })
    creator?: string;

    @Field({ nullable: false })
    createTime?: string;

    @Field({ nullable: true })
    content?: string;
}