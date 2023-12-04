import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import reduxThunk from "redux-thunk";
import { chartReducer } from "./reducers/chartReducer";
import { coinReducer } from "./reducers/coinReducer";
import { loginReducer } from "./reducers/loginReducer";
import { resReducer } from "./reducers/resReducer";
import { seresoWalletReducer } from "./reducers/seresoWallet";
import { currencyReducer } from "./reducers/currencyReducer";

const rootReducer = combineReducers({
  coinReducer,
  loginReducer,
  chartReducer,
  resReducer,
  seresoWalletReducer,
  currencyReducer,
});

const middleWare = applyMiddleware(reduxThunk);
const customCompose = compose(middleWare);

const store = createStore(rootReducer, customCompose);

export default store;
