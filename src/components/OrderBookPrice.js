import React from "react";

const OrderBookPrice = ({ orders, type, depth = 20 }) => {
  return (
    <div className={type === "ask" ? "orderbookprice orderbookprice-ask" : "orderbookprice orderbookprice-sell"}>
      {orders.slice(0, depth).map((order, index) => {
        return (
          <div className="orderbookprice-order" key={index}>
            <div className="orderbookprice-size">
              <div
                className="orderbookprice-bar"
                style={{ width: Math.min((order[1] / 5) * 25, 25) }}
              ></div>
              {order[1]}
            </div>
            <div className="orderbookprice-price">{order[0]}</div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderBookPrice;
