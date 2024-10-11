import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";




export default buildModule("SecuredVaultModule", (m) => {
    const securedVault =  m.contract("SecuredVault", ["0x7D2714b0915fcd32d1af94A1A412e4d263abBb1a", BigInt(10e8), "sepolia"]);
    
    return {securedVault};
})

