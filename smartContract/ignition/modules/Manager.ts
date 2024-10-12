import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";




export default buildModule("ManagerModule", (m) => {
    const manager =  m.contract("Manager");
    
    return {manager};
})

