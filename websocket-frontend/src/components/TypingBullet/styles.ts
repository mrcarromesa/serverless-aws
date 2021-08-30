import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%,
  80%,
  100% {
    opacity: 1;
    transform: translateY(0);
  }
  50% {
    opacity: 0.5;
    transform: translateY(-100%);
  }
`;

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(50%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.span`

  display: inline-block;
  padding: 10px;
  font-size: 0;
  animation: ${fadeInUp} 200ms linear 1 both;

  .typing__bullet {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.3);
    transition: all 300ms linear;
  }
  .typing__bullet:not(:last-child) {
    margin-right: 3px;
  }

  .typing__bullet {
    background-color: #000;
    animation: ${bounce} 600ms linear infinite both;
  }
  .typing__bullet:nth-child(2) {
    animation-delay: 150ms;
  }

  .typing__bullet:nth-child(3) {
    animation-delay: 300ms;
  }

`;
