/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import CreateBuySell from "./components/CreateBuySell";
import Login from "./components/Login";
import P2PTrading from "./components/P2PTrading";
import Signup from "./components/Signup";
import Swap from "./components/Swap";
import Wallet from "./components/Wallet";
import ScrollToTop from "./ScrollToTop";
import MainTemplate from "./templates/MainTemplate";
import SwaptobeWallet from "./components/seresoWallet";
import Profile from "./components/profile";
import Dashboard from "./components/admin/dashboard";
import AdminTemplate from "./templates/AdminTemplate";
import Home from "./components/home/index.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  getExchange as getExchangeApi,
  getWalletApi,
} from "./util/userCallApi";
import { currencySetExchange } from "./redux/actions/currency.action";
import { getFetchExchangeCount } from "./redux/constant/currency.constant";
import socket from "./util/socket";
import { setListCoinRealtime } from "./redux/actions/listCoinRealTime.action";
import { userWalletFetchCount } from "./redux/constant/coin.constant";
import { coinUserWallet } from "./redux/actions/coin.action";
import { roundDecimalValues } from "./util/common";
import KYC from "./components/admin/kycUsers";
import {
  getExchangeRateDisparityFetchCount,
  setExchangeRateDisparity,
  setExchangeRateDisparityApiStatus,
} from "./redux/reducers/exchangeRateDisparitySlice";
import { exchangeRateDisparity as exchangeRateDisparityCallApi } from "src/util/userCallApi";
import ExchangeRateDisparity from "./components/admin/exchangeRateDisparity";
import { api_status, url } from "./constant";
import Ads from "./components/admin/ads";
import Transaction from "./components/transaction";
import Confirm from "./components/confirm";
import AdsHistory from "./components/adsHistory";
function App() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  const fetchExchangeCount = useSelector(getFetchExchangeCount);
  const userWalletFetch = useSelector(userWalletFetchCount);
  const getExchangeRateDisparityFetch = useSelector(
    getExchangeRateDisparityFetchCount
  );
  const getExchange = function () {
    getExchangeApi()
      .then((resp) => {
        dispatch(currencySetExchange(resp.data.data));
      })
      .catch((error) => console.log(error));
  };
  const getUserWallet = function () {
    const listAllCoinPromise = new Promise((resolve) => {
      socket.once("listCoin", (res) => {
        resolve(res);
      });
    });
    //
    listAllCoinPromise.then((listAllCoin) => {
      getWalletApi()
        .then((resp) => {
          const apiResp = resp.data.data;
          const result = {};
          for (const [name, value] of Object.entries(apiResp)) {
            let price =
              listAllCoin.filter(
                (item) =>
                  item.name === name.replace("_balance", "").toUpperCase()
              )[0]?.price ?? 0;
            result[name] = roundDecimalValues(value, price);
          }
          if (Object.keys(result)) dispatch(coinUserWallet(result));
        })
        .catch((error) => console.log(error));
    });
  };
  const getExchangeRateDisparityApi = function () {
    dispatch(setExchangeRateDisparityApiStatus(api_status.fetching));
    exchangeRateDisparityCallApi({
      name: "exchangeRate",
    })
      .then((resp) => {
        const rate = resp.data.data[0].value;
        dispatch(setExchangeRateDisparity(rate));
      })
      .catch((error) => {
        dispatch(setExchangeRateDisparityApiStatus(api_status.rejected));
        console.log(error);
      });
  };
  useEffect(() => {
    if (localStorage.getItem("user")) {
      const expiresInRefreshToken = JSON.parse(
        localStorage.getItem("user")
      ).expiresInRefreshToken;
      if (expiresInRefreshToken < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    //
    socket.connect();
    socket.on("listCoin", (resp) => {
      dispatch(setListCoinRealtime(resp));
    });
    //
    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    getExchange();
  }, [fetchExchangeCount]);
  useEffect(() => {
    isLogin && getUserWallet();
  }, [userWalletFetch, isLogin]);
  useEffect(() => {
    getExchangeRateDisparityApi();
  }, [getExchangeRateDisparityFetch]);
  return (
    <BrowserRouter>
      <ScrollToTop>
        <Switch>
          <MainTemplate path={url.ads_history} component={AdsHistory} />
          <MainTemplate path="/confirm" component={Confirm} />
          <MainTemplate path="/transaction" component={Transaction} />
          <MainTemplate path="/profile" component={Profile} />
          <MainTemplate path="/wallet-2" component={SwaptobeWallet} />
          <MainTemplate path="/p2p-trading" component={P2PTrading} />
          <MainTemplate path="/swap" component={Swap} />
          <MainTemplate path="/create-ads/buy" component={CreateBuySell} />
          <MainTemplate path="/create-ads/sell" component={CreateBuySell} />
          <MainTemplate path="/login" component={Login} />
          <MainTemplate path="/signup" component={Signup} />
          <MainTemplate path="/wallet" component={Wallet} />
          <AdminTemplate path="/admin/dashboard" component={Dashboard} />
          <AdminTemplate path="/admin/ads" component={Ads} />
          <AdminTemplate path="/admin/kyc" component={KYC} />
          <AdminTemplate
            path={url.admin_exchangeRateDisparity}
            component={ExchangeRateDisparity}
          />
          <Route exact path="/" component={Home} />
        </Switch>
      </ScrollToTop>
    </BrowserRouter>
  );
}
export default App;
