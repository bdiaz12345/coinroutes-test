import React from "react";
import styled from "styled-components";

const MainContainer = styled.div`
  background: #263238;
  width: 100%;
  height: 7vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #ffffff;
  font-family: sans-serif;
  font-size: 2rem;
  margin-left: 2rem;
`;

const Header = () => {
  return (
    <MainContainer>
      <Title>CoinRoutes Test</Title>
    </MainContainer>
  );
};

export default Header;
