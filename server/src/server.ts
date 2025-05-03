import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { connectToDatabase } from './config/connection.js';
import { authMiddleware } from './services/auth.js';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🔧 Server file loaded');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

async function startApolloServer() {
  console.log('🔧 Apollo Server setup starting');
  await server.start();
  console.log('✅ Apollo Server started');

  app.use(cors());
  app.use(bodyParser.json());

  console.log('🔧 Applying GraphQL middleware...');
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => authMiddleware({ req }),
  }));

  // Serve static files from React in production
  if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.resolve(__dirname, '../../client/dist');
    app.use(express.static(clientBuildPath));

    app.get('*', (_, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }

  console.log('📡 Connecting to MongoDB...');
  connectToDatabase()
    .then(() => {
      console.log('✅ DB connected');
      app.get('/health', (_, res) => {
        res.send('✅ Server is running');
      });
      app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
      });
    })
    .catch((err) => {
      console.error('❌ DB connection error:', err.message);
    });
}

startApolloServer();
