import createDebug from 'debug';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { app } from './app.js';
import { dataBaseConnect } from './dataBase/database.connect.js';

const debug = createDebug('NomuLabs: Index');

const PORT = process.env.PORT || 7373;

const server = createServer(app);

dataBaseConnect()
  .then(() => {
    server.listen(PORT);
    debug('Conected to dataBase', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    server.emit('error in database:', error);
  });

server.on('listening', () => {
  debug(`Listening on port ${PORT}`);
});

server.on('error', (error) => {
  console.log(`error en Index: ${error.message}`);
});
