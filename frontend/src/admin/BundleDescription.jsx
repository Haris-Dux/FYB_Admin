import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const BundleDescription = ({ formdata, setFormdata }) => {
  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      bundleDescription: {
        ...formdata.bundleDescription,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleWhyChooseUsChange = (e, index) => {
    const newWhyChooseUs = formdata.bundleDescription?.why_choose_us?.map(
      (why, i) => (i === index ? e.target.value : why)
    );
    setFormdata({
      ...formdata,
      bundleDescription: {
        ...formdata.bundleDescription,
        why_choose_us: newWhyChooseUs,
      },
    });
  };

  const handleAddWhyChooseUs = () => {
    setFormdata({
      ...formdata,
      bundleDescription: {
        ...formdata.bundleDescription,
        why_choose_us: [
          ...(formdata.bundleDescription?.why_choose_us || []),
          "",
        ],
      },
    });
  };

  const handleDeletewhy_choose_us = (index) => {
    const newWhyChooseUs = formdata.bundleDescription?.why_choose_us?.filter(
      (_, i) => i !== index
    );
    setFormdata({
      ...formdata,
      bundleDescription: {
        ...formdata.bundleDescription,
        why_choose_us: newWhyChooseUs,
      },
    });
  };

  const handleAddKeyBenefit = (productIndex) => {
    const updatedProductDetails =
      formdata.bundleDescription.product_details.map((product, index) =>
        index === productIndex
          ? { ...product, key_benefits: [...(product.key_benefits || []), ""] }
          : product
      );
    setFormdata({
      ...formdata,
      bundleDescription: {
        ...formdata.bundleDescription,
        product_details: updatedProductDetails,
      },
    });
  };

  const handleKeyBenefitChange = (e, productIndex, benefitIndex) => {
    const updatedProductDetails =
      formdata.bundleDescription.product_details.map((product, index) => {
        if (index === productIndex) {
          const updatedKeyBenefits = product.key_benefits.map((benefit, i) =>
            i === benefitIndex ? e.target.value : benefit
          );
          return { ...product, key_benefits: updatedKeyBenefits };
        }
        return product;
      });
    setFormdata({
      ...formdata,
      bundleDescription: {
        ...formdata.bundleDescription,
        product_details: updatedProductDetails,
      },
    });
  };

  const handleDeleteKeyBenefit = (productIndex, benefitIndex) => {
    const updatedProductDetails =
      formdata.bundleDescription.product_details.map((product, index) => {
        if (index === productIndex) {
          const updatedKeyBenefits = product.key_benefits.filter(
            (_, i) => i !== benefitIndex
          );
          return { ...product, key_benefits: updatedKeyBenefits };
        }
        return product;
      });
    setFormdata({
      ...formdata,
      bundleDescription: {
        ...formdata.bundleDescription,
        product_details: updatedProductDetails,
      },
    });
  };

  const handleProductDetailChange = (e, productIndex) => {
    const { name, value } = e.target;
    const updatedProductDetails =
      formdata.bundleDescription.product_details.map((product, index) =>
        index === productIndex ? { ...product, [name]: value } : product
      );
    setFormdata({
      ...formdata,
      bundleDescription: {
        ...formdata.bundleDescription,
        product_details: updatedProductDetails,
      },
    });
  };

  const handleAddProducts = () => {
    setFormdata({
      ...formdata,
      bundleDescription: {
        ...formdata.bundleDescription,
        product_details: [
          ...(formdata.bundleDescription?.product_details || []),
          {
            name: "",
            description: "",
            key_ingrediants: "",
            key_benefits: [""],
          },
        ],
      },
    });
  };

  const handleDeleteProduct = (productIndex) => {
    const newProduct = formdata.bundleDescription.product_details.filter(
      (_, i) => i !== productIndex
    );
    setFormdata({
      ...formdata,
      bundleDescription: {
        product_details: newProduct,
      },
    });
  };

  return (
    <div className="border border-double border-[#EC72AF] p-4 grid gap-4 sm:grid-cols-2 sm:gap-6">
      <div>
        <h3 className="text-lg font-semibold">Bundle Details</h3>

        <div className="border border-dotted border-[#EC72AF] p-2">
          {/* MAIN HEADING */}
          <div className="mb-4">
            <label className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
              Main Heading
            </label>
            <input
              type="text"
              name="main_heading"
              value={formdata.bundleDescription.main_heading}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3"
              required
            />
          </div>

          {/* MAIN DESCRIPTION */}
          <div className="mb-4">
            <label className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
              Main Description
            </label>
            <textarea
              name="main_description"
              value={formdata.bundleDescription.main_description}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3"
              rows="4"
              onChange={handleChange}
              required
            />
          </div>

          {/* WHY CHOOSE US */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Why Choose Us</h3>

            {formdata.bundleDescription?.why_choose_us?.map((why, index) => (
              <div className="flex item-center justify-center gap-x-2 ">
                <input
                  key={index}
                  type="text"
                  value={why}
                  onChange={(e) => handleWhyChooseUsChange(e, index)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full mb-2"
                  required
                />
                <MdDeleteOutline
                  onClick={() => handleDeletewhy_choose_us(index)}
                  className="size-8 cursor-pointer text-red-600"
                />
              </div>
            ))}

            <button
              type="button"
              className="w-auto flex items-center justify-center gap-2 px-5 py-2.5 mt-2 sm:mt-2 text-sm font-medium text-center text-white bg-[#EC72AF] hover:bg-[#b4487e]"
              onClick={handleAddWhyChooseUs}
            >
              <FaPlus className="size-3 cursor-pointer text-white" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Bundle Product Details</h3>

        {formdata.bundleDescription?.product_details?.map(
          (product, productIndex) => (
            <div
              key={productIndex}
              className="border border-dotted border-[#EC72AF] p-2 mb-6 "
            >
              {/* NAME */}
              <div className="mb-4">
                <div className="flex justify-between">
                  <label className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
                    Product Name
                  </label>
                  <RxCross2
                    onClick={() => handleDeleteProduct(productIndex)}
                    className="text-red-600 stroke-1 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={(e) => handleProductDetailChange(e, productIndex)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3"
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div className="mb-4">
                <label className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
                  Product Description
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={(e) => handleProductDetailChange(e, productIndex)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3"
                  rows="4"
                  required
                />
              </div>

              {/* KEY BENFITS */}
              <div className="mb-4">
                <label className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
                  Key Benefits
                </label>

                {product.key_benefits.map((benefit, benefitIndex) => (
                  <div
                    key={benefitIndex}
                    className="flex item-center justify-center gap-x-2 "
                  >
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) =>
                        handleKeyBenefitChange(e, productIndex, benefitIndex)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full  mb-2"
                      required
                    />
                    <MdDeleteOutline
                      onClick={() =>
                        handleDeleteKeyBenefit(productIndex, benefitIndex)
                      }
                      className="size-8  cursor-pointer text-red-600"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  className="w-auto flex items-center justify-center gap-2 px-5 py-2.5 mt-2 sm:mt-2 text-sm font-medium text-center text-white bg-[#EC72AF] hover:bg-[#b4487e]"
                  onClick={() => handleAddKeyBenefit(productIndex)}
                >
                  <FaPlus className="size-3 cursor-pointer text-white" />
                  Add
                </button>
              </div>

              {/* KEY INGREDIENTS */}
              <div className="mb-4">
                <label className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
                  Key Ingredients
                </label>
                <input
                  type="text"
                  name="key_ingrediants"
                  value={product.key_ingrediants}
                  onChange={(e) => handleProductDetailChange(e, productIndex)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3"
                  required
                />
              </div>
            </div>
          )
        )}

        <button
          type="button"
          onClick={handleAddProducts}
          className="w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-center text-white bg-[#EC72AF] hover:bg-[#b4487e]"
        >
         <FaPlus className="size-3 cursor-pointer text-white" />
         Add
        </button>
      </div>
    </div>
  );
};

export default BundleDescription;
