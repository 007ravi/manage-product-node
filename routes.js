const router = require("express").Router();
const bodyParser = require("body-parser");
const Product = require("./schema").Product;
const User = require("./schema").User;
const Cart = require("./schema").Cart;
const Order = require("./schema").Order;
const Count = require("./schema").Count;

let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ecom", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

router.use(bodyParser.json());

router.get("/getUsers", async (req, res) => {
  let users = await User.find();
  res.send(JSON.stringify(users));
});

router.post("/register", async (req, res) => {
  let count = await Count.find();
  let usercount = count[0].user_count;

  let user = new User({
    id: "user" + (usercount + 1),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    mobile: req.body.mobile
  });

  let cart = new Cart({
    user_id: user.id,
    items: []
  });

  await user.save().then(() => {
    cart.save();

    Count.updateOne(
      {
        user_count: usercount
      },
      {
        $set: {
          user_count: usercount + 1
        }
      },
      err => {
        if (err) res.send(err);
        else res.send(user.id);
      }
    );
  });
});

router.get("/getProducts", async (req, res) => {
  let products = await Product.find();
  res.send(JSON.stringify(products));
});
router.post("/manageproducts", async (req, res) => {
  let action = req.query.action;

  if (action == "insert") {
    let count = await Count.find();
    let productcount = count[0].product_count;
    let product = new Product({
      id: "product" + (productcount + 1),
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description
    });

    await product.save().then(() => {
      Count.updateOne(
        {
          product_count: productcount
        },
        {
          $set: {
            product_count: productcount + 1
          }
        },
        err => {
          if (err) res.send(err);
          else res.send("product" + (productcount + 1));
        }
      );
    });
  }

  if (action == "update") {
    Product.updateOne(
      {
        id: req.body.id
      },
      {
        $set: {
          name: req.body.name,
          price: req.body.price,
          quantity: req.body.quantity,
          description: req.body.description
        }
      },
      err => {
        if (err) res.send(err);
        else res.send(req.body.id);
      }
    );
  }

  if (action == "delete") {
    Product.deleteOne(
      {
        id: req.body.id
      },
      err => {
        if (err) res.send(err);
      }
    );
  }
});

router.post("/viewproducts", async (req, res) => {
  let userID = req.query.id;
  await Cart.updateOne(
    {
      user_id: userID
    },
    {
      $set: {
        items: req.body
      }
    },
    err => {
      if (err) res.send(err);
      else res.send("cart updated");
    }
  );
});
router.get("/getCart", async (req, res) => {
  let cart = await Cart.find({
    user_id: req.query.id
  });
  res.send(JSON.stringify(cart[0].items));
});

router.post("/checkout", async (req, res) => {
  let order = new Order({
    user_id: req.body.user_id,
    timestamp: req.body.timestamp,
    cart: req.body.cart
  });

  req.body.cart.forEach(async cartitem => {
    await Product.updateOne(
      {
        id: cartitem.product_id
      },
      {
        $inc: { quantity: -cartitem.quantity }
      }
    ),
      err => {
        if (err) res.send(err);
      };
  });

  await order.save().then(() => {
    Cart.updateOne(
      {
        user_id: req.body.user_id
      },
      {
        $set: { items: [] }
      },
      err => {
        if (err) res.send(err);
        else res.send("ordered");
      }
    );
  });
});

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/manageproducts.html");
});

router.get("/login", (req, res) => {
  res.sendFile(__dirname + "/pages/login.html");
});

router.get("/register", (req, res) => {
  res.sendFile(__dirname + "/pages/register.html");
});

router.get("/manageproducts", (req, res) => {
  res.sendFile(__dirname + "/pages/manageproducts.html");
});

router.get("/viewproducts", (req, res) => {
  res.sendFile(__dirname + "/pages/viewproducts.html");
});

router.get("/checkout", (req, res) => {
  res.sendFile(__dirname + "/pages/checkout.html");
});

router.get("/login-script.js", (req, res) => {
  res.sendFile(__dirname + "/pages/login-script.js");
});
router.get("/register-script.js", (req, res) => {
  res.sendFile(__dirname + "/pages/register-script.js");
});
router.get("/manage-script.js", (req, res) => {
  res.sendFile(__dirname + "/pages/manage-script.js");
});
router.get("/view-script.js", (req, res) => {
  res.sendFile(__dirname + "/pages/view-script.js");
});
router.get("/checkout-script.js", (req, res) => {
  res.sendFile(__dirname + "/pages/checkout-script.js");
});

module.exports = router;
