import { createSlice } from "@reduxjs/toolkit";
export const showP2pType = {
  p2pTrading: "p2pTrading",
  p2pExchange: "p2pExchange",
};
export const p2pExchangeType = {
  buy: "buy",
  sell: "sell",
};
const p2pTradingShowSlice = createSlice({
  name: "p2pTradingShow",
  initialState: {
    show: showP2pType.p2pTrading,
    p2pExchangeType: p2pExchangeType.buy,
  },
  reducers: {
    setShow: (state, action) => {
      state.show = action.payload.at(0);
      state.p2pExchangeType = action.payload.at(1);
    },
  },
});
export default p2pTradingShowSlice.reducer;
export const { setShow } = p2pTradingShowSlice.actions;
export const getShow = (rootState) => rootState.p2pTradingShowSlice.show;
export const getType = (rootState) =>
  rootState.p2pTradingShowSlice.p2pExchangeType;
