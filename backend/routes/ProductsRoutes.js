import express from "express";
import {
  addProduct,
  deleteProduct,
  getLatestPRoducts,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/ProductsController.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const productRouter = express.Router();

productRouter.post("/products/addProduct",upload.single("filename"), addProduct);
productRouter.post("/products/updateProduct",upload.single("filename"), updateProduct);
productRouter.post("/products/deleteProduct", deleteProduct);
productRouter.post("/products/deleteProduct", deleteProduct);
productRouter.post("/products/getLatestPRoducts", getLatestPRoducts);
productRouter.post("/products/getProducts", getProducts);
productRouter.post("/products/getProductById", getProductById);

export default productRouter;
