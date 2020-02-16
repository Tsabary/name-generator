import { createGlobalStyle } from "styled-components";
import "./styles.scss";

export const Global = createGlobalStyle`
   :root {
    --font-main: GilroyLight;
    --font-main-bold: GilroyBold;

    // purple
    // --color-main: #AB2087;
    // --color-main-dark: #991b77;

    // new blue
    --color-main: #1472FF;
    --color-main-dark: #0E51B5;
    --color-main-darkest: #0A3B85;

    // blue
   // --color-main: #2196F3;
    // --color-main-dark: #1976D2;
    // --color-main-darkest: #0D47A1;

    --color-main-transparent: rgba(90, 50, 100, 0.05);

    --color-grey-very-light: #ededed;
    --color-grey-light: #d1d1d1;
    --color-grey-medium: #ababab;
    --color-grey-medium-dark: #8e8d8d;
    --color-grey-dark: #1E1C00;
    --color-facebook:  #3b5998;
    
    --color-gradient: linear-gradient(var(--color-main), var(--color-main-dark));
  }
   * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

  } 

  html {
      font-size : 62.5%;
      @media only screen and (max-width: 1100px) {
        font-size : 50%;
      }
  }

  body {
    font-family: GilroyLight;
    font-size : 1.8rem;
    line-height: 3rem;
  }
`;

export default Global;
