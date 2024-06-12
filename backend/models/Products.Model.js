import mongoose from "mongoose";

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name required"],
    },
    description: {
      type: String,
      required: [true, "Description required"],
    },
    price: {
      type: Number,
      required: [true, "Price required"],
    },
    sale_price: {
      type: Number,
      default:null
    },
    stock: {
      type: Number,
      required: [true, "stock required"],
    },
    image: {
      downloadURL: { type: String, required: [true, "image Link required"] },
      name: { type: String },
      type: { type: String },
    },
    category:{
        type: String,
        required: [true, "category required"],
        enum:["Skincare","Body Care","Haircare","Cosmetics"]
    },
    subCategory:{
        type: String,
        default:null,
    },
    latest:{
        type: Boolean,
        default:false,
    }
  },
  { timestamps: true }
);

export const ProductsModel = mongoose.model("Products", productsSchema);
