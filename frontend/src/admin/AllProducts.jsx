import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsAsync } from "../features/productSlice";
import Loader from "react-loaders";

const AllProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { products , isLoading } = useSelector((state) => state.product);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "All";

  const handleUpdate = (id) => {
    navigate(`/admin/update_product/${id}`);
    window.scroll(0, 0);
  };

  const handleCategoryChange = (category) => {
    navigate(`/admin/all_product?category=${category}`);
  };

  const renderPaginationLinks = () => {
    const totalPages = products?.totalPages;
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push(
        <li key={i}>
          <Link
            to={`/admin/all_product?category=${category}&page=${i}`}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 ${
              i === page ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            onClick={() => dispatch(getAllProductsAsync({ category, page: i }))}
          >
            {i}
          </Link>
        </li>
      );
    }
    return paginationLinks;
  };

  const categories = ["Skincare", "Body Care", "Haircare", "Cosmetics"];

  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(() => {
        dispatch(getAllProductsAsync({ category: "All", search: searchQuery }));
      }, 1500);
      return () => clearTimeout(timer);
    } else if (searchQuery !== undefined && searchQuery !== null) {
      dispatch(getAllProductsAsync({ category, page }));
    }
  }, [dispatch, page, category, searchQuery]);

  const handleSearch = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
  };

  return (
    <>
      <section>
        <div className="bg-[#E5E5E5] dark:bg-gray-900 mx-auto min-h-screen max-w-screen-xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-screen">
               <Loader type="ball-beat" active={true} />
            </div>
          ) : (
            <>
              <header className="flex justify-between items-center flex-wrap">
                <div className="heading">
                  <h2 className="playfair text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                    All Products
                  </h2>
                </div>

                {/* Searh Bar */}

                <form className="max-w-md mx-auto">
                  <label
                    htmlFor="default-search"
                    className="text-sm font-medium text-gray-900 sr-only dark:text-white"
                  >
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-3 h-3 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="search"
                      id="default-search"
                      placeholder="Search By Name"
                      className="block w-full ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#EC72AF] focus:border-[#EC72AF] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#EC72AF] dark:focus:border-[#EC72AF]"
                      defaultValue={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                </form>

                {/* DROPDOWN FOR SORTING PRODUCTS */}
                <div className="mt-1">
                  <div ref={dropdownRef} className="relative">
                    <button
                      className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      id="filterDropdownButton"
                      type="button"
                      onClick={toggleDropdown}
                    >
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4 mr-2 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                          fillRule="evenodd"
                        />
                      </svg>
                      Filter
                      <svg
                        aria-hidden="true"
                        className={`-mr-1 ml-1.5 w-5 h-5 transform ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>

                    {isOpen && (
                      <div
                        className="absolute right-0 mt-3 w-48 p-3 bg-white rounded-lg shadow-lg dark:bg-gray-700"
                        id="filterDropdown"
                      >
                        <ul
                          aria-labelledby="filterDropdownButton"
                          className="space-y-2 text-sm"
                        >
                          {categories.map((item) => (
                            <li
                              key={item}
                              value={item}
                              className="flex items-center text-gray-900 dark:text-gray-100 cursor-pointer"
                              onClick={() => handleCategoryChange(item)}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </header>

              {products?.productData?.length > 0 ? (
                <>
                  <ul  className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products?.productData?.map((data) => (
                      <li className="w-[300px]  rounded-md border bg-gray-200">
                        <img
                         onClick={() => handleUpdate(data?.id)}
                          src={data?.image?.downloadURL}
                          alt="Laptop"
                          className="h-[250px] cursor-pointer w-full rounded-t-md object-contain"
                        />
                        <div className="p-4">
                          <h1 className="inline-flex items-center text-lg font-semibold">
                            {data?.name}
                          </h1>
                          {data.sale_price > 0 ? (
                            <div className="flex items-center gap-x-2">
                              <h1 className="items-center text-lg font-semibold">
                                Rs. {data?.sale_price}
                              </h1>
                              <h1 className="items-center line-through text-md font-semibold">
                                {data?.price}
                              </h1>
                            </div>
                          ) : (
                            <h1 className="items-center text-lg font-semibold">
                              Rs. {data?.price}
                            </h1>
                          )}

                          {data?.stock === 0 ? (
                            <h1
                              className={`items-center px-3 py-2 my-2 rounded-lg bg-red-600 text-white text-sm font-semibold`}
                            >
                              Out of Stock
                            </h1>
                          ) : (
                            <h1
                              className={` ${
                                data?.stock <= 10
                                  ? "text-red-600"
                                  : "text-gray-800"
                              } items-center text-sm font-semibold`}
                            >
                              Stock: {data?.stock}
                            </h1>
                          )}
                          <div className="mt-4">
                            <span className="mb-2 mr-2 inline-block rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-gray-900">
                              {data?.category}
                            </span>
                            <span className="mb-2 mr-2 inline-block rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-gray-900">
                              {data?.subCategory}
                            </span>
                            <span className="mb-2 mr-2 inline-block rounded-full bg-white px-4 py-1 text-[11px] font-semibold text-gray-900">
                              {new Date(data?.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-center">
                    <nav aria-label="Page navigation example">
                      <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
                        <li>
                          {products?.page > 1 ? (
                            <Link
                              to={`/admin/all_product?category=${category}&page=${
                                page - 1
                              }`}
                              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                              <span className="sr-only">Previous</span>
                              <svg
                                className="w-2.5 h-2.5 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 1 1 5l4 4"
                                />
                              </svg>
                            </Link>
                          ) : (
                            <button
                              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg cursor-not-allowed"
                              disabled
                            >
                              <span className="sr-only">Previous</span>
                              <svg
                                className="w-2.5 h-2.5 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 1 1 5l4 4"
                                />
                              </svg>
                            </button>
                          )}
                        </li>
                        {renderPaginationLinks()}
                        <li>
                          {products?.totalPages !== page ? (
                            <Link
                              to={`/admin/all_product?category=${category}&page=${
                                page + 1
                              }`}
                              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                              <span className="sr-only">Next</span>
                              <svg
                                className="w-2.5 h-2.5 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="m1 9 4-4-4-4"
                                />
                              </svg>
                            </Link>
                          ) : (
                            <button
                              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg cursor-not-allowed"
                              disabled
                            >
                              <span className="sr-only">Next</span>
                              <svg
                                className="w-2.5 h-2.5 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="m1 9 4-4-4-4"
                                />
                              </svg>
                            </button>
                          )}
                        </li>
                      </ul>
                    </nav>
                  </div>
                </>
              ) : (
                <div className="playfair text-xl flex font-medium uppercase items-center  pt-10 ">
                  No Products
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default AllProducts;
