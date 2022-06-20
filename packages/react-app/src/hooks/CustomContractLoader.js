
import { Contract } from "@ethersproject/contracts";
import { useState, useEffect } from "react";




export default function useCustomContractLoader(provider, contractName, address) {
  const [contract, setContract] = useState();
  useEffect(() => {
    async function loadContract() {
      if (typeof provider !== "undefined" && contractName && address) {
        try {
          // we need to check to see if this provider has a signer or not
          let signer;
          const accounts = await provider.listAccounts();
          if (accounts && accounts.length > 0) {
            signer = provider.getSigner();
          } else {
            signer = provider;
          }

          const customContract = new Contract(address, require(`../contracts/${contractName}.abi.js`), signer);
          try {
            customContract.bytecode = require(`../contracts/${contractName}.bytecode.js`);
          } catch (e) {
            console.log(e);
          }

          setContract(customContract);
        } catch (e) {
          console.log("ERROR LOADING CONTRACTS!!", e);
        }
      }
    }
    loadContract();
  }, [provider, contractName, address]);
  return contract;
}
