import React, { useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import Footer from "../Footer";
import { url } from "src/constant";
import { useSelector } from "react-redux";
function Home() {
  const history = useHistory();
  useEffect(() => {
    const animationHeader = function () {
      var header = document.querySelector(".home__header");
      if (header) {
        var scrollPosition = window.scrollY;
        if (scrollPosition >= 50) {
          header.classList.add("scroll");
        } else {
          header.classList.remove("scroll");
        }
      }
    };
    const closeMenu = function () {
      const bars = document.querySelectorAll(
        ".home__header .home__header__bar-item"
      );
      if (bars) {
        for (let item of bars) {
          item.classList.remove("active");
        }
      }
      const menu = document.querySelector(".home__header .home__header__menu");
      if (menu) {
        menu.classList.remove("--d-flex");
      }
      const loginContainer = document.querySelector(
        ".home__header .home__header__login-container"
      );
      if (loginContainer) {
        loginContainer.classList.remove("--d-block");
      }
    };
    window.addEventListener("click", closeMenu);
    window.addEventListener("scroll", animationHeader);
    return () => {
      window.removeEventListener("scroll", animationHeader);
      window.removeEventListener("click", closeMenu);
    };
  }, []);
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  //
  const redirectToLogin = function (e) {
    e.preventDefault();
    history.push(url.login);
  };
  const redirectTop2pTrading = function () {
    history.push(url.p2pTrading);
  };
  const tabOnClickHandle = function (e) {
    const order = e.target.dataset.name;
    const tabs = document.querySelectorAll(
      ".home__faqs  .home__faqs-list-tab li"
    );
    if (tabs) {
      for (const item of tabs) {
        if (item.dataset.name === order) {
          item.classList.add("active");
        } else if (item.dataset.name !== order) {
          item.classList.remove("active");
        }
      }
    }
    const tabsContent = document.querySelectorAll(
      ".home__faqs  .home__faqs-tab-content"
    );
    if (tabsContent) {
      for (const item of tabsContent) {
        if (item.dataset.name === order) {
          item.classList.remove("--d-none");
          item.classList.add("fadeIn");
        } else if (item.dataset.name !== order) {
          item.classList.remove("fadeIn");
          item.classList.add("--d-none");
        }
      }
    }
  };
  const headerBarButtonClickHandle = function (e) {
    if (e) e.stopPropagation();
    const bars = document.querySelectorAll(
      ".home__header .home__header__bar-item"
    );
    if (bars) for (let item of bars) item.classList.toggle("active");
    const menu = document.querySelector(".home__header .home__header__menu");
    if (menu) menu.classList.toggle("--d-flex");
    const loginContainer = document.querySelector(
      ".home__header .home__header__login-container"
    );
    if (loginContainer) loginContainer.classList.toggle("--d-block");
  };
  return (
    <>
      <div className="home">
        <div className="home__header">
          <div className="container">
            <NavLink to="" className="home__header__icon">
              <img
                src={process.env.PUBLIC_URL + "/img/logowhite.png"}
                alt="logo"
              />
            </NavLink>
            <ul className="home__header__menu fadeIn">
              <li>
                <div
                  className="home__header__menu-item"
                  onClick={redirectTop2pTrading}
                >
                  EXCHANGE
                </div>
              </li>
              <li>
                <div
                  className="home__header__menu-item"
                  onClick={(e) => {
                    document
                      .getElementById("home__benefit")
                      .scrollIntoView({ behavior: "smooth" });
                    headerBarButtonClickHandle(e);
                  }}
                >
                  COIN
                </div>
              </li>
              <li>
                <div
                  className="home__header__menu-item"
                  onClick={(e) => {
                    document
                      .getElementById("home__road-map")
                      .scrollIntoView({ behavior: "smooth" });
                    headerBarButtonClickHandle(e);
                  }}
                >
                  ROADMAP
                </div>
              </li>
              <li>
                <div
                  className="home__header__menu-item"
                  onClick={(e) => {
                    document
                      .getElementById("home__app")
                      .scrollIntoView({ behavior: "smooth" });
                    headerBarButtonClickHandle(e);
                  }}
                >
                  APP
                </div>
              </li>
              <li>
                <div
                  className="home__header__menu-item"
                  onClick={(e) => {
                    document
                      .getElementById("home__faqs")
                      .scrollIntoView({ behavior: "smooth" });
                    headerBarButtonClickHandle(e);
                  }}
                >
                  FAQ
                </div>
              </li>
            </ul>
            {!isLogin ? (
              <div className="home__header__login-container  fadeIn">
                <button
                  onClick={redirectToLogin}
                  className="home__header__login"
                >
                  Login
                </button>
              </div>
            ) : (
              <></>
            )}
            <div
              onClick={headerBarButtonClickHandle}
              className="home__header__bar"
            >
              <div className="home__header__bar-item"></div>
              <div className="home__header__bar-item"></div>
              <div className="home__header__bar-item"></div>
            </div>
          </div>
        </div>
        <div className="home__carousel">
          <div className="container">
            <div className="home__carousel__content">
              <div className="home__carousel__left">
                <h1 className="home__carousel__title">
                  Cryptocurrency Wallet - Buy/Sell Bitcoin, Ethereum and
                  Altcoins
                </h1>
                <p className="home__carousel__text">
                  Sereso is a multi-industry eco-system that helps to deepen the
                  application of cryptocurrencies to each business and as an
                  alternative to traditional exchanges.
                </p>
                {!isLogin ? (
                  <button
                    onClick={redirectToLogin}
                    className="home__carousel__button"
                  >
                    SIGN UP NOW
                  </button>
                ) : (
                  <></>
                )}
              </div>
              <div className="home__carousel__right">
                <img
                  src={process.env.PUBLIC_URL + "/img/hinhhometobe.png"}
                  alt="carousel"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="home__why">
          <div className="home__why__video-container">
            <video
              id="myVideo"
              width="100%"
              height="100%"
              loop
              muted
              playsInline
              autoPlay
            >
              <source
                src={process.env.PUBLIC_URL + "/videos/video.mkv"}
                type="video/mp4"
              />
              Trình duyệt của bạn không hỗ trợ thẻ video.
            </video>
            <div className="home__why__video-overlay"></div>
          </div>
          <div className="home__why__content">
            <h3>Why to choose Sereso?</h3>
            <p>
              Sereso is a pioneer multifunctional wallet in the field of
              Blockchain and digital asset storage!
            </p>
            <small>
              Users can send, receive, and exchange their electronic money
              conveniently and easily. Sereso meets all the needs of the
              community of token users as well as other cryptocurrencies.
            </small>
          </div>
        </div>
        <div id="home__benefit" className="home__benefit">
          <div className="container">
            <div className="home__benefit__background"></div>
            <div className="home__benefit__wrap-content">
              <div className="home__benefit__left">
                <div className="home__benefit__left-column-left">
                  <div className="home__benefit__card">
                    <img
                      src={process.env.PUBLIC_URL + "/img/home-1.png"}
                      alt="defend"
                    />
                    <h3 className="home__benefit__title">Safe and Secure</h3>
                    <p className="home__benefit__text">
                      Advanced security features, such as 2-step verification.
                    </p>
                  </div>
                  <div className="home__benefit__card">
                    <img
                      src={process.env.PUBLIC_URL + "/img/home-3.png"}
                      alt="defend"
                    />
                    <h3 className="home__benefit__title">Instant Exchange</h3>
                    <p className="home__benefit__text">
                      Advanced security features, such as 2-step verification.
                    </p>
                  </div>
                  <div className="home__benefit__card">
                    <img
                      src={process.env.PUBLIC_URL + "/img/home-5.png"}
                      alt="defend"
                    />
                    <h3 className="home__benefit__title">Strong Network</h3>
                    <p className="home__benefit__text">
                      Sereso is designed to resist the change of data once the
                      data is accepted by the network, there is no way to change
                      it.
                    </p>
                  </div>
                </div>
                <div className="home__benefit__left-column-right">
                  <div className="home__benefit__card">
                    <img
                      src={process.env.PUBLIC_URL + "/img/home-2.png"}
                      alt="defend"
                    />
                    <h3 className="home__benefit__title">Mobile Apps</h3>
                    <p className="home__benefit__text">
                      Sereso is compatible with iOS, Android, and Website
                      operating systems.
                    </p>
                  </div>
                  <div className="home__benefit__card">
                    <img
                      src={process.env.PUBLIC_URL + "/img/home-4.png"}
                      alt="defend"
                    />
                    <h3 className="home__benefit__title">World Coverage</h3>
                    <p className="home__benefit__text">
                      The World Economic Forum’ predicts that 10% of global GDP
                      will be stored on Blockchain by 2025.
                    </p>
                  </div>
                  <div className="home__benefit__card">
                    <img
                      src={process.env.PUBLIC_URL + "/img/home-6.png"}
                      alt="defend"
                    />
                    <h3 className="home__benefit__title">Margin Trading</h3>
                    <p className="home__benefit__text">
                      The option to use x2 leverage can be used on all
                      cryptocurrency transactions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="home__benefit__right">
                <div className="home__benefit__content">
                  <h3>Benefits of Using Our Solution</h3>
                  <p>
                    Advanced security features, intuitive user interface and
                    easy navigation. Easy to pair web wallet with mobile device
                    by scanning QR code. Buy and sell directly through Sereso
                    your.
                  </p>
                </div>
                <img
                  src={process.env.PUBLIC_URL + "/img/home-7.png"}
                  alt="home"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="home__eco">
          <div className="home__eco__content"></div>
          <div className="home__eco__bottom-content">
            <div className="container">
              <div className="home__eco__left">
                <img
                  src={process.env.PUBLIC_URL + "/img/home-9.svg"}
                  alt="home-9"
                />
                <p>
                  TOBE COIN is the coin used in TOBE CHAIN - a multi-industry
                  eco-system that helps to deepen the application of
                  cryptocurrencies to each business and as an alternative to
                  traditional exchanges.
                </p>
              </div>
              <div className="home__eco__right">
                <ul>
                  <li>
                    <span>Name</span>
                    <span>Tobe Coin</span>
                  </li>
                  <li>
                    <span>Type</span>
                    <span>Private BlockChain (Coin Mineble - Mainnet)</span>
                  </li>
                  <li>
                    <span>Symbol</span>
                    <span>TBC</span>
                  </li>
                  <li>
                    <span>Platform</span>
                    <span>Tobe Coin</span>
                  </li>
                  <li>
                    <span>General release</span>
                    <span>66.000.000</span>
                  </li>
                  <li>
                    <span>Explorer</span>
                    <span>www.tobescan.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="home__token">
          <div className="container">
            <div className="home__token__content">
              <h2>TBC Coin Allocation</h2>
              <img
                src={process.env.PUBLIC_URL + "/img/home-10.svg"}
                alt="token"
              />
            </div>
          </div>
        </div>
        <div id="home__road-map" className="home__road-map">
          <div className="container">
            <div className="home__road-map__header">
              <h3 className="home__road-map__title">Road Map</h3>
              <p className="home__road-map__text">
                The history of the path and the development process of the
                Blockchain Tobe
              </p>
            </div>
            <div className="home__road-map__list">
              <div className="home__road-map__card">
                <div className="home__road-map__card-time">
                  5th September 2020
                </div>
                <img
                  src={process.env.PUBLIC_URL + "/img/home-12.png"}
                  alt="home-12"
                />
                <div className="home__road-map__card-title">PLAN FROM IDEA</div>
                <div className="home__road-map__card-text">
                  Initial planning from the idea of creating a blockchain
                  platform and a coin exchange ...
                </div>
                <div className="home__road-map__next green">
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
              <div className="home__road-map__card">
                <div className="home__road-map__card-time">
                  11th November 2021
                </div>
                <img
                  src={process.env.PUBLIC_URL + "/img/home-13.png"}
                  alt="home-12"
                />
                <div className="home__road-map__card-title">
                  LAUNCHING Sereso
                </div>
                <div className="home__road-map__card-text">
                  Launch of Sereso crypto exchange and related ecosystems.
                </div>
                <div className="home__road-map__next blue">
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
              <div className="home__road-map__card">
                <div className="home__road-map__card-time">
                  9th September 2022
                </div>
                <img
                  src={process.env.PUBLIC_URL + "/img/home-14.png"}
                  alt="home-12"
                />
                <div className="home__road-map__card-title">
                  OPERATING COIN TOBE
                </div>
                <div className="home__road-map__card-text">
                  Operate brand new coin "TobeCoin" and blockchain application
                  in Shopping ...
                </div>
                <div className="home__road-map__next yellow">
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
              <div className="home__road-map__card">
                <div className="home__road-map__card-time">
                  1st January 2024
                </div>
                <img
                  src={process.env.PUBLIC_URL + "/img/home-15.png"}
                  alt="home-12"
                />
                <div className="home__road-map__card-title">
                  LISTING ON STOCK EXCHANGE
                </div>
                <div className="home__road-map__card-text">
                  Make a step-by-step plan to go to the stock exchange.
                </div>
                <div className="home__road-map__next orange">
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="home__app" className="home__app">
          <div className="container">
            <div className="home__app__content">
              <div className="home__app__left">
                <h3>Sereso Apps</h3>
                <p className="home__app__small-header">
                  Trading whenever and wherever you are!
                </p>
                <p>
                  Sereso is compatible with iOS, Android, Website, intuitive
                  user interface and easy navigation. Easily pair your web
                  wallet with a mobile device by scanning a QR code
                </p>
                <p>
                  Click to download app store for ios operating system, click
                  download google play for android OS
                </p>
                <div className="home__app__image-container">
                  <img
                    src={process.env.PUBLIC_URL + "/img/ios.png"}
                    alt="ios"
                  />
                  <img
                    src={process.env.PUBLIC_URL + "/img/android.png"}
                    alt="android"
                  />
                </div>
              </div>
              <div className="home__app__right">
                <img
                  src={process.env.PUBLIC_URL + "/img/home-16.png"}
                  alt="phone"
                />
              </div>
            </div>
          </div>
        </div>
        <div id="home__faqs" className="home__faqs">
          <div className="container">
            <div className="home__faqs-content">
              <span>FAQS</span>
              <h3>Frequently Asked questions</h3>
              <div className="home__faqs-tabs">
                <ul className="home__faqs-list-tab">
                  <li
                    className="active"
                    data-name={1}
                    onClick={tabOnClickHandle}
                  >
                    GENERAL
                  </li>
                  <li data-name={2} onClick={tabOnClickHandle}>
                    KYC & MINING
                  </li>
                  <li data-name={3} onClick={tabOnClickHandle}>
                    BLOCKCHAIN
                  </li>
                  <li data-name={4} onClick={tabOnClickHandle}>
                    OTHERS
                  </li>
                </ul>
                <div className="home__faqs-tab-content --d-none" data-name={1}>
                  <div className="home__faqs-card">
                    <div className="home__faqs-card-header">
                      What is Sereso?
                    </div>
                    <div className="home__faqs-card-content">
                      Sereso is a Decentralized Coin Wallet which combines P2P
                      trading platform to help the startup community reach out
                      to investors from the Sereso community in more than 40
                      countries. The users community can both store coins and
                      trade coins into fiat currency with the lowest fees.
                      Sereso is one of 12 ecosystems of Tobe Chain.
                    </div>
                  </div>
                  <div className="home__faqs-card">
                    <div className="home__faqs-card-header">
                      What is Sereso?
                    </div>
                    <div className="home__faqs-card-content">
                      Sereso is a Decentralized Coin Wallet which combines P2P
                      trading platform to help the startup community reach out
                      to investors from the Sereso community in more than 40
                      countries. The users community can both store coins and
                      trade coins into fiat currency with the lowest fees.
                      Sereso is one of 12 ecosystems of Tobe Chain.
                    </div>
                  </div>
                  <div className="home__faqs-card">
                    <div className="home__faqs-card-header">
                      What is Sereso?
                    </div>
                    <div className="home__faqs-card-content">
                      Sereso is a Decentralized Coin Wallet which combines P2P
                      trading platform to help the startup community reach out
                      to investors from the Sereso community in more than 40
                      countries. The users community can both store coins and
                      trade coins into fiat currency with the lowest fees.
                      Sereso is one of 12 ecosystems of Tobe Chain.
                    </div>
                  </div>
                  <div className="home__faqs-card">
                    <div className="home__faqs-card-header">
                      What is Sereso?
                    </div>
                    <div className="home__faqs-card-content">
                      Sereso is a Decentralized Coin Wallet which combines P2P
                      trading platform to help the startup community reach out
                      to investors from the Sereso community in more than 40
                      countries. The users community can both store coins and
                      trade coins into fiat currency with the lowest fees.
                      Sereso is one of 12 ecosystems of Tobe Chain.
                    </div>
                  </div>
                </div>
                <div className="home__faqs-tab-content --d-none" data-name={2}>
                  <div className="home__faqs-card">
                    <div className="home__faqs-card-header">
                      Is Sereso App available on Android and IOS?
                    </div>
                    <div className="home__faqs-card-content">
                      1.Register with an Cryptocurrency Exchange. To participate
                      in an ICO you need cryptocurrencies, usually Ether.... You
                      can install Sereso application on both Appstore and Google
                      Play. For Google Play store: You just need to input
                      “Sereso” at search box and install. For Appstore store:
                      You have to input “TestFlight” at search box and install.
                      Then, open TestFlight and you will see Sereso application
                      in there.
                    </div>
                  </div>
                  <div className="home__faqs-card">
                    <div className="home__faqs-card-header">
                      What documents do users need for KYC level 1 on Sereso?
                    </div>
                    <div className="home__faqs-card-content">
                      In order to use Sereso app, users need to verify the
                      account step 1 with personal information, pictures of
                      government-issued ID card (2 sides), and a full face
                      photo.
                    </div>
                  </div>
                  <div className="home__faqs-card">
                    <div className="home__faqs-card-header">
                      How to mine TBC (tobe coin) and extend trade capability on
                      Sereso?
                    </div>
                    <div className="home__faqs-card-content">
                      To mine TBC (tobe coin) and extend trade capability up to
                      $50,000/day, users have to perform KYC level 2 on Sereso.
                      Documents that are accepted for KYC level 2:
                      <ul style={{ paddingLeft: "15px" }}>
                        <li>Bank statements</li>
                        <li>
                          Utility bills (The documents that you provide should
                          NOT be older than 03 months)
                        </li>
                        <li>Cable TV/house, phone line bills (with stamp)</li>
                        <li>Tax returns</li>
                        <li>Council tax bills</li>
                        <li>
                          Government-issued certification of residence, etc.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="home__faqs-tab-content --d-none" data-name={3}>
                  <div className="home__faqs-card">
                    <div className="home__faqs-card-header">
                      What is a Blockchain Explorer?
                    </div>
                    <div className="home__faqs-card-content">
                      A blockchain explorer is a web application for
                      blockchains, that allows users to know details of
                      activities happening on that particular blockchain,
                      including the transaction status. Just like it is with
                      internet explorers, it enables users to browse specific
                      blockchains. This means that you can only use a bitcoin
                      block explorer to browse bitcoin transactions. You cannot
                      use it to browse Ethereum or Litecoin transactions.
                    </div>
                  </div>
                  <div className="home__faqs-card">
                    <div className="home__faqs-card-header">
                      What is Sereso?
                    </div>
                    <div className="home__faqs-card-content">
                      Sereso is a Decentralized Coin Wallet which combines P2P
                      trading platform to help the startup community reach out
                      to investors from the Sereso community in more than 40
                      countries. The users community can both store coins and
                      trade coins into fiat currency with the lowest fees.
                      Sereso is one of 12 ecosystems of Tobe Chain.
                    </div>
                  </div>
                  <div className="home__faqs-card">
                    <div className="home__faqs-card-header">
                      What is Sereso?
                    </div>
                    <div className="home__faqs-card-content">
                      Sereso is a Decentralized Coin Wallet which combines P2P
                      trading platform to help the startup community reach out
                      to investors from the Sereso community in more than 40
                      countries. The users community can both store coins and
                      trade coins into fiat currency with the lowest fees.
                      Sereso is one of 12 ecosystems of Tobe Chain.
                    </div>
                  </div>
                  <div className="home__faqs-card">
                    <div className="home__faqs-card-header">
                      What is Sereso?
                    </div>
                    <div className="home__faqs-card-content">
                      Sereso is a Decentralized Coin Wallet which combines P2P
                      trading platform to help the startup community reach out
                      to investors from the Sereso community in more than 40
                      countries. The users community can both store coins and
                      trade coins into fiat currency with the lowest fees.
                      Sereso is one of 12 ecosystems of Tobe Chain.
                    </div>
                  </div>
                </div>
                <div className="home__faqs-tab-content" data-name={4}>
                  <div className="home__faqs-card">
                    <div className="home__faqs-card-header">
                      What is Ethereum (ETH)?
                    </div>
                    <div className="home__faqs-card-content">
                      <p>
                        Ethereum is an open-source, public, blockchain-based
                        distributed computing platform featuring smart contract
                        (scripting) functionality (enables developers to build
                        and deploy decentralized applications.) (…) It is listed
                        under the code ETH and traded on cryptocurrency
                        exchanges. It is also used to pay for transaction fees
                        and computational services on the Ethereum network.” –
                        Wikipedia
                      </p>
                      <p>
                        What is the difference between ETH and BTC? On Remitano,
                        both are crypto-currencies that can be traded at the
                        same way. Thus there is no difference from that
                        perspective. On a technical level, ETH and BTC have a
                        few different points. Ethereum managed to fix
                        disadvantages from Bitcoin such as high transaction fee
                        and slow block confirmation. Bitcoin’s average block
                        time is about 10 minutes, while Ethereum’s aims to be 12
                        seconds.
                      </p>
                    </div>
                  </div>
                  <div className="home__faqs-card">
                    <div className="home__faqs-card-header">
                      What is Sereso?
                    </div>
                    <div className="home__faqs-card-content">
                      Sereso is a Decentralized Coin Wallet which combines P2P
                      trading platform to help the startup community reach out
                      to investors from the Sereso community in more than 40
                      countries. The users community can both store coins and
                      trade coins into fiat currency with the lowest fees.
                      Sereso is one of 12 ecosystems of Tobe Chain.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="home__faqs-background"></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default Home;
