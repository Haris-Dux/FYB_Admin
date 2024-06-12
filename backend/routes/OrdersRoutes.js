import express from "express";
import {
  getAllOrders,
  getAllOrdersForUser,
  updateOrder,
} from "../controllers/OrdersController.js";

const orderRouter = express.Router();

orderRouter.post("/orders/updateOrder", updateOrder);
orderRouter.post("/orders/getAllOrdersForUser", getAllOrdersForUser);
orderRouter.post("/orders/getAllOrders", getAllOrders);


export default orderRouter;
