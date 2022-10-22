import React, { useState, useEffect } from "react";
import PriceChartDash from "./PriceChartDash";
import "../pricechart.css";

const PriceChart = ({ selectedPair, darkMode }) => {
  const [price, setprice] = useState("0.00");
  const [pastData, setpastData] = useState({});
  const url = "https://api.pro.coinbase.com";
  const formatData = (data) => {
    let finalData = {
      labels: [],
      datasets: [
        {
          label: "Price",
          data: [],
          backgroundColor: "skyblue",
          borderColor: "skyblue",
          fill: false,
        },
      ],
    };

    let dates = data.map((val) => {
      const ts = val[0];
      let date = new Date(ts * 1000);
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      let final = `${month}-${day}-${year}`;
      return final;
    });

    let priceArr = data.map((val) => {
      return val[4];
    });

    priceArr.reverse();
    dates.reverse();
    finalData.labels = dates;
    finalData.datasets[0].data = priceArr;

    return finalData;
  };

  useEffect(() => {
    const ws = new WebSocket("wss://ws-feed.pro.coinbase.com");

    let msg = {
      type: "subscribe",
      product_ids: [selectedPair],
      channels: ["ticker"],
    };
    let jsonMsg = JSON.stringify(msg);
    ws.onopen = () => ws.send(jsonMsg);

    let historicalDataURL = `${url}/products/${selectedPair}/candles?granularity=86400`;
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));

      let formattedData = formatData(dataArr);
      setpastData(formattedData);
    };

    fetchHistoricalData();

    ws.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type !== "ticker") {
        return;
      }

      if (data.product_id === selectedPair) {
        setprice(data.price);
      }
    };
  }, [selectedPair]);

  return (
    <div className="container">
      <PriceChartDash darkMode={darkMode} price={price} data={pastData} />
    </div>
  );
};

export default PriceChart;
