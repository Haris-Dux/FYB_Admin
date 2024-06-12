import { CouponModel } from "../models/CouponModel.js";
import { setMongoose } from "../utils/Mongoose.js";

export const createCoupun = async (req, res, next) => {
  try {
    const {
      code,
      discountAmount,
      total_limit,
      expiresAt,
      allProducts,
      categories,
      isActive,
    } = req.body;
    if (!code || !discountAmount || !total_limit || !expiresAt || !isActive)
      throw new Error("Invalid Data");
    const checkExistingCode = await CouponModel.findOne({ code });
    if (checkExistingCode) throw new Error("This coupon already exists");
    if (!allProducts && !categories)
      throw new Error("Please select all Products or choose categories");

    // if (categories === undefined || categories === null) {
    //   delete categories;
    // }

    await CouponModel.create({
      code,
      discountAmount,
      total_limit,
      expiresAt,
      allProducts,
      categories,
      isActive,
    });

    return res.status(201).json({ message: "Coupon Created" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Coupon Id Required");
    await CouponModel.findByIdAndDelete(id);
    return res.status(201).json({ message: "Coupon deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const {
      id,
      discountAmount,
      total_limit,
      isActive,
      expiresAt,
      allProducts,
      categories,
      code,
    } = req.body;
    if (!id) throw new Error("Coupon Id not found");
    const coupon = await CouponModel.findById(id);
    let updateQuery = {};
    if (discountAmount) {
      updateQuery = { ...updateQuery, discountAmount };
    }
    if (code) {
      updateQuery = { ...updateQuery, code };
    }
    if (total_limit) {
      updateQuery = { ...updateQuery, total_limit };
    }
    if (isActive !== undefined) {
      updateQuery = { ...updateQuery, isActive };
    }
    if (expiresAt) {
      updateQuery = { ...updateQuery, expiresAt };
    }
    if (categories && categories !== coupon.categories) {
      updateQuery = { ...updateQuery, categories };
      updateQuery.allProducts = null;
    }
    if (allProducts !== undefined && allProducts !== coupon.allProducts) {
      updateQuery = { ...updateQuery, allProducts };
      if (allProducts) {
        coupon.categories = null;
        updateQuery.categories = null;
      }
    }
    if (Object.keys(updateQuery).length === 0)
      throw new Error("No fields To Update");
    await CouponModel.findByIdAndUpdate(id, updateQuery, { new: true }).exec();
    return res.status(200).json({ message: "Coupon Data Updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await CouponModel.find({}).sort({ createdAt: -1 });
    setMongoose();
    return res.status(200).json(coupons);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const verifyCouponAtCheckout = async (req, res, next) => {
  try {
    const { id, code, category, userId } = req.body;
    if (!id || !code || userId) throw new Error("All Fields Required");
    const coupon = await CouponModel.findById(id);
    if (!coupon) throw new Error("Coupon Not Found");
    const checkCategory = coupon.categories.includes(category);
    if (!coupon.allProducts && !checkCategory)
      throw new Error("Invalid coupon for this category");
    if (coupon.uses_count === coupon.total_limit)
      throw new Error("Coupun Limit reached");
    const currentDate = Date.now();
    if (coupon.expiresAt >= currentDate || !coupon.isActive)
      throw new Error("Coupun Expired");
    const checkUserID = coupon.users.includes(userId);
    if (checkUserID) throw new Error("You have already used this code");
    const updatedUseCount = coupon.uses_count + 1;
    coupon.uses_count = updatedUseCount;
    coupon.users.push(userId);
    await coupon.save();
    return res.status(200).json({ message: "Coupon verified Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
