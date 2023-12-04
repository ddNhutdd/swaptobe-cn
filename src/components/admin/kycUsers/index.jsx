import React from "react";
import { Input } from "antd";

function index() {
  return (
    <div className="admin-kyc-users">
      <h3 className="admin-kyc-users__title">All users</h3>
      <div className="admin-kyc-users__control">
        <form className="admin-kyc-users__search-form">
          <Input type="text" />
        </form>
      </div>
    </div>
  );
}

export default index;
