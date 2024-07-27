import mongoose from "mongoose";

const productDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Bundle Product Details Name required"]
  },
  description: {
    type: String,
    required: [true, "Bundle Product Description required"]
  },
  key_benefits: [
    {
      type: String,
      required: [true, "key_benefitsrequired"]
    }
  ],
  key_ingrediants: {
    type: String,
    required: [true, "key_ingrediants required"]
  }
});

const bundleDescriptionSchema = new mongoose.Schema({
  main_heading: {
    type: String,
    required: [true, "main heading required"]
  },
  main_description: {
    type: String,
    required: [true, "main description required"]
  },
  product_details: {
    type: [productDetailsSchema],
    required: [true, "product details required"]
  },
  why_choose_us: [
    {
      type: String,
      required: [true, "why_choose_us required"]
    }
  ]
});

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name required"],
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Price required"],
    },
    sale_price: {
      type: Number, 
      default: null, 
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
    category: {
      type: String,
      required: [true, "category required"],
      enum: ["Skincare", "Body Care", "Haircare", "Cosmetics", "Bundle"],
    },
    subCategory: {
      type: String,
      default: null,
    },
    latest: {
      type: Boolean,
      default: false,
    },
    bundleDescription : bundleDescriptionSchema
  },
  { timestamps: true }
);

export const ProductsModel = mongoose.model("Products", productsSchema);
