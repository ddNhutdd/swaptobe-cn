import { createSlice } from "@reduxjs/toolkit";
export const actionContent = {
  main: "main",
  withdraw: "withdraw",
  desposite: "desposite",
};
const wallet2Slice = createSlice({
  name: "wallet2",
  initialState: {
    show: actionContent.main,
  },
  reducers: {
    setShow: (state, action) => {
      state.show = action.payload;
    },
  },
});
export default wallet2Slice.reducer;
export const { setShow } = wallet2Slice.actions;
export const getShow = (rootState) => rootState.wallet2Reducer.show;
