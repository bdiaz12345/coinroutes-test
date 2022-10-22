import React, { useState } from 'react';
import Header from './components/Header';
import PriceChart from './components/PriceChart';
import OrderBook from './components/OrderBook';
import styled from 'styled-components';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';

const currencies = [{display_name: 'BTC-USD'}, {display_name: 'ETH-USD'}, {display_name: 'LTC-USD'}, {display_name: 'BCH-USD'}]

const AppContainer = styled.div`
    height: 100vh;
`

const Option = styled.button`
    color: #ffffff;
    font-family: sans-serif;
    background: #263238;
    padding: .5rem 2rem;
    cursor: pointer;
`

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
`

const CurrencyTitle = styled.h1`
    font-family: sans-serif;
    margin-left: 1.5rem;
    font-size: 1rem;
    margin-top: 1rem;
`

const PriceChartTitle = styled.h2`
    font-family: sans-serif;
    margin-left: 1.5rem;
`

const OrderBookTitle = styled.h2`
    font-family: sans-serif;
    margin-bottom: 5%;

    @media (max-width: 1000px) {
        margin-left: 5%;
    }
`

const MainContainer = styled.div`
    display: flex;
    height: 50vh;

    @media (max-width: 1000px) {
        flex-direction: column;
    }
`
const MainSubContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const App = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPair, setSelectedPair] = useState('BTC-USD')
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSelect = (e) => {
        setSelectedPair('');
        handleClose();
        setTimeout(() => {
            setSelectedPair(e.target.innerText);
        }, 2000)
    };

    return (
        <AppContainer>
            <Header/>
            <CurrencyTitle>Selected Pair: <Button sx={{color: '#263238'}} onClick={handleClick}>{selectedPair ? selectedPair : 'Loading...'}</Button>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                    vertical: 'bottom',
                    }}
                >
                    {currencies.map((cur, idx) => {
                    return (
                        <Option onClick={handleSelect} key={idx} value={cur.id}>
                        {cur.display_name}
                        </Option>
                    );
                    })}
                </Popover></CurrencyTitle>
            <MainContainer>
                {
                    selectedPair ?
                    <>
                        <MainSubContainer>
                            <PriceChartTitle>Price Chart</PriceChartTitle>
                            <PriceChart selectedPair={selectedPair}/>
                        </MainSubContainer>
                        <MainSubContainer>
                            <OrderBookTitle>Order Book</OrderBookTitle>
                            <OrderBook selectedPair={selectedPair}/>
                        </MainSubContainer>
                    </>
                    :
                    <Container><CircularProgress/></Container>
                }
            </MainContainer>
        </AppContainer>
    )
}

export default App;