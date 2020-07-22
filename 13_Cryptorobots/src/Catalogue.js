// Standard Code
import React from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";

// Import required files
import KittyList from "./KittyList";

// Standard Code
const { useDrizzle, useDrizzleState } = drizzleReactHooks;
const { ContractData } = newContextComponents;

export default () => {
  const { drizzle } = useDrizzle();
  const state = useDrizzleState(state => state);

  return (

    <div className="App">

    {/*Change from here*/}
      
      <div>
        <h2>Catalogue</h2>
        
        <ContractData
          drizzle={drizzle}
          drizzleState={state}
          contract="Cryptokitty"
          method="tokenURIBase"
          
          render={uriBase => { 
            
            return (

              <ContractData
                drizzle={drizzle}
                drizzleState={state}
                contract="Cryptokitty"
                method="getAllKitties"
                
                render={kitties => (
                  <KittyList 
                    kitties={kitties} 
                    uriBase={uriBase} /> 
                )}

              />
            );

          }}

        />

      </div>

    </div>
    
  );

};
