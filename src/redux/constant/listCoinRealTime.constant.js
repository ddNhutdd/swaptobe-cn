export const listCoinRealTimeConstant = {
  setListCoinRealTime: "listCoinRealTime/setListCoinRealTime",
};

export const defaultState = {
  listCoinRealTime: null,
};

export const getListCoinRealTime = (state) =>
  state.listCoinRealTimeReducer.listCoinRealTime;
