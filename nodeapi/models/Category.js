const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  cat_name: { type: String },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }]
});

module.exports = Category = mongoose.model("Category", categorySchema);
