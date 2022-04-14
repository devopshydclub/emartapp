const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  role: { type: Number, required: true, default: 0 },
  cardId: { type: String, required: true, max: 9 },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  cart: {
    created: { type: Date },
    status: { type: String, default: "new" },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        prod_name: { type: String },
        quantity: { type: Number },
        prod_total: { type: Number, default: 0 }
      }
    ]
  }
});

module.exports = User = mongoose.model("User", userSchema);
