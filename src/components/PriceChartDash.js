import React from "react";
import { Line } from "react-chartjs-2";
import "../pricechart.css";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
Chart.register(CategoryScale);

function PriceChartDash({ price, data, darkMode }) {
  const opts = {
    tooltips: {
      intersect: false,
      mode: "index",
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  Chart.defaults.plugins.legend.display = false;

  return (
    <div className={darkMode ? "pricechart-dark-mode" : "pricechart"}>
      <h2>{`${data.datasets ? "$" + price : ""}`}</h2>
      <div className="chart-container">
        {data.datasets ? <Line data={data} options={opts} /> : ""}
      </div>
    </div>
  );
}

export default PriceChartDash;
