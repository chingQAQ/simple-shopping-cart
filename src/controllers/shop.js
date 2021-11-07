const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  const response = await Product.fetchAll().catch(err => console.log(err));

  if (response) {
    return res.render('shop/product-list', {
      prods: response,
      pageTitle: 'All Products',
      path: '/products'
    });
  }
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const response = await Product.findById(prodId).catch(err => console.log(err));

  if (response) {
    return res.render('shop/product-detail', {
      product: response,
      pageTitle: response.title,
      path: '/products'
    });
  }
};

exports.getIndex = async (req, res, next) => {
  const response = await Product.fetchAll().catch(err => console.log(err));

  if (response) {
    return res.render('shop/index', {
      prods: response,
      pageTitle: 'Shop',
      path: '/'
    });
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const products = await req.user.getCartProducts();

    return res.render('shop/cart', {
      products: products,
      pageTitle: 'Shop cart',
      path: '/cart'
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const product = await Product.findById(prodId);

    await req.user.addToCart(product);

    return res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    await req.user.deleteProduct(prodId);

    return res.redirect('/cart');
  } catch (error) {
    console.log(error);
  }
};

exports.postCartToOrder = async (req, res, next) => {
  try {
    await req.user.addOrder();

    return res.redirect('/cart');
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrder();

    return res.render('shop/orders', {
      orders,
      path: '/orders',
      pageTitle: 'Your Orders'
    });
  } catch (error) {

  }

  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};
