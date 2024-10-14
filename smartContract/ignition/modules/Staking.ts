import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";




export default buildModule("StakinPoolModule", (m) => {
    const stakinPool =  m.contract("StakinPool");
    
    return {stakinPool};
})

