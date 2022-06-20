import { useEffect, useState } from "react";
import { isAddress } from "@ethersproject/address";



const useContractExistsAtAddress = (provider, contractAddress) => {
  const [contractIsDeployed, setContractIsDeployed] = useState(false);

  
  useEffect(() => {
    
    const checkDeployment = async () => {
      if (!isAddress(contractAddress)) return false;
      const bytecode = await provider.getCode(contractAddress);
      setContractIsDeployed(bytecode !== "0x0");
    };
    if (provider) checkDeployment();
  }, [provider, contractAddress]);

  return contractIsDeployed;
};

export default useContractExistsAtAddress;
