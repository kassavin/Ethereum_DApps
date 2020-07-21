// Standard Code
import React from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";

const { useDrizzleState } = drizzleReactHooks;

function LoadingContainer({children}) {

  const drizzleStatus = useDrizzleState(state => state.drizzleStatus);

  if(drizzleStatus.initialized === false) {
    return "Please connect to the Rinkeby Network";
  }

  return ( <> {children} </> )
  	
}

export default LoadingContainer;
