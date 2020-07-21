// Standard Code

import React from "react";
import { Drizzle } from '@drizzle/store';
import { drizzleReactHooks } from "@drizzle/react-plugin";

// Import required files

import drizzleOptions from "./drizzleOptions";
import LoadingContainer from './LoadingContainer.js';
import TokenMetadata from './TokenMetadata.js';
import TokenWallet from './TokenWallet.js';
import Admin from './Admin.js';

// Standard Code

const drizzle = new Drizzle(drizzleOptions);
const { DrizzleProvider } = drizzleReactHooks;

function App() {

  return (

    <div className="container">

    {/*Change the title*/}

      <h1>ERC721 Token</h1>
                <hr/>
      
      <DrizzleProvider drizzle={drizzle}>

        <LoadingContainer>

        {/*Change the file name*/}

          <TokenMetadata />
          <TokenWallet />
          <Admin />

        </LoadingContainer>

      </DrizzleProvider>

    </div>

  );
  
}

export default App;
