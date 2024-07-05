import { ProductsModel } from "../models/Products.Model.js";
import {
  deleteImageFromFirebase,
  uploadImageToFirebase,
} from "../utils/Firebase.js";
import { setMongoose } from "../utils/Mongoose.js";

export const addProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      sale_price,
      stock,
      category,
      subCategory,
      latest,
    } = req.body;
    if (!name || !description || !price || !stock || !category)
      throw new Error("Please provide all required fields");
    if (parseFloat(price) <= 0) {
      throw new Error("Price must be greater than 0");
    }
    if (parseFloat(stock) <= 0) {
      throw new Error("Stock must be greater than 0");
    }

    if (parseFloat(sale_price) && parseFloat(sale_price) < 0) {
      throw new Error("Sale price must be 0 or greater");
    }
    if (parseFloat(sale_price) >= parseFloat(price)) {
      throw new Error("Sale price must be less than the original price");
    }
    if (parseFloat(sale_price) <= 0 && parseFloat(price) <= 0) {
      throw new Error("Both Sale price and Price cannot be 0");
    }
    const file = req.file;
    if (!file) throw new Error("Please provide a file");
    const result = await uploadImageToFirebase(file, "FYB Images");
    const imageData = {
      downloadURL: result.downloadURL,
      name: result.name,
      type: result.type,
    };
    await ProductsModel.create({
      name,
      description,
      price,
      stock,
      image: imageData,
      category,
      subCategory,
      sale_price,
      latest,
    });
    return res.status(200).json({ message: "Product Added Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const {
      productId,
      name,
      description,
      price,
      sale_price,
      stock,
      category,
      subCategory,
      latest,
    } = req.body;
    const product = await ProductsModel.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    if (parseFloat(price) <= 0) {
      throw new Error("Price must be greater than 0");
    }
    if (parseFloat(stock) <= 0) {
      throw new Error("Stock must be greater than 0");
    }

    if (parseFloat(sale_price) && parseFloat(sale_price) < 0) {
      throw new Error("Sale price must be 0 or greater");
    }
    if (parseFloat(sale_price) >= parseFloat(product.price)) {
      throw new Error("Sale price must be less than the original price");
    }
    if (parseFloat(sale_price) <= 0 && parseFloat(price) <= 0) {
      throw new Error("Both Sale price and Price cannot be 0");
    }
    let updateQuery = {};
    if (name) {
      updateQuery = { ...updateQuery, name };
    }
    if (description) {
      updateQuery = { ...updateQuery, description };
    }
    if (price) {
      updateQuery = { ...updateQuery, price };
    }
    if (sale_price) {
      updateQuery = { ...updateQuery, sale_price };
    } 
    if (stock) {
      updateQuery = { ...updateQuery, stock };
    } 
    if (category) {
      updateQuery = { ...updateQuery, category };
    }
    if (subCategory) {
      updateQuery = { ...updateQuery, subCategory };
    }
    if (latest) {
      updateQuery = { ...updateQuery, latest };
    }
    const file = req.file;
    if (file) {
      let imageData = {};
      const result = await uploadImageToFirebase(file, "FYB Images");
      imageData = {
        downloadURL: result.downloadURL,
        name: result.name,
        type: result.type,
      };
      if (imageData.downloadURL && product.image.downloadURL) {
        await deleteImageFromFirebase(product.image.downloadURL);
      }
      if(imageData){
        updateQuery = { ...updateQuery, image:imageData };
      }
    }
    if (Object.keys(updateQuery).length === 0)
      throw new Error("No fileds Updated");
    await ProductsModel.findByIdAndUpdate({ _id: productId }, updateQuery);
    return res.status(200).json({ success:true , message: "Product Updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const {id} = req.body;
    if (!id) throw new Error("Product Id not Found");
    const product = await ProductsModel.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    await deleteImageFromFirebase(product.image.downloadURL);
    await ProductsModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted Succesfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getLatestPRoducts = async (req, res, next) => {
  try {
    const products = await ProductsModel.aggregate([
      { $match: { latest: true } },
      { $sample: { size: 12 } },
    ]);
    setMongoose();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = 15;
    let search = req.query.search || "";
    let category = req.query.category || "All";

    let query = {
      name: { $regex: search, $options: "i" }
    };

    if (category !== "All") {
      query.category = category;
    }
   
    const productData = await ProductsModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({createdAt:-1})

    const total = await ProductsModel.countDocuments(query);

    const response = {
      totalPages:Math.ceil(total / limit),
      page,
      productData,
    };
    setMongoose()
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Product Id Required");
    const product = await ProductsModel.findById(id);
    setMongoose();
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

