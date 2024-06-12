import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";

// INITIAL STATE
const initialState = {
  orders: [],
  isLoading: false,
};

//API URL
const getAllOrdersUrl = `/api/orders/getAllOrders`;
const updateOrdersUrl = "/api/orders/updateOrder";

export const getAllOrdersAsync = createAsyncThunk(
  "coupon/getallOrders",
  async (data) => {
    const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";
    try {
      const response = await axios.post(`${getAllOrdersUrl}?status=${data.status}&page=${data.page}${searchQuery}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const updateOrdersAsync = createAsyncThunk(
  "coupon/updateCoupon",
  async (data) => {
    try {
      const response = await axios.post(updateOrdersUrl, data);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

const orderSlice = createSlice({
  name: "orderSlice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // signup
      .addCase(getAllOrdersAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      });
  },
});

export default orderSlice.reducer;
