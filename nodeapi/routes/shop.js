const fs = require("fs");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");

const secretOrKey = require("../config/keys").secretOrKey;

const User = require("../models/User"); // User model
const Product = require("../models/Product"); // Product model
const Category = require("../models/Category"); // Category model
const Order = require("../models/Order"); // Order model

const validateCategoryInput = require("../validation/category"); // category validation
const validateProductInput = require("../validation/product"); // product validation
const validateOrderInput = require("../validation/order"); // product validation

// Multer configuration
const MIME_TYPE_MAP = { "image/png": "png", "image/jpg": "jpg", "image/jpeg": "jpg" };
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValidFile = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValidFile) error = null;
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-")
      .split(".")
      .slice(0, -1)
      .join(".");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

//--------------------------------Middleware--------------------------------//

function verifyToken(req, res, next) {
  if (!req.headers.authorization) return res.status(401).send("Unauthorized request");
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") return res.status(401).send("Unauthorized request");
  let payload = jwt.verify(token, secretOrKey);
  if (!payload) return res.status(401).send("Unauthorized request");
  req.userId = payload.id;
  next();
}

//----------------------------------Routes----------------------------------//

// @route   GET /shop/info
// @desc    Get products and orders info
// @access  Public
router.get("/info", async (req, res) => {
  try {
    let productsTotal = await Product.find().count();
    let ordersTotal = await Order.find().count();
    res.json({ success: true, productsTotal, ordersTotal });
  } catch {
    res.status(404).json({ success: false, message: "Failed to retrive information" });
  }
});

// @route   GET /shop/products
// @desc    Get products
// @access  Private
router.get("/products", verifyToken, (req, res) => {
  Product.find()
    .populate("category", "cat_name")
    .sort({ updatedAt: -1 })
    .then(products => res.json({ success: true, products }))
    .catch(err => res.status(404).json({ success: false, message: "No products found" }));
});

// @route   GET /shop/products/:id
// @desc    Get product by id
// @access  Private
router.get("/products/:id", verifyToken, (req, res) => {
  Product.findById(req.params.id)
    .then(product => res.json({ success: true, product }))
    .catch(err => res.status(404).json({ success: false, message: "No product found with that ID" }));
});

// @route   GET /shop/category/:category
// @desc    Get products by category
// @access  Private
router.get("/category/:category", verifyToken, (req, res) => {
  Category.find({ cat_name: req.params.category })
    .populate({ path: "products", select: "-category" })
    .sort({ updatedAt: -1 })
    .then(products => res.json({ success: true, products: products[0].products }))
    .catch(err => res.status(404).json({ success: false, message: "No products found for this category" }));
});

// @route   GET /shop/search/:prod_name
// @desc    Get products by product name
// @access  Private
router.get("/search/:prod_name", verifyToken, (req, res) => {
  Product.find({ prod_name: { $regex: req.params.prod_name, $options: "i" } })
    .populate("category")
    .sort({ updatedAt: -1 })
    .then(products => res.json({ success: true, products }))
    .catch(err => res.status(404).json({ success: false, message: "No products found by this name" }));
});

// @route   GET /shop/category
// @desc    Get categories
// @access  Private
router.get("/category", verifyToken, (req, res) => {
  Category.find()
    .then(categories => res.json({ success: true, categories }))
    .catch(err => res.status(404).json({ success: false, message: "No categories found" }));
});

// @route   POST /shop/category
// @desc    Create category
// @access  Private
router.post("/category", verifyToken, (req, res) => {
  const { errors, isValid } = validateCategoryInput(req.body);
  if (!isValid) return res.status(400).json({ success: false, message: errors.cat_name });
  Category.findOne({ cat_name: req.body.cat_name })
    .then(category => {
      if (category) {
        errors.cat_name = "Category already exists";
        return res.status(400).json({ success: false, message: errors.cat_name });
      } else {
        const newCategory = new Category(req.body);
        return newCategory.save().then(category => res.json({ success: true, category }));
      }
    })
    .catch(err => res.status(404).json({ success: false, message: "Could not create new category" }));
});

// @route   POST /shop
// @desc    Create product
// @access  Private
router.post("/", verifyToken, multer({ storage: storage }).single("imageUrl"), (req, res) => {
  const { errors, isValid } = validateProductInput(req.body);
  if (!isValid) return res.status(400).json({ success: false, errors });
  // Constructing a url to the server
  const url = req.protocol + "://" + req.get("host");
  Category.findOne({ cat_name: req.body.category })
    .then(category => {
      if (!category) {
        const newCategory = new Category({ cat_name: req.body.category });
        return newCategory.save();
      } else return category;
    })
    .then(category => {
      const newProduct = new Product({
        prod_name: req.body.prod_name,
        price: req.body.price,
        imageUrl: url + "/images/" + req.file.filename,
        category: category._id
      });
      return newProduct.save();
    })
    .then(product => {
      Category.findById(product.category).then(category => {
        category.products.push(product._id);
        category.save().then(category => res.json({ success: true, product, category }));
      });
    })
    .catch(err => res.status(404).json({ success: false, message: "Could not create new product" }));
});

// @route   PUT /shop/:id
// @desc    Update product
// @access  Private
router.put("/:id", verifyToken, multer({ storage: storage }).single("imageUrl"), async (req, res) => {
  // Constructing a url to the server
  const url = req.protocol + "://" + req.get("host");
  const imageFile = req.file;
  const newProductName = req.body.prod_name;
  const newPrice = req.body.price;
  const newCategoryName = req.body.category;
  try {
    const oldProduct = await Product.findById(req.params.id);
    const oldCategory = await Category.findById(oldProduct.category);
    if (newCategoryName !== oldCategory.cat_name) {
      const newCategory = await Category.findOne({ cat_name: newCategoryName });
      newCategory.products.push(oldProduct._id);
      const updatedNewCategory = await newCategory.save();
      const removeIndex = oldCategory.products.indexOf(req.params.id);
      oldCategory.products.splice(removeIndex, 1);
      const updatedOldCategory = await oldCategory.save();
      oldProduct.category = newCategory._id;
    }
    oldImageName = oldProduct.prod_name;
    let oldPath = oldProduct.imageUrl.split(url).pop();
    if (imageFile) {
      fs.unlink("." + oldPath, err => {
        if (err) return res.status(400).json({ success: false, message: "Failed to delete image file" });
      });
      oldProduct.imageUrl = url + "/images/" + imageFile.filename;
    }
    oldProduct.prod_name = newProductName ? newProductName : oldProduct.prod_name;
    oldProduct.price = newPrice ? newPrice : oldProduct.price;
    const updatedProduct = await oldProduct.save();
    res.json({ success: true, product: updatedProduct });
  } catch (err) {
    res.status(404).json({ success: false, message: "Failed to update product" });
  }
});

// @route   DELETE /shop/:id
// @desc    Delete product
// @access  Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const category = await Category.findById(product.category);
    const removeIndex = category.products.indexOf(req.params.id);
    let prod_name = product.prod_name;
    // deleting image file
    if (product) {
      let url = req.protocol + "://" + req.get("host");
      let Path = product.imageUrl.split(url).pop();
      fs.unlink("." + Path, err => {
        if (err) return res.status(400).json({ success: false, message: "Failed to delete image file" });
      });
    }
    category.products.splice(removeIndex, 1);
    const updatedCategory = await category.save();
    const removeProduct = await product.remove();
    res.json({ success: true, message: prod_name + " was deleted" });
  } catch {
    res.status(404).json({ success: false, message: "Failed to delete product" });
  }
});

// @route   PUT /shop/cart/:userId/:productId
// @desc    Add product to cart
// @access  Private
router.put("/cart/:userId/:productId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const product = await Product.findById(req.params.productId);
    if (user.cart.items.filter(item => item.productId.toString() === req.params.productId).length > 0) {
      const currProductIndex = user.cart.items.findIndex(item => item.productId.toString() === req.params.productId);
      user.cart.items[currProductIndex].quantity += Number(req.body.quantity);
      user.cart.items[currProductIndex].prod_total = user.cart.items[currProductIndex].quantity * product.price;
    } else
      user.cart.items.push({
        productId: req.params.productId,
        prod_name: product.prod_name,
        quantity: req.body.quantity,
        prod_total: req.body.quantity * product.price
      });
    if (user.cart.status !== "open") {
      user.cart.created = Date.now();
      user.cart.status = "open";
    }
    const updateUserCart = await user.save();
    res.json({ success: true, user });
  } catch {
    res.status(404).json({ success: false, message: "Failed adding product to cart" });
  }
});

// @route   PUT /shop/cart/delete/:userId/:productId
// @desc    Delete product from cart
// @access  Private
router.put("/cart/delete/:userId/:productId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const removeProductIndex = user.cart.items.findIndex(item => item.productId.toString() === req.params.productId);
    if (removeProductIndex !== -1) {
      user.cart.items.splice(removeProductIndex, 1);
      const updateUserCart = await user.save();
    }
    res.json({ success: true, user });
  } catch {
    res.status(404).json({ success: false, message: "Failed to remove product from cart" });
  }
});

// @route   PUT /shop/empty-cart/:userId
// @desc    Empty cart
// @access  Private
router.put("/empty-cart/:userId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const userOrders = await Order.find()
      .where("user.userId")
      .equals(req.params.userId);
    if (userOrders.length > 0) user.cart.status = "open";
    else user.cart.status = "new";
    user.cart.items = [];
    user.save().then(user => res.json({ success: true, user }));
  } catch {
    res.status(404).json({ success: false, message: "Failed to empty cart" });
  }
});

// @route   GET /shop/orders
// @desc    Get orders
// @access  Public
router.get("/orders", verifyToken, (req, res) => {
  Order.find()
    .sort({ updatedAt: -1 })
    .then(orders => res.json({ success: true, orders }))
    .catch(err => res.status(404).json({ success: false, message: "No orders found" }));
});

// @route   GET /shop/orders/:userId
// @desc    Get orders by customer
// @access  Private
router.get("/orders/:userId", verifyToken, (req, res) => {
  Order.find()
    .where("user.userId")
    .equals(req.params.userId)
    .sort({ updatedAt: -1 })
    .then(orders => res.json({ success: true, orders }))
    .catch(err => res.status(404).json({ success: false, message: "No orders found" }));
});

// @route   PUT /shop/orders
// @desc    Start order, change cart status to 'pending'
// @access  Private
router.put("/orders/:userId", verifyToken, (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (user.cart.items.length > 0) {
        user.cart.status = "pending";
        user.save().then(user => res.json({ success: true, user }));
      }
    })
    .catch(err => res.status(404).json({ success: false, message: "Can't start your order" }));
});

// @route   PUT /shop/open-cart/:userId
// @desc    Revoke order, change cart status to 'open' again
// @access  Private
router.put("/open-cart/:userId", verifyToken, (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (user.cart.items.length > 0) {
        user.cart.status = "open";
        user.save().then(user => res.json({ success: true, user }));
      }
    })
    .catch(err => res.status(404).json({ success: false, message: "Can't revoke order status" }));
});

// @route   POST /shop/orders
// @desc    Create order
// @access  Private
router.post("/orders/:userId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate();
    const orders = await Order.find();
    const products = Array.from(user.cart.items);
    const city = req.body.city;
    const street = req.body.street;
    const credit = req.body.credit;
    const ship = req.body.ship;
    // checks if cart is empty
    if (products.length > 0) {
      let takenDates = [];
      let isTaken;
      // checks if credit card number is valid
      if (credit) {
        if (!validateOrderInput.checkCreditCard(credit))
          return res.status(404).json({ success: false, message: "Credit card number is invalid" });
      } else return res.status(404).json({ success: false, message: "Credit card number is required" });
      // checks if shipping date is valid and also if its precedes / same as order date
      if (ship) {
        if (!validateOrderInput.checkShipDate(ship))
          return res.status(404).json({ success: false, message: "Shipping date is invalid" });
      } else return res.status(404).json({ success: false, message: "Shipping date is required" });
      // checks if orders for shipping date are fully booked
      if (orders) {
        const dates = orders.map(order => order.user.ship.toISOString().split("T")[0]);
        const allShipDates = dates.reduce((a, b) => {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, []);
        takenDates = allShipDates.filter(shipDate => dates.filter(date => date == shipDate).length > 2);
        if (takenDates.length > 0) {
          isTaken = takenDates.filter(date => date === ship).length > 0;
          if (isTaken)
            return res
              .status(404)
              .json({ success: false, message: `Shipping on ${ship} is already booked for 3 orders` });
        }
      }
      const totalOrderPrice = validateOrderInput.calcOrderTotal(products, "prod_total");
      const newOrder = new Order({
        products: Array.from(products),
        user: {
          city: city ? city : user.city,
          street: street ? street : user.street,
          credit: credit,
          order: Date.now(),
          ship: ship,
          userId: req.params.userId
        },
        total: totalOrderPrice
      });
      const savedOrder = await newOrder.save();
      user.cart.status = "closed";
      user.cart.items = [];
      const updateCartStatus = await user.save();
      res.json({ success: true, takenDates, order: savedOrder, user: updateCartStatus });
    } else res.status(404).json({ success: false, message: "Your cart is empty" });
  } catch {
    res.status(404).json({ success: false, message: "Could not process order" });
  }
});

// @route   GET /shop/current
// @desc    Return current user data
// @access  Private
router.get("/current", verifyToken, (req, res) => {
  User.findById(req.userId)
    .then(user =>
      Order.find()
        .where("user.userId")
        .equals(req.userId)
        .sort({ updatedAt: -1 })
        .then(orders => res.json({ success: true, user, orders }))
    )
    .catch(err => res.status(404).json({ success: false, message: "Could not fetch user data" }));
});

module.exports = router;
