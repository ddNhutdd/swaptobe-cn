import React from "react";

function PhoneApps() {
  return (
    <div className="container">
      <div className="home__app__content">
        <div className="home__app__left">
          <h3>Sereso Apps</h3>
          <p className="home__app__small-header">
            Trading whenever and wherever you are!
          </p>
          <p>
            Sereso is compatible with iOS, Android, Website, intuitive user
            interface and easy navigation. Easily pair your web wallet with a
            mobile device by scanning a QR code
          </p>
          <p>
            Click to download app store for ios operating system, click download
            google play for android OS
          </p>
          <div className="home__app__image-container">
            <img src={process.env.PUBLIC_URL + "/img/ios.png"} alt="ios" />
            <img
              src={process.env.PUBLIC_URL + "/img/android.png"}
              alt="android"
            />
          </div>
        </div>
        <div className="home__app__right">
          <div className="home__app__right__image-container">
            <img
              src={process.env.PUBLIC_URL + "/img/home-16.png"}
              alt="phone"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhoneApps;
