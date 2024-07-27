import { useEffect, useState } from "react";
import {
  getsingleProductAsync,
  updateProductAsync,
} from "../features/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "react-loaders";
import UpdateBundleDescription from "./UpdateBundleDescription";

const UpdateProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const categories = [
    "Skincare",
    "Body Care",
    "Haircare",
    "Cosmetics",
    "Bundle",
  ];

  const { singleProduct, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getsingleProductAsync(id));
  }, [id]);

  const subCategories = {
    Skincare: ["Facewash", "Serums", "Moisturiser", "Toner"],
    "Body Care": ["Shower gels", "Body butter", "Body oil", "Body scrubs"],
    Haircare: [
      "Shampoo",
      "Conditioner",
      "Mask",
      "Hair oil",
      "Hair serum",
      "Hair mist",
    ],
    Cosmetics: [],
  };

  const [formdata, setFormdata] = useState({
    name: "",
    price: "",
    sale_price: 0,
    category: "",
    subCategory: "",
    quantity: "",
    description: "",
    file: null,
    latest: false,
    productId: "",
    bundleDescription: {
      main_heading: "",
      main_description: "",
      product_details: [],
      why_choose_us: [""]
    }
  });

  useEffect(() => {
    if (singleProduct) {
      setFormdata((prevFormData) => ({
        ...prevFormData,
        name: singleProduct?.name || "",
        price: singleProduct?.price || "",
        sale_price: singleProduct?.sale_price || 0,
        category: singleProduct?.category || "",
        subCategory: singleProduct?.subCategory || "",
        quantity: singleProduct?.stock || "",
        description: singleProduct?.description || "",
        latest: singleProduct?.latest,
        productId: singleProduct.id,
        bundleDescription: {
          main_heading: singleProduct?.bundleDescription?.main_heading,
          main_description: singleProduct?.bundleDescription?.main_description,
          product_details: singleProduct?.bundleDescription?.product_details,
          why_choose_us: singleProduct?.bundleDescription?.why_choose_us
        }
      }));
    }
  }, [singleProduct]);

  console.log('formdata in parent',formdata);

  const handleChange = (e, fieldName) => {
    if (e.target.type === "file") {
      setFormdata({
        ...formdata,
        [fieldName]: e.target.files[0],
      });
    } else {
      setFormdata({
        ...formdata,
        [fieldName]: e.target.value,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormdata((prevFormData) => ({ ...prevFormData, file: file }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormdata({
      ...formdata,
      category: selectedCategory,
      subCategory: "",
    });
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = e.target.value;
    setFormdata({ ...formdata, subCategory: selectedSubCategory });
  };

  const handleCheckChange = (event) => {
    const { name, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : event.target.value;

    setFormdata({
      ...formdata,
      [name]: newValue,
    });
  };

  const validateSubCategory = () => {
    if (!formdata.category) return true;
    if (formdata.category === "Cosmetics") return true;
    if (formdata.category === "Bundle") return true;
    const validSubCategories = subCategories[formdata.category];
    return validSubCategories?.includes(formdata.subCategory);
  };

  // HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (!validateSubCategory()) {
      toast.error("Invalid subcategory for the selected category.");
      return;
    }

    // Only append fields that have been updated
    if (formdata.file && formdata.file !== singleProduct.image.downloadURL) {
      formData.append("filename", formdata.file);
    }
    if (formdata.name !== singleProduct.name) {
      formData.append("name", formdata.name);
    }
    if (formdata.price !== singleProduct.price) {
      formData.append("price", formdata.price);
    }
    if (formdata.sale_price !== singleProduct.sale_price) {
      formData.append("sale_price", formdata.sale_price);
    }
    if (formdata.category !== singleProduct.category) {
      formData.append("category", formdata.category);
    }
    if (formdata.subCategory !== singleProduct.subCategory) {
      if (formdata.category === "Cosmetics") {
        formData.append("subCategory", "null");
      } else {
        formData.append("subCategory", formdata.subCategory);
      }
    }
    if (formdata.quantity !== singleProduct.stock) {
      formData.append("stock", formdata.quantity);
    }
    if (formdata.description !== singleProduct.description) {
      formData.append("description", formdata.description);
    }
    if (formdata.latest !== singleProduct.latest) {
      formData.append("latest", formdata.latest);
    }
    if (singleProduct) {
      formData.append("productId", formdata.productId);
    }

    if (formdata.bundleDescription !== singleProduct.bundleDescription) {
      formData.append("bundleDescription", JSON.stringify(formdata.bundleDescription));
    }

    try {
      dispatch(updateProductAsync(formData)).then((res) => {
        if (res.payload.success) {
          setFormdata({
            name: "",
            price: "",
            sale_price: 0,
            category: "",
            subCategory: "",
            quantity: "",
            description: "",
            file: null,
            latest: false,
            productId: "",
            bundleDescription: {
              main_heading: "",
              main_description: "",
              product_details: [],
              why_choose_us: [""]
            }
          });
          dispatch(getsingleProductAsync(id));
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <>
      <section className="bg-[#E5E5E5] dark:bg-gray-900">
        <div className="py-8 px-18 sm:px-20 md:px-16 lg:px-14 mx-auto max-w-full lg:py-10">
          <h2 className="mb-5 playfair text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
            {singleProduct?.category !== "Bundle"
              ? "Update Product"
              : "Update Bundle"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {/* NAME */}
              <div className="">
                <label
                  className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="name"
                >
                  {singleProduct?.category === "product"
                    ? "Product Name"
                    : "Bundle Name"}
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  id="name"
                  name="name"
                  placeholder="Type product name"
                  type="text"
                  value={formdata.name}
                  onChange={(e) =>
                    setFormdata({ ...formdata, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* QUANTITY */}
              <div>
                <label
                  className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="quantity"
                >
                  Quantity
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  id="quantity"
                  name="quantity"
                  placeholder="Available quantity"
                  type="number"
                  value={formdata.quantity}
                  onChange={(e) =>
                    setFormdata({ ...formdata, quantity: e.target.value })
                  }
                  required
                />
              </div>

              {/* PRICE */}
              <div className="w-full">
                <label
                  className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="price"
                >
                  Price
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  id="price"
                  name="price"
                  placeholder="Price"
                  type="number"
                  value={formdata.price}
                  onChange={(e) =>
                    setFormdata({ ...formdata, price: e.target.value })
                  }
                  required
                />
              </div>

              {/* SALE PRICE */}
              <div className="w-full">
                <label
                  className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="sale_price"
                >
                  Sale Price
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  id="sale_price"
                  name="sale_price"
                  placeholder="Sale Price"
                  type="number"
                  value={formdata.sale_price}
                  onChange={(e) =>
                    setFormdata({ ...formdata, sale_price: e.target.value })
                  }
                />
              </div>

              {singleProduct?.category === "product" ? (
                <>
                  <div>
                    <label
                      className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white"
                      htmlFor="category"
                    >
                      Category
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      id="category"
                      value={formdata.category}
                      onChange={handleCategoryChange}
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white"
                      htmlFor="category"
                    >
                      Sub Category
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      id="subcategory"
                      value={formdata.subCategory}
                      onChange={handleSubCategoryChange}
                      disabled={!formdata.category}
                    >
                      <option value="" disabled>
                        Select subcategory
                      </option>
                      {subCategories[formdata.category]?.map((subCategory) => (
                        <option key={subCategory} value={subCategory}>
                          {subCategory}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label
                      className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white"
                      htmlFor="category"
                    >
                      Category
                    </label>

                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      id="category"
                      name="category"
                      type="text"
                      value={formdata?.category}
                    />
                  </div>
                </>
              )}

              {/* DESC */}
                {singleProduct?.category === "Bundle" ? (
                <div className="col-span-2">
                <UpdateBundleDescription  
                    formdata={formdata}
                    setFormdata={setFormdata}/>
                </div>
              ) : (
            
            <div className="sm:col-span-2">
                <label
                  className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  id="description"
                  placeholder="Your description here"
                  rows="3"
                  value={formdata.description}
                  onChange={(e) =>
                    setFormdata({ ...formdata, description: e.target.value })
                  }
                />
              </div> )}

              {/* LATEST PRODUCTS */}
              {singleProduct?.category === "product" ? (
                <div className="flex items-center">
                  <input
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    defaultValue=""
                    id="default-checkbox"
                    type="checkbox"
                    name="latest"
                    checked={formdata.latest}
                    onChange={handleCheckChange}
                  />
                  <label
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    htmlFor="default-checkbox"
                  >
                    Latest Products
                  </label>
                </div>
              ) : null}

              {/* IMAGE */}
              {singleProduct?.image && (
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-center w-full relative">
                    <div className="flex flex-col py-2 items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg  bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                      <img
                        src={
                          formdata.file
                            ? URL.createObjectURL(formdata.file)
                            : singleProduct?.image?.downloadURL
                        }
                        // src={singleProduct?.image?.downloadURL}
                        alt="Product Image"
                        className="h-full"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-center w-full">
                        <label
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                          htmlFor="dropzone-file"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              aria-hidden="true"
                              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                              fill="none"
                              viewBox="0 0 20 16"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload New Image
                              </span>{" "}
                            </p>
                            <p className="text-xs px-5  text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                          </div>
                          <input
                            className="hidden"
                            id="dropzone-file"
                            type="file"
                            onChange={(e) => handleChange(e, "file")}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isLoading ? (
              <button
                disabled={isLoading}
                type="button"
                className={`w-36 flex cursor-not-allowed justify-center items-center px-5 py-2.5 mt-2 sm:mt-5 text-sm font-medium text-center`}
              >
                <Loader type="ball-beat" active={true} />
              </button>
            ) : (
              <button
                type="submit"
                className="w-36 flex justify-center items-center px-5 py-2.5 mt-2 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800"
              >
                Update product
              </button>
            )}
          </form>
        </div>
      </section>
    </>
  );
};

export default UpdateProduct;
