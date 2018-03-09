var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'eidd-resul'
    },
    port: process.env.PORT || 3007,
  },

  test: {
    root: rootPath,
    app: {
      name: 'eidd-resul'
    },
    port: process.env.PORT || 3007,
  },

  production: {
    root: rootPath,
    app: {
      name: 'eidd-resul'
    },
    port: process.env.PORT || 3007,
  }
};

module.exports = config[env];
