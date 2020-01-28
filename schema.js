let mongoose = require("mongoose");

var Count = mongoose.Schema({
  user_count: Number,
  product_count: Number
});

var Product = mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  quantity: Number,
  description: String
});

var User = mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  mobile: Number
});

var CartItem = mongoose.Schema({
  product_id: String,
  quantity: Number
});

var Cart = mongoose.Schema({
  user_id: String,
  items: [CartItem]
});

var Order = mongoose.Schema({
  user_id: String,
  timestamp: String,
  cart: [CartItem]
});

module.exports.Count = mongoose.model("Count", Count);
module.exports.Product = mongoose.model("Product", Product);
module.exports.User = mongoose.model("User", User);
module.exports.CartItem = mongoose.model("CartItem", CartItem);
module.exports.Cart = mongoose.model("Cart", Cart);
module.exports.Order = mongoose.model("Order", Order);
