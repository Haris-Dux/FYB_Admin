import { useNavigate } from "react-router-dom";
// import product from "./ProductData";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllOrdersAsync } from "../features/orderSlice";
import {
  SalesStatisticsAsync,
  getOrderCountsByMonthsAsync,
  getOrderProgressAsync,
  monthlyOrdersAsync,
} from "../features/DashBoardSlice";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

const AllProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const  isLoading  = useSelector((state) => state.product.isLoading);
  const salesData = useSelector((state) => state.dashboard.SalesStatistics);
  const ordersData = useSelector((state) => state.dashboard.monthlyOrders);
  const orderProgress = useSelector((state) => state.dashboard.OrderProgress);
  const monthlyOrdersData = useSelector((state) => state.dashboard.OrdersByMonth);
  const orders = useSelector((state) => state.order.orders);

  const page =  1;
  const status = "Pending";

  useEffect(() => {
    dispatch(getAllOrdersAsync({ status, page }));
  }, [dispatch, status, page]);


  useEffect(() => {
    dispatch(SalesStatisticsAsync());
    dispatch(monthlyOrdersAsync());
    dispatch(getOrderProgressAsync());
    dispatch(getOrderCountsByMonthsAsync());
  }, []);

  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );

  const chartData = {
    labels: ["Pending", "Delivered", "Dispatched", "Cancelled"],
    datasets: [
      {
        label: "%",
        data: [
          orderProgress?.Pending || 0,
          orderProgress?.Delivered || 0,
          orderProgress?.Dispatched || 0,
          orderProgress?.Cancelled || 0,
        ],
        backgroundColor: [
          "rgb(205, 120, 3)",
          "rgb(74, 165, 123)",
          "rgb(63, 131, 248)",
          "rgb(242, 82, 82)",
        ],
        borderColor: [
          "rgb(205, 120, 3)",
          "rgb(74, 165, 123)",
          "rgb(63, 131, 248)",
          "rgb(242, 82, 82)",
        ],
        borderWidth: 1,
        borderRadius: 5,
        spacing: 5,
        cutout: 0,
      },
    ],
  };

  const barChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Orders",
        data: monthlyOrdersData ? Object.values(monthlyOrdersData) : [],
        backgroundColor: "rgb(255, 241, 247)",
        borderColor: "rgb(236, 114, 175)",
        borderWidth: 1,
        borderRadius: 3
      },
    ],
  };

  const handleOrderPage = () => {
    navigate(`/admin/view_orders`);
    window.scroll(0, 0);
  };

  const handleOrderDetails = (id) => {
    navigate(`/admin/orderDetail/${id}`);
    window.scroll(0, 0);
  };

  return (
    <>
      {isLoading ? (
        <>
          <div
            className="mx-auto flex justify-center items-center h-screen max-w-screen-xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
            role="status"
          >
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <div className="loader-pink"></div>
          </div>
        </>
      ) : (
        <>
          <section className="bg-[#E5E5E5] dark:bg-gray-900 min-h-screen py-8 sm:py-10 mx-auto max-w-screen-xl px-4 lg:px-10">
            {/* ------------ FIRST STATS BAR ------------*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:gap-4">
              {/* FIRST BOX */}
              <div className="px-5 h-36 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex justify-between items-center">
                <div className="img">
                  <img
                    className="w-20"
                    src="https://cdn.shopify.com/s/files/1/0852/5099/8550/files/Group_230.png?v=1714765888"
                    alt=""
                  />
                </div>

                <div className="stat_data">
                  <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                    Total Sales
                  </h3>
                  <h2 className="text-gray-900 dark:text-gray-100 mt-1.5 text-2xl font-semibold">
                    {salesData?.totalSales}
                  </h2>
                  <p className="text-gray-900 mt-1.5 bg-[#FDEDF5] text-sm px-3 py-1 w-16 rounded-lg">
                    {salesData?.salesDifference}
                  </p>
                </div>
              </div>
              {/* SECOND BOX */}
              <div className="px-5 h-36 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex justify-between items-center">
                <div className="img">
                  <img
                    className="w-20"
                    src="https://cdn.shopify.com/s/files/1/0852/5099/8550/files/Group_230.png?v=1714765888"
                    alt=""
                  />
                </div>

                <div className="stat_data">
                  <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                    Last Month
                  </h3>
                  <h2 className="text-gray-900 dark:text-gray-100 mt-1.5 text-2xl font-semibold">
                    {salesData?.lastMonthSales}
                  </h2>
                  {/* <p className="text-gray-900 mt-1.5 bg-[#FDEDF5] text-sm px-3 py-1 w-16 rounded-lg">
                    +1.5k
                  </p> */}
                </div>
              </div>
              {/* THIRD BOX */}
              <div className="px-5 h-36 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex justify-between items-center">
                <div className="img">
                  <img
                    className="w-20"
                    src="https://cdn.shopify.com/s/files/1/0852/5099/8550/files/Group_230.png?v=1714765888"
                    alt=""
                  />
                </div>

                <div className="stat_data">
                  <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                    This Month
                  </h3>
                  <h2 className="text-gray-900 dark:text-gray-100 mt-1.5 text-2xl font-semibold">
                    {salesData?.currentMonthSales}
                  </h2>
                  {/* <p className="text-gray-900 mt-1.5 bg-[#FDEDF5] text-sm px-3 py-1 w-16 rounded-lg">
                    +1.5k
                  </p> */}
                </div>
              </div>
              {/* FORTH BOX */}
              <div className="px-5 h-36 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex justify-between items-center">
                <div className="img">
                  <img
                    className="w-20"
                    src="https://cdn.shopify.com/s/files/1/0852/5099/8550/files/Group_72066.png?v=1714765889"
                    alt=""
                  />
                </div>

                <div className="stat_data">
                  <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                    Orders
                  </h3>
                  <h2 className="text-gray-900 dark:text-gray-100 mt-1.5 text-2xl font-semibold">
                    {ordersData?.TotalOrders}
                  </h2>
                  <p className="text-gray-900 mt-1.5 bg-[#FDEDF5] text-sm px-3 py-1 w-16 rounded-lg">
                    +{ordersData?.currentMonthOrders}
                  </p>
                </div>
              </div>
            </div>

            {/* ------------ SECOND STATS BAR ------------*/}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4">
              <div className="rounded-lg md:col-span-1 lg:col-span-4 xl:col-span-3">
                <div className="h-72 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 w-full p-4">
                  <Bar
                    data={barChartData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>

              <div className=" pt-5 lg:col-span-5 xl:col-span-1  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-400 dark:border-gray-700">
                <div>
                  <Doughnut data={chartData} options={{ responsive: true }} />
                </div>
              </div>
            </div>

            {/* TABLES */}
            <div className="mt-12 overflow-x-auto ">
              <div className=" header">
                <h2 className="playfair mb-3 text-2xl dark:text-gray-100 font-semibold uppercase tracking-wider">
                  Recent Orders
                </h2>
              </div>

              <table className="w-full text-sm text-left  text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-100 tracking-wide border-b border-gray-400">
                  <tr>
                    <th className="px-5 py-4" scope="col">
                      Sr
                    </th>
                    <th className="px-7 py-4" scope="col">
                      Order ID
                    </th>
                    <th className="px-7 py-4" scope="col">
                      Date
                    </th>
                    <th className="px-7 py-4" scope="col">
                      Phone
                    </th>
                    <th className="px-7 py-4" scope="col">
                      Amount
                    </th>
                    <th className="px-7 py-4" scope="col">
                      Order Progress
                    </th>
                    <th className="px-7 py-4" scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-gray-50 dark:bg-gray-800">
                  {orders?.orders?.slice(0, 10).map((data, index) => (
                    <tr
                      key={index}
                      onClick={() => handleOrderDetails(data?.id)}
                      className="border-b dark:border-gray-700 cursor-pointer"
                    >
                      <th
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        scope="row"
                      >
                        {index + 1}
                      </th>
                      <td className="px-7 py-4">{data.OrderID}</td>
                      <td className="px-7 py-4">
                        {new Date(data?.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-7 py-4">{data.phone}</td>
                      <td className="px-7 py-4">{data.totalAmount}</td>
                      <td className="px-7 py-4 text-[#BB6D00]">{data.orderProgress}</td>
                      <td className="px-7 py-4 flex items-center justify-end"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default AllProducts;
