const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    products: [{ type: Object }],
    user: {
      city: { type: String, required: true },
      street: { type: String, required: true },
      credit: { type: String, required: true },
      order: { type: Date, required: true },
      ship: { type: Date, required: true },
      userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }
    },
    total: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = Order = mongoose.model("Order", orderSchema);
