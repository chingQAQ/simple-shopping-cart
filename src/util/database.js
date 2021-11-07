const { MongoClient } = require('mongodb');
const USER = 'aion';
const PASSWORD = 'ZnVn9xFXn2t7Sb8W';

module.exports = class Client {
  static _db = null;
  constructor (user, password) {
    this.user = user || USER;
    this.password = password || PASSWORD;
    this.init();
  }

  init () {
    if (Client._db != null) {
      return Client._db;
    }

    const url = this.setUrl(this.user, this.password);

    return (Client._db = Client.create(url));
  }

  setUrl (user, password) {
    return `mongodb+srv://${user}:${password}@cluster0.0tkzw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  }

  connect = async function (callback) {
    const response = await Client._db.connect().catch(error => console.log(error));

    if (!response) {
      return;
    }

    if (typeof callback === 'function') {
      Client._db = Client._db.db();

      return callback();
    }

    return response;
  }

  static create (url) {
    return new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  }

  static getDb () {
    if (Client._db) {
      return Client._db;
    }

    throw new Error('There is no db');
  }
};
