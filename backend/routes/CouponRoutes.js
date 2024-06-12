import express from "express";
import {
  createCoupun,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
  verifyCouponAtCheckout,
} from "../controllers/CouponController.js";

const couponRouter = express.Router();

couponRouter.post("/coupons/createCoupun", createCoupun);
couponRouter.post("/coupons/deleteCoupon", deleteCoupon);
couponRouter.post("/coupons/updateCoupon", updateCoupon);
couponRouter.post("/coupons/verifyCouponAtCheckout", verifyCouponAtCheckout);
couponRouter.post("/coupons/getAllCoupons", getAllCoupons);

export default couponRouter;
