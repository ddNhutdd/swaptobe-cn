import React from "react";
import { Pagination } from "antd";
function AdsHistory() {
  return (
    <div className="ads-history">
      <div className="container">
        <div className="box ads-history__filter">
          <h3>Filter</h3>
          <table>
            <tbody>
              <tr>
                <td>
                  <div>Action: </div>
                </td>
                <td>
                  <div className="ads-history__dropdown-selected">
                    <span>Buy</span>
                    <span>
                      <i class="fa-solid fa-angle-down"></i>
                    </span>
                  </div>
                  <div className="ads-history__dropdown-menu-container">
                    <div className="dropdown-menu">
                      <div className="dropdown-item">Sell</div>
                      <div className="dropdown-item">Buy</div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="pendingCheckbox">Pending:</label>
                </td>
                <td>
                  <input
                    id="pendingCheckbox"
                    type="checkbox"
                    className="--d-none"
                  />
                  <label
                    className="ads-history__checkbox"
                    htmlFor="pendingCheckbox"
                  >
                    <div className="ads-history__square">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="box ads-history__content">
          <h3>
            List <span>Sell</span>
          </h3>
          <div id="ads-history__content">
            <div className="box fadeInBottomToTop ads-history__record">
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>User Name:</td>
                      <td>test</td>
                    </tr>
                    <tr>
                      <td>Bank Name:</td>
                      <td>Vietcombank</td>
                    </tr>
                    <tr>
                      <td>Name:</td>
                      <td>Vietcombank</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>Account Number:</td>
                      <td>test</td>
                    </tr>
                    <tr>
                      <td>Amount:</td>
                      <td>Vietcombank</td>
                    </tr>
                    <tr>
                      <td>Amount Minimum:</td>
                      <td>Vietcombank</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>Created At:</td>
                      <td>test</td>
                    </tr>
                    <tr>
                      <td>Address Wallet:</td>
                      <td>Vietcombank</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="box fadeInBottomToTop ads-history__record">
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>User Name:</td>
                      <td>test</td>
                    </tr>
                    <tr>
                      <td>Bank Name:</td>
                      <td>Vietcombank</td>
                    </tr>
                    <tr>
                      <td>Name:</td>
                      <td>Vietcombank</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>Account Number:</td>
                      <td>test</td>
                    </tr>
                    <tr>
                      <td>Amount:</td>
                      <td>Vietcombank</td>
                    </tr>
                    <tr>
                      <td>Amount Minimum:</td>
                      <td>Vietcombank</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>Created At:</td>
                      <td>test</td>
                    </tr>
                    <tr>
                      <td>Address Wallet:</td>
                      <td>Vietcombank</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="ads-history__paging">
            <Pagination
              defaultCurrent={1}
              showSizeChanger={false}
              total={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdsHistory;
