import { useState, useEffect } from "react";
import usePoller from "./Poller";
import useOnBlock from "./OnBlock";
import { Provider } from "@ethersproject/providers";

const DEBUG = false;



export default function useContractReader(contracts, contractName, functionName, args, pollTime, formatter, onChange) {
  let adjustPollTime = 0;
  if (pollTime) {
    adjustPollTime = pollTime;
  } else if (!pollTime && typeof args === "number") {
    
    adjustPollTime = args;
  }

  const [value, setValue] = useState();
  useEffect(() => {
    if (typeof onChange === "function") {
      setTimeout(onChange.bind(this, value), 1);
    }
  }, [value, onChange]);

  const updateValue = async () => {
    try {
      let newValue;
      if (DEBUG) console.log("CALLING ", contractName, functionName, "with args", args);
      if (args && args.length > 0) {
        newValue = await contracts[contractName][functionName](...args);
        if (DEBUG)
          console.log("contractName", contractName, "functionName", functionName, "args", args, "RESULT:", newValue);
      } else {
        newValue = await contracts[contractName][functionName]();
      }
      if (formatter && typeof formatter === "function") {
        newValue = formatter(newValue);
      }
      // console.log("GOT VALUE",newValue)
      if (newValue !== value) {
        setValue(newValue);
      }
    } catch (e) {
      console.log(e);
    }
  }

// Only pass a provider to watch on a block if we have a contract and no PollTime
  useOnBlock(
    (contracts && contracts[contractName] && adjustPollTime === 0)&&contracts[contractName].provider,
    () => {
    if (contracts && contracts[contractName] && adjustPollTime === 0) {
      updateValue()
  }
  })

// Use a poller if a pollTime is provided
usePoller(async () => {
  if (contracts && contracts[contractName] && adjustPollTime > 0) {
    if (DEBUG) console.log('polling!', contractName, functionName)
    updateValue()
  }
}, adjustPollTime, contracts && contracts[contractName])

  return value;
}
