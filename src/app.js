const { resolve } = require('./util/path');
const express = require('express');
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const Client = require('./util/database');
const client = new Client();
const Users = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', resolve('views'));

const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(resolve('public')));
app.use(async (req, res, next) => {
  try {
    const getUser = await Users.findById('61842d1141865ee2de71689f');

    if (getUser) {
      req.user = new Users(getUser.name, getUser.email, getUser.cart, getUser._id);
      next();
    }
  } catch (error) {
    console.log(error);
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

client.connect(() => {
  app.listen(3000, () => console.log('listening on port 3000'));
});
