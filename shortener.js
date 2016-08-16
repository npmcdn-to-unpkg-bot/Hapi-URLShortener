const Hapi      = require('hapi');
const server    = new Hapi.Server();
const routes    = require('./routes');
const mongoose  = require('mongoose');
const mongoUri  = process.env.MONGOURI || 'mongodb://localhost/shortio';

/*
 * ----------------------------------------------------------------------
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set
 * We recommend a 30 second connection timeout because it allows for
 * plenty of time in most operating environments.
 * ----------------------------------------------------------------------
*/

const options = {
  server: {
    socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }
  },
  replset: {
    socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }
  }
};

mongoose.connect(mongoUri, options);

const db = mongoose.connection;

/* SERVER INITIALIZATION
 * ----------------------------------------------------------------------
 * We initialize the server once the connection to the database was set
 * with no errors; we also need to set CORS to true if we want this
 * API to be accessible in other domains. In order to server static files
 * I used the Hapi plugin called 'inert', hence the call to 'require'.
 * ----------------------------------------------------------------------
*/

server.connection({
  port: process.env.PORT || 3000,
  routes: { cors: true }
});

server.register(require('inert'), (err) => {
  db.on('error', console.error.bind(console, 'connection error:'))
    .once('open', () => {
      server.route(routes);

      server.start(err => {
        if (err) throw err;

        console.log(`Server running at port ${server.info.port}`);
      });
    });
});
