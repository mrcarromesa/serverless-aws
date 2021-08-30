import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  ::-webkit-input-placeholder { /* Edge */
    color: #9F9F9F;
    font-size: 0.8rem;
  }

  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #9F9F9F;
    font-size: 0.8rem;
  }

  ::placeholder {
    color: #9F9F9F;
    font-size: 0.8rem;
  }

  html {
    font-size: 14px;
    min-height: 100%;
  }
  body {
    background: #fff;
    -webkit-font-smoothing: antialiased;
    font-size: 1rem;
    min-height: 100%;
    min-width: 350px;
  }
  input, button, body {
    font-family: 'Roboto', sans-serif;
  }

  button {
    border-radius: 0.6rem !important;
  }

  label:not(.form-check-label) {
    font-weight: bold;
  }

  button {
    cursor: pointer;
  }

  #root {
    width: 100%;
    min-height: 100%;
    margin: 0 auto;
    display: flex;
  }
`;
