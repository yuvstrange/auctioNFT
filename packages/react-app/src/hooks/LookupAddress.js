import { useState, useEffect } from "react";
import { getAddress, isAddress } from "@ethersproject/address";
import { useLocalStorage } from "."



const lookupAddress = async (provider, address) => {
  if(isAddress(address)) {
    
    try {
      
      const reportedName = await provider.lookupAddress(address);

      const resolvedAddress = await provider.resolveName(reportedName);

      if (getAddress(address) === getAddress(resolvedAddress)) {
        return reportedName;
      } else {
        return getAddress(address)
      }
    } catch (e) {
      return getAddress(address)
    }
  }
  return 0;
};

const useLookupAddress = (provider, address) => {
  const [ensName, setEnsName] = useState(address);
  

  useEffect(() => {

    let cache = window.localStorage.getItem('ensCache_'+address);
    cache = cache && JSON.parse(cache)

    if( cache && cache.timestamp>Date.now()){
      setEnsName(cache.name)
    }else{
      if (provider) {
        lookupAddress(provider, address).then((name) => {
          if (name) {
            setEnsName(name);
            window.localStorage.setItem('ensCache_'+address, JSON.stringify({
              timestamp:Date.now()+360000,
              name:name
            }))
          }
        });
      }
    }
  }, [provider, address, setEnsName]);

  return ensName;
};

export default useLookupAddress;
