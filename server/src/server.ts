import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';

import db from './config/connection.js';
import { authMiddleware } from './services/auth.js'; // <-- make sure this path matches
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🔧 Server file loaded');
// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo Server
async function startApolloServer() {
  console.log('🔧 Apollo Server setup starting');
  await server.start();
  console.log('✅ Apollo Server started');

  app.use(cors());
  app.use(bodyParser.json());

  console.log('🔧 Applying GraphQL middleware...');

  // Attach Apollo middleware with custom auth context
  app.use('/graphql', expressMiddleware(server, {
    context: async (args) => await authMiddleware(args),
  }));

  // Serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (_, res) =>
      res.sendFile(path.join(__dirname, '../client/dist/index.html'))
    );
  }

  console.log('📡 Waiting for DB connection...');
  db.once('open', () => {
    console.log('✅ DB connected');
    app.listen(PORT, () => {
      console.log(`🚀 GraphQL server ready at http://localhost:${PORT}/graphql`);
    });
  });
}

startApolloServer();

// import express from 'express';
// import path from 'node:path';
// import db from './config/connection.js';
// import routes from './routes/index.js';

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.use(routes);

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });
