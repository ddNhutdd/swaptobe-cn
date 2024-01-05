import { createSlice } from "@reduxjs/toolkit";
const adsSideType = {
  buy: "buy",
  sell: "sell",
};
const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    initialTransaction: {
      amount: 0,
      adsSide: null,
    },
  },
  reducers: {
    setTransaction: (state, action) => {
      state.initialTransaction = action.payload;
    },
  },
});
export default transactionSlice.reducer;
export const { setTransaction } = transactionSlice.actions;
export const getInitialTransaction = (rootstate) =>
  rootstate.transactionSlice.initialTransaction;
