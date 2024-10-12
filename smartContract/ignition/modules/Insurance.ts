// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;


const InsuranceModule = buildModule("InsuranceModule", (m) => {
  const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
  const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);
  const paymentTokenAddress_ = "0x6dE9f4b8d4A52D15F1372ef463e27AeAa8a3FdF4";
  const poolAddress_ = "0xbE781D7Bdf469f3d94a62Cdcc407aCe106AEcA74";

  const insurance = m.contract("InsurancePolicy", [poolAddress_, paymentTokenAddress_]);

  return { insurance };
});

export default InsuranceModule;
