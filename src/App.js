import React, { useState } from "react";
import Header from "./components/Header";
import PriceChart from "./components/PriceChart";
import OrderBook from "./components/OrderBook";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import "./styles.css";
import Switch from "@mui/material/Switch";

const currencies = [
  { display_name: "BTC-USD" },
  { display_name: "ETH-USD" },
  { display_name: "LTC-USD" },
  { display_name: "BCH-USD" },
];

const App = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPair, setSelectedPair] = useState("BTC-USD");
  const [darkMode, setDarkMode] = useState(false);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelect = (e) => {
    setSelectedPair("");
    handleClose();
    setTimeout(() => {
      setSelectedPair(e.target.innerText);
    }, 2000);
  };

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <Header />
      <h1 className="currency-title">
        Selected Pair:{" "}
        <Button sx={{ color: darkMode ? '#ffffff' : "#263238" }} onClick={handleClick}>
          {selectedPair ? selectedPair : "Loading..."}
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
          }}
        >
          {currencies.map((cur, idx) => {
            return (
              <button className="option" onClick={handleSelect} key={idx} value={cur.id}>
                {cur.display_name}
              </button>
            );
          })}
        </Popover>
      </h1>
      <Switch
        onClick={() => {
          setDarkMode(!darkMode);
        }}
      />
      <div className="main-container">
        {selectedPair ? (
          <>
            <div className="main-subcontainer">
              <h2 className="pricechart-title">Price Chart</h2>
              <PriceChart darkMode={darkMode} selectedPair={selectedPair} />
            </div>
            <div className="main-subcontainer">
              <h2 className="orderbook-title">Order Book</h2>
              <OrderBook selectedPair={selectedPair} darkMode={darkMode} />
            </div>
          </>
        ) : (
          <div className="loader-container">
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
