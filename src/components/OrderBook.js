import React, { useEffect, useState } from "react";
import OrderBookPrice from "./OrderBookPrice";
import "../orderbook.css";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import styled from "styled-components";

const BestContainer = styled.div`
  display: flex;
  border: 1px solid #263238;
  margin-bottom: 2.2rem;
  margin-top: 0.3rem;

  @media (max-width: 1000px) {
    width: 90%;
    align-self: center;
  }
`;

const BestBidContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid #263238;

  @media (max-width: 1000px) {
    width: 80%;
  }
`;

const BestAskContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid #263238;
  @media (max-width: 1000px) {
    width: 80%;
  }
`;

const ContainerTitle = styled.h2`
  font-family: sans-serif;
  color: #263238;
  text-align: center;
`;

const BestSubContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: #263238;
  align-items: center;
`;

const ContainerPrice = styled.h4`
  font-family: sans-serif;
  color: #263238;
`;

const ContainerQuantity = styled.h4`
  font-family: sans-serif;
  color: #263238;
`;

const OrderBook = ({ selectedPair }) => {
  const [bestBid, setBestBid] = useState([]);
  const [bestAsk, setBestAsk] = useState([]);
  const depth = undefined;
  const [ob, setOB] = useState({
    product_id: selectedPair,
    buys: [],
    asks: [],
  });

  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.exchange.coinbase.com/products/${selectedPair}/book?level=1`,
      headers: { accept: "application/json" },
    };

    axios
      .request(options)
      .then(function (response) {
        setBestBid(response.data.bids[0]);
        setBestAsk(response.data.asks[0]);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`wss://ws-feed.pro.coinbase.com`);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "subscribe",
          product_ids: [selectedPair],
          channels: ["level2_batch"],
        })
      );
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "snapshot") {
        setOB((prevOB) => {
          data.asks.sort((a, b) =>
            Number(a[0]) < Number(b[0])
              ? -1
              : Number(a[0]) > Number(b[0])
              ? 1
              : 0
          );
          data.bids.sort((a, b) =>
            Number(a[0]) < Number(b[0])
              ? 1
              : Number(a[0]) > Number(b[0])
              ? -1
              : 0
          );
          return {
            ...prevOB,
            asks: data.asks.slice(0, depth),
            buys: data.bids.slice(0, depth),
          };
        });
      } else if (data.type === "l2update") {
        const removedItems = data.changes.filter((el) => Number(el[2]) === 0);
        const removedAsks = removedItems
          .filter((el) => el[0] === "sell")
          .map((el) => el[1]);
        const removedBuys = removedItems
          .filter((el) => el[0] === "buy")
          .map((el) => el[1]);
        const addedItems = data.changes.filter((el) => Number(el[2]) !== 0);
        const addedAsks = addedItems
          .filter((el) => el[0] === "sell")
          .map((el) => el.slice(1));
        const addedBuys = addedItems
          .filter((el) => el[0] === "buy")
          .map((el) => el.slice(1));
        setOB((prevOB) => {
          const asks = [...prevOB.asks]
            .filter((ask) => !removedAsks.includes(ask[0]))
            .concat(addedAsks);
          const buys = [...prevOB.buys]
            .filter((buy) => !removedBuys.includes(buy[0]))
            .concat(addedBuys);
          asks.sort((a, b) =>
            Number(a[0]) < Number(b[0])
              ? -1
              : Number(a[0]) > Number(b[0])
              ? 1
              : 0
          );
          buys.sort((a, b) =>
            Number(a[0]) < Number(b[0])
              ? 1
              : Number(a[0]) > Number(b[0])
              ? -1
              : 0
          );
          return {
            ...prevOB,
            asks: asks.slice(0, depth),
            buys: buys.slice(0, depth),
          };
        });
      } else if (data.type === "subscriptions") {
        console.log("subscriptions");
      } else {
        throw new Error();
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  let spread = "...";
  if (ob.asks[0] && ob.buys[0]) {
    spread = (Number(ob.asks[0][0]) - Number(ob.buys[0][0])).toFixed(2);
  }

  return (
    <div className="orderbook__maindiv">
      <BestContainer>
        <BestBidContainer>
          <ContainerTitle>Best Bid</ContainerTitle>
          <BestSubContainer>
            <ContainerPrice>Price: {bestBid[0]}</ContainerPrice>
            <ContainerQuantity>Quantity: {bestBid[1]}</ContainerQuantity>
          </BestSubContainer>
        </BestBidContainer>
        <BestAskContainer>
          <ContainerTitle>Best Ask</ContainerTitle>
          <ContainerPrice>Price: {bestAsk[0]}</ContainerPrice>
          <ContainerQuantity>Quantity: {bestAsk[1]}</ContainerQuantity>
        </BestAskContainer>
      </BestContainer>
      <div className="OB">
        {selectedPair ? (
          <>
            <div className="OB__header">
              <div className="OB__header1 OB__subtext">Order Book</div>
              <div className="OB__header2 OB__subtext">
                <div className="OB__subtext">Size</div>
                <div className="OB__subtext">Price</div>
              </div>
            </div>
            <OrderBookPrice
              type="ask"
              orders={ob.asks}
              product_id={selectedPair}
            />
            <div className="OB__S">
              <div className="OB__SL OB__subtext">Spread:</div>
              <div className="OB__SP OB__subtext">{spread}</div>
            </div>
            <OrderBookPrice
              type="buy"
              orders={ob.buys}
              product_id={selectedPair}
            />
            <div className="OB__header">
              <div className="OB__header1 OB__subtext">Order Book</div>
              <div className="OB__header2 OB__subtext">
                <div className="OB__subtext">Size</div>
                <div className="OB__subtext">Price</div>
              </div>
            </div>
          </>
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
};

export default OrderBook;
