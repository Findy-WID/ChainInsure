import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const StakinPoolModule = buildModule("StakinPoolModule", (m:any) => {

  const paymentTokenAddress_ = "0x6dE9f4b8d4A52D15F1372ef463e27AeAa8a3FdF4";
  const poolAddress_ = "0xbE781D7Bdf469f3d94a62Cdcc407aCe106AEcA74";

    const stakingPool = m.contract("StakingPool", [poolAddress_, paymentTokenAddress_]);

  return { stakingPool };
});

module.exports = StakinPoolModule;