import { Button, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { axiosService } from "../util/service";
const { Option } = Select;
const { TextArea } = Input;

export default function CreateSell({ history }) {
  const [data, setData] = useState([]);
  const [currentCoin, setCurrentCoin] = useState("BTC");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getAllCoins = async () => {
    try {
      let response = await axiosService.post("api/crypto/getListCoinAll");
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  useEffect(() => {
    getAllCoins();
  }, []);

  return (
    <div className="create-buy-ads">
      <div className="container">
        <div className="box">
          <h2 className="title">Create new selling advertisement</h2>

          <span
            className="switch"
            onClick={() => history.replace("/create-ads/buy")}
          >
            Do you want to buy?
          </span>

          <div className="head-area">
            <h2>Ads to sell {currentCoin}</h2>
            <div>Market sell price: ---</div>
            <i className="fa-solid fa-pen-to-square" onClick={showModal}></i>
          </div>

          <div className="price-area">
            <h2>Price</h2>

            <div className="field">
              <label>Fixed price:</label>
              <Input addonAfter="USD" size="large" />
            </div>

            <div className="field">
              <label>{currentCoin} price that buyers see:</label>
              <Input addonAfter={`USD/${currentCoin}`} size="large" />
            </div>

            <div className="field">
              <label>{currentCoin} price that you receive:</label>
              <Input addonAfter={`USD/${currentCoin}`} size="large" />
            </div>
          </div>

          <div className="amount-area">
            <h2>Amount</h2>

            <div className="field">
              <label>Amount of {currentCoin}:</label>
              <Input addonAfter={currentCoin} size="large" />
            </div>

            <div className="field">
              <label>Minimum {currentCoin} amount:</label>
              <Input addonAfter={currentCoin} size="large" />
            </div>

            <div className="field">
              <label>Maximum {currentCoin} amount in one trade:</label>
              <Input addonAfter={currentCoin} size="large" />
            </div>
          </div>

          <div className="payment-area">
            <h2>Payment details</h2>

            <div className="field">
              <label>Payment method:</label>
              <Select
                size="large"
                style={{
                  width: "100%",
                }}
              >
                <Option>Bank transfer</Option>
                <Option>Bank transfer</Option>
                <Option>Bank transfer</Option>
                <Option>Bank transfer</Option>
              </Select>
            </div>

            <div className="field">
              <label>Bank name:</label>
              <Select
                size="large"
                style={{
                  width: "100%",
                }}
              >
                <Option>ABC</Option>
                <Option>ABC</Option>
                <Option>ABC</Option>
                <Option>ABC</Option>
              </Select>
            </div>

            <div className="field">
              <label>Bank account number</label>
              <Input size="large" />
            </div>

            <div className="field">
              <label>Bank account name</label>
              <Input size="large" />
            </div>

            <div className="field">
              <label>Bank BSB number</label>
              <Input size="large" />
            </div>

            <div className="field">
              <label>Payment window:</label>
              <Select
                size="large"
                style={{
                  width: "100%",
                }}
              >
                <Option>15 minutes</Option>
                <Option>15 minutes</Option>
                <Option>15 minutes</Option>
                <Option>15 minutes</Option>
              </Select>
            </div>

            <div className="field">
              <label>Terms of trade:</label>
              <TextArea
                rows={3}
                placeholder="Other information you wish to tell about your advertisement"
              />
            </div>
          </div>

          <div className="review-area">
            <i className="fa-solid fa-eye"></i>
            <span>Review your ad</span>
          </div>

          <div className="button-area">
            <Button>Cancel</Button>
            <button className="button-area-primary">
              Create new advertisement
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="Choose your coin"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <div style={{ padding: 20 }}>
          {data.map((item, i) => {
            return (
              <Button
                className="btn-choice-coin"
                type={item.name === currentCoin ? "primary" : "default"}
                key={i}
                onClick={() => {
                  setCurrentCoin(item.name);
                  setIsModalVisible(false);
                }}
              >
                {item.name}
              </Button>
            );
          })}
        </div>
      </Modal>
      {/* Modal */}
    </div>
  );
}
