// Standard Code

import React from "react";
import { Drizzle } from '@drizzle/store';
import { drizzleReactHooks } from "@drizzle/react-plugin";

// Import required files

import drizzleOptions from "./drizzleOptions";
import LoadingContainer from './LoadingContainer.js';
import ICOInfo from './ICOInfo.js';
import Investor from './Investor.js';
import Admin from './Admin.js';

// Standard Code

const drizzle = new Drizzle(drizzleOptions);
const { DrizzleProvider } = drizzleReactHooks;

function App() {

  return (

    <div className="container">
      
      {/*Change the title*/}

      <h1>ICO</h1>
          <hr/>
      
      <DrizzleProvider drizzle={drizzle}>

        <LoadingContainer>

        {/*Change the file name*/}

          <ICOInfo />
          <Investor />
          <Admin />

        </LoadingContainer>

      </DrizzleProvider>

    </div>

  );

}

export default App;
