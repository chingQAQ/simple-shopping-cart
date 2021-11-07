const { ObjectId } = require('mongodb');
const Client = require('../util/database');

module.exports = class User {
  constructor (name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart ?? {};
    this._id = id;
  }

  addToCart (product) {
    let newQuantity = 1;
    let updateCartItems = [];
    const cartProductIndex = this.cart.items?.findIndex(i => {
      return product._id.toString() === i.productId.toString();
    });

    if (this.cart.items) {
      updateCartItems = [...this.cart.items];
    }

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updateCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updateCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      });
    }

    const updateToCart = {
      items: updateCartItems
    };

    return Client
      .getDb()
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        {
          $set: {
            cart: updateToCart
          }
        }
      );
  }

  async getCartProducts () {
    const productsId = this.cart.items.map(i => i.productId);
    try {
      const getCart = await Client
        .getDb()
        .collection('products')
        .find({ _id: { $in: productsId } })
        .toArray();

      return getCart.map(i => ({
        ...i,
        qty: this.cart.items.find(j =>
          j.productId.toString() === i._id.toString()
        ).quantity
      }));
    } catch (error) {
      console.log(error);

      return [];
    }
  }

  deleteProduct (productId) {
    try {
      return Client
        .getDb()
        .collection('users')
        .updateOne(
          { _id: new ObjectId(this._id) },
          { $pull: { 'cart.items': { productId: new ObjectId(productId) } } });
    } catch (error) {
      console.log(error);
    }
  }

  async addOrder () {
    try {
      const cartProducts = await this.getCartProducts();
      const order = {
        order: cartProducts,
        user: {
          _id: new ObjectId(this._id),
          name: this.name
        }
      };

      this.cart.items = [];

      await Client
        .getDb()
        .collection('users')
        .updateOne(
          { _id: new ObjectId(this._id) },
          { $set: { 'cart.items': this.cart.items } });

      return Client
        .getDb()
        .collection('orders')
        .insertOne(order);
    } catch (error) {
      console.log(error);
    }
  }

  getOrder () {
    return Client.getDb().collection('orders').find({ 'user._id': new ObjectId(this._id) }).toArray();
  }

  static save () {
    return Client.getDb().collection('users').insertOne(this);
  }

  static findById (userId) {
    return Client.getDb().collection('users').findOne({ _id: new ObjectId(userId) });
  }
};
