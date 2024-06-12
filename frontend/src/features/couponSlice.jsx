import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";

// INITIAL STATE
const initialState = {
  coupon: [],
  isLoading: false,
};

//API URL
const createCoupunUrl = "/api/coupons/createCoupun";
const getAllCoupunUrl = "/api/coupons/getAllCoupons";
const updateCoupunUrl = "/api/coupons/updateCoupon";
const deleteCoupunUrl = "/api/coupons/deleteCoupon";

// Register Function
export const createCoupunAsync = createAsyncThunk(
  "coupon/createCoupon",
  async (formData) => {
    try {
      const response = await axios.post(createCoupunUrl, formData);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const updateCoupunAsync = createAsyncThunk(
  "coupon/updateCoupon",
  async (formData) => {
    try {
      const response = await axios.post(updateCoupunUrl, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const getAllCoupunAsync = createAsyncThunk(
  "coupon/getallCoupon",
  async () => {
    try {
      const response = await axios.post(getAllCoupunUrl);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const deleteCoupunAsync = createAsyncThunk(
  "coupon/deleteCoupon",
  async (id) => {
    try {
      const response = await axios.post(deleteCoupunUrl, id);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

const couponSlice = createSlice({
  name: "couponSlice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(createCoupunAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createCoupunAsync.fulfilled, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getAllCoupunAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllCoupunAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupon = action.payload;
      })

      .addCase(updateCoupunAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateCoupunAsync.fulfilled, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default couponSlice.reducer;
