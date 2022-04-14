const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    prod_name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category" }
  },
  { timestamps: true }
);

module.exports = Product = mongoose.model("Product", productSchema);
