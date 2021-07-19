import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class GQLDocument {
    @Field(() => ID)
    id?: string;

    @Field({ nullable: false })
    path?: string;

    @Field({ nullable: false })
    creator?: string;

    @Field({ nullable: false })
    createTime?: string;

    @Field({ nullable: true })
    content?: string;
}