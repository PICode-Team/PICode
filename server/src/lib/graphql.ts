import { ApolloServer } from 'apollo-server-express';
import { buildSchemaSync } from 'type-graphql';
import { GrahpQLResolverList } from '../module/graphql/resolver';

const schema = buildSchemaSync({ resolvers: GrahpQLResolverList });
const graphQLServer = new ApolloServer({ schema });

export default graphQLServer