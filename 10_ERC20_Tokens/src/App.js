// Standard Code

import React from "react";
import { Drizzle } from '@drizzle/store';
import { drizzleReactHooks } from "@drizzle/react-plugin";

// Import required files

import drizzleOptions from "./DrizzleOptions";
import LoadingContainer from './LoadingContainer';
import TokenMetadata from './TokenMetadata';
import TokenWallet from './TokenWallet';

// Standard Code

const contracts = new Drizzle(drizzleOptions);
const { DrizzleProvider } = drizzleReactHooks;

function App() {

  return (

    <div className="container">

      {/*Change the title*/}

      <h1>ERC20 Token</h1>
              <hr/>

      <DrizzleProvider drizzle={contracts}>

        <LoadingContainer>

           {/*Change the file name*/}

          <TokenMetadata />
          <TokenWallet />

        </LoadingContainer>

      </DrizzleProvider>

    </div>

  );

}

export default App;
