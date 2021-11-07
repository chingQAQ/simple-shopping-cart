const { ObjectId } = require('mongodb');
const Client = require('../util/database');

module.exports = class Product {
  constructor (title, imageUrl, description, price, id, user) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;

    // mongodb automatic generate field.
    this._id = id ? new ObjectId(id) : null;
    this.user = user._id;
  }

  async save () {
    let db;

    try {
      if (this._id != null) {
        const findField = {
          _id: this._id
        };
        const update = {
          $set: this
        };

        db = await Client
          .getDb()
          .collection('products')
          .updateOne(findField, update)
          .catch(err => console.log(err));
      } else {
        db = await Client.getDb().collection('products').insertOne(this);
      }

      if (!db) {
        throw new Error('insert is unsuccess');
      }

      return {
        resultDb: db,
        status: 'done',
        message: 'This data is insert.'
      };
    } catch (error) {
      return {
        status: 'false',
        message: 'False to add data.'
      };
    }
  }

  static fetchAll () {
    return Client.getDb().collection('products').find().toArray();
  }

  static findById (prodId) {
    return Client.getDb().collection('products').findOne({ _id: new ObjectId(prodId) });
  }

  static deleteById (prodId) {
    return Client.getDb().collection('products').deleteOne({ _id: new ObjectId(prodId) });
  }
};
