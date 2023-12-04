import { useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import CreateBuy from "./components/CreateBuy";
import CreateSell from "./components/CreateSell";
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
function App() {
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
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop>
        <Switch>
          <MainTemplate path="/profile" component={Profile} />
          <MainTemplate path="/wallet-2" component={SwaptobeWallet} />
          <MainTemplate path="/p2p-trading" component={P2PTrading} />
          <MainTemplate path="/swap" component={Swap} />
          <MainTemplate path="/create-ads/buy" component={CreateBuy} />
          <MainTemplate path="/create-ads/sell" component={CreateSell} />
          <MainTemplate path="/login" component={Login} />
          <MainTemplate path="/signup" component={Signup} />
          <MainTemplate path="/wallet" component={Wallet} />
          <AdminTemplate path="/admin/dashboard" component={Dashboard} />
          <Route exact path="/" component={Home} />
        </Switch>
      </ScrollToTop>
    </BrowserRouter>
  );
}
export default App;
