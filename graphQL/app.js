const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

const typeDefs = `
type Collection {
  id: ID!
  title: String! 
  items: [Item!]!
}

type Item {
  id: ID!
  name: String!
  price: Float!
  imageUrl: String!
  collection: Collection
}

type Query {
  collections: [Collection!]!
  collection(id: ID!): Collection
  getCollectionsByTitle(title: String): Collection
}
`;

const resolvers = {
  Query: {
    collections: (root, args, ctx, info) => ctx.prisma.collections({}, info),
    collection: (root, { id }, ctx) => ctx.prisma.collection({ id }),
    getCollectionsByTitle: (root, { title }, ctx) =>
      ctx.prisma.collection({ title })
  },
  Item: {
    collection: ({ id }, args, context) => {
      return context.prisma.item({ id }).collection();
    }
  },
  Collection: {
    items: ({ id }, args, context) => {
      return context.prisma.collection({ id }).items();
    }
  }
};

// build a new server
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: {
    prisma
  }
});

server.start(
  { 
    port:8080,
    cors: {
      origin:'*'
    }
  },
  () => console.log('GraphQL server is running')
);

