import { Support } from "../models/ContactModel.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = 500;
 
    const orders = await Support.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Support.countDocuments();
    const response = {
      totalPages:Math.ceil(total / limit),
      page,
      orders,
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};



