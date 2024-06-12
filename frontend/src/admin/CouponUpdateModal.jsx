import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoupunAsync, updateCoupunAsync } from "../features/couponSlice";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import Loader from "react-loaders";

const CouponUpdateModal = ({ updatedCouponId, openModal, setOpenModal }) => {
  const dispatch = useDispatch();

  // Getting all coupons
  const coupons = useSelector((state) => state.coupons.coupon);
  const isLoading = useSelector((state) => state.coupons.isLoading);

  // Selected coupon
  const selectedCoupon = coupons.filter((data) => data.id === updatedCouponId);

  const [updateFormData, setUpdateFormData] = useState({
    code: "",
    expiresAt: "",
    discountAmount: "",
    total_limit: "",
    categories: "",
    allProducts: false,
    isActive: false,
  });

  useEffect(() => {
    if (selectedCoupon.length > 0) {
      const coupon = selectedCoupon[0];
      setUpdateFormData({
        code: coupon.code || "",
        expiresAt: coupon.expiresAt || "",
        discountAmount: coupon.discountAmount || "",
        total_limit: coupon.total_limit || "",
        categories: coupon.categories || "",
        allProducts: coupon.allProducts || false,
        isActive: coupon.isActive || false,
      });
    }
  }, [updatedCouponId,coupons]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0];
  };

  // HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (updateFormData.allProducts) {
      dispatch(
        updateCoupunAsync({ id: updatedCouponId, ...updateFormData })
      ).then((res) => {
        if (res.payload.message === "Coupon Data Updated") {
          dispatch(getAllCoupunAsync());
        }
        setOpenModal(false);
        selectedCoupon = null
      });
    } else if (
      updateFormData.allProducts === false &&
      updateFormData.categories.length === 0
    ) {
      toast.error("Choose Category");
      setOpenModal(true);
    } else {
      dispatch(
        updateCoupunAsync({ id: updatedCouponId, ...updateFormData })
      ).then((res) => {
        if (res.payload.message === "Coupon Data Updated") {
          dispatch(getAllCoupunAsync());
        }
        setOpenModal(false);
        selectedCoupon = null
      });
    }
  };

  const categories = ["Skincare", "Body Care", "Haircare", "Cosmetics"];

  return (
    <>
      {/* BACKDROP */}
      <div
        id="modalBackdrop"
        className={`${
          openModal ? "fixed inset-0 bg-black opacity-60 z-40" : "hidden"
        }`}
      ></div>

      <div
        id="updateProductModal"
        tabIndex="-1"
        aria-hidden={!openModal}
        className={`${
          openModal ? "fixed" : "hidden"
        } overflow-y-auto overflow-x-hidden inset-0 z-50 flex justify-center items-center`}
      >
        <div className="bg-white rounded-lg shadow-lg dark:bg-gray-800 w-full max-w-2xl">
          <div className="p-4 sm:p-5">
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Update Coupon
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setOpenModal(false)}
              >
                <RxCross2 size={22} />
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 sm:grid-cols-2">
                <div className="mt-2.5">
                  <label
                    htmlFor="code"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    id="code"
                    value={updateFormData.code}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        code: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Coupon Code"
                  />
                </div>

                <div className="mt-2.5">
                  <label
                    htmlFor="expiresAt"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Expire At
                  </label>
                  <input
                    type="date"
                    name="expiresAt"
                    id="expiresAt"
                    value={formatDate(updateFormData.expiresAt)}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        expiresAt: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                </div>

                <div className="mt-2.5">
                  <label
                    htmlFor="discount"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Discount Amount
                  </label>
                  <input
                    type="number"
                    name="discount"
                    id="discount"
                    value={updateFormData.discountAmount}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        discountAmount: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Discount Amount"
                  />
                </div>

                <div className="mt-2.5">
                  <label
                    htmlFor="total_limit"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Use Limit
                  </label>
                  <input
                    type="number"
                    name="total_limit"
                    id="total_limit"
                    value={updateFormData.total_limit}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        total_limit: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Uses Limit"
                  />
                </div>

                <div className="mt-2.5">
                  <label
                    htmlFor="categories"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    categories
                  </label>
                  <select
                    name="categories"
                    id="categories"
                    value={updateFormData.categories}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        categories: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option key={categories} value={categories}>
                      Select
                    </option>
                    {categories.map((categories) => (
                      <option key={categories} value={categories}>
                        {categories}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-2.5 pt-6 flex items-center space-x-4">
                  <label
                    htmlFor="allProducts"
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      id="allProducts"
                      checked={updateFormData.allProducts}
                      onChange={() =>
                        setUpdateFormData({
                          ...updateFormData,
                          allProducts: !updateFormData.allProducts,
                        })
                      }
                      className="size-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      All Products
                    </span>
                  </label>

                  <label htmlFor="isActive" className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={updateFormData.isActive}
                      onChange={() =>
                        setUpdateFormData({
                          ...updateFormData,
                          isActive: !updateFormData.isActive,
                        })
                      }
                      className="size-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Is Active
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex items-center space-x-4">
                {isLoading ? (
                  <Loader type="ball-beat" active={true} />
                ) : (
                  <button
                    type="submit"
                    className="text-white cursor-pointer bg-[#EC72AF] hover:bg-[#d64c91] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#EC72AF] dark:hover:bg-[#EC72AF] dark:focus:ring-[#EC72AF]"
                  >
                    Update Coupon
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponUpdateModal;
