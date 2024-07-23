import { OrdersModel } from "../models/OrdersModel.js";
import { UserModel } from "../models/User.Model.js";
import { setMongoose } from "../utils/Mongoose.js";
import { sendEmail } from "../utils/nodemailer.js";

export const updateOrder = async (req, res, next) => {
  try {
    const { id, orderProgress, address, phone } = req.body;
    let orderQuery = {};
    if (!id) {
      throw new Error("No ID Provided");
    }
    const order = await OrdersModel.findOne({ _id: id });
    const user = await UserModel.findOne({ _id: order.userID });
    if (!order) {
      throw new Error("No Order Data Found");
    };
    if (address) {
      orderQuery = { ...orderQuery, address };
    };
    if (phone) {
      orderQuery = { ...orderQuery, phone };
    };
    if (orderProgress) {
      orderQuery = { ...orderQuery, orderProgress };
    };
    if (Object.keys(orderQuery).length === 0)
      throw new Error("No fileds Updated");
    await OrdersModel.findByIdAndUpdate(id, orderQuery);
    await sendEmail({email:user.email,orderProgress,orderId:order.OrderID,subject:"Order Status Updated"});
    return res.status(200).json({ message: "Order Data Updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllOrdersForUser = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("You must provide an Id");
    const orders = await OrdersModel.find({ id }).sort({ createdAt: -1 });
    setMongoose();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    let search = req.query.search || "";
    let orderProgress = req.query.status || "All";

    let query = {
      OrderID: { $regex: search, $options: "i" },
    };

    if (orderProgress !== "All") {
      query.orderProgress = orderProgress;
    }

    const orders = await OrdersModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await OrdersModel.countDocuments(query);

    const response = {
      totalPages: Math.ceil(total / limit),
      page,
      orders,
    };
    setMongoose();
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: error.message });
  }
};




