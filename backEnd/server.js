const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { gql } = require('apollo-server');
const { ApolloServer} = require('apollo-server-express');


const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');


if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}


//be careful! The token has changed! 
app.post('/payment', (req, res) => {
  const body = {
    source: 'tok_visa',
    amount: req.body.amount,
    currency: 'usd'
  };

  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
        console.log("stripe error");
        console.log(stripeErr);

      res.status(500).send({ error: stripeErr });
    } else {
        console.log(stripeRes);
        res.status(200).send({ success: stripeRes });
    }
  });
});


const typeDefs = gql`
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



const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: {
    prisma
  }
});


server.start(
  {
    cors: {
      origin: ['http://localhost:3000']
    }
  },
  () => console.log('GraphQL is running on http://localhost:4000')
);





// Start the server, refer to google cloud platform documentation
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_flex_quickstart]

module.exports = app;