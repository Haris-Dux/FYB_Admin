import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";

// INITIAL STATE
const initialState = {
  products: [],
  singleProduct:null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  createLoading: false,
  deleteLoading: false,
  updateLoading: false,
  message: "",
};

//API URL
const getProductsUrl = `/api/products/getProducts`;
const createProductUrl = "/api/products/addProduct";
const updateProductUrl = "/api/products/updateProduct";
const getsingleProductUrl = "/api/products/getProductById";
// const deleteProductUrl = "http://localhost:4000/api/products/deleteProduct";
// const getLatestProductUrl = "http://localhost:4000/api/products/getLatestPRoducts";

//CREATE ASYNC THUNK
export const createProductAsync = createAsyncThunk(
  "Shop/create",
  async (formdata) => {
    try {
      const response = await axios.post(createProductUrl, formdata);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// UPDATE ASYNC THUNK
export const updateProductAsync = createAsyncThunk(
  "Shop/update",
  async (formdata) => {
    try {
      const response = await axios.post(updateProductUrl, formdata);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.error);
    }
  }
);

//GET PRODUCTS
export const getAllProductsAsync = createAsyncThunk(
  "Shop/getProduts",
  async (data) => {
    const searchQuery =
      data?.search !== undefined && data?.search !== null
        ? `&search=${data?.search}`
        : "";
    try {
      const response = await axios.post(
        `${getProductsUrl}?category=${data.category}&page=${data.page}${searchQuery}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

//GET SINGLEPRODUCT
export const getsingleProductAsync = createAsyncThunk(
  "Shop/getsingleproduct",
  async (id) => {
    try {
      const response = await axios.post(getsingleProductUrl,{id});
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);


const productSlice = createSlice({
  name: "productSlice",
  initialState,
  reducers: {
    resetGoals: (state) => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(createProductAsync.pending, (state, action) => {
        state.createLoading = true;
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.createLoading = false;
      })

      .addCase(getAllProductsAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllProductsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })

      .addCase(getsingleProductAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getsingleProductAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleProduct = action.payload;
      });

    // .addCase(deleteGoalsAsync.pending, (state, action) => {
    //   // state.isLoading = true;
    //   state.deleteLoading = true;
    // })
    // .addCase(deleteGoalsAsync.fulfilled, (state, action) => {
    //   // state.isLoading = false;
    //   state.deleteLoading = false;
    //   state.isSuccess = true;
    //   state.products = state.products.filter(
    //     (product) => product._id !== action.payload.id
    //   );
    // })
  

    // .addCase(updateProductAsync.pending, (state, action) => {
    //   state.updateLoading = true;
    // })
    // .addCase(updateProductAsync.fulfilled, (state, action) => {
    //   state.updateLoading = false;
    //   state.isSuccess = true;
    // });
  },
});

export const { resetGoals } = productSlice.actions;
export default productSlice.reducer;
