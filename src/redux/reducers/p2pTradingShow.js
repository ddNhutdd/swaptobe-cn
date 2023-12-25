import { createSlice } from "@reduxjs/toolkit";
export const showP2pType = {
  p2pTrading: "p2pTrading",
  p2pExchange: "p2pExchange",
};
const p2pTradingShowSlice = createSlice({
  name: "p2pTradingShow",
  initialState: {
    show: showP2pType.p2pTrading,
  },
  reducers: {
    setShow: (state, action) => {
      state.show = action.payload;
    },
  },
});
export default p2pTradingShowSlice.reducer;
export const { setShow } = p2pTradingShowSlice.actions;
export const getShow = (rootState) => rootState.p2pTradingShowSlice.show;
