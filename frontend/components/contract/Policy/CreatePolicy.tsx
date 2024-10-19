// "use client";

// import { useState } from "react";
// import { useAccount, useWriteContract, useReadContract } from "wagmi";
// import { parseEther } from "viem";
// import INSURANCE_MANAGER_ABI from "@/contractData/InsuranceManager";
// import { toast } from "sonner";

// const INSURANCE_MANAGER_ADDRESS = "0x51045De164CEB24f866fb788650748aEC8370769";

// export function CreatePolicy() {
//   const [coverageAmount, setCoverageAmount] = useState("");
//   const [period, setPeriod] = useState("");
//   const [error, setError] = useState("");

//   const { address } = useAccount();

//   // Read premium fee
//   const { data: premiumFee } = useReadContract({
//     address: INSURANCE_MANAGER_ADDRESS,
//     abi: INSURANCE_MANAGER_ABI,
//     functionName: "getPremiumFee",
//     args: [parseEther(coverageAmount), BigInt(period)],
//   });

//   // Write contract function
//   const { writeContractAsync, isPending } = useWriteContract();

//   const handleCreatePolicy = async () => {
//     if (!address || !coverageAmount || !period) return;

//     try {
//       setError("");



//       // Get premium fee as a BigInt (assuming getPremiumFee returns a BigInt in wei)
//       const premiumFeeBigInt = premiumFee || 0n; // Default to 0n if undefined

//       console.log("Coverage Amount (wei):", parseEther(coverageAmount));
//       console.log("Period (days):", BigInt(period));
//       console.log("Premium Fee (wei):", premiumFeeBigInt);

//       await writeContractAsync({
//         address: INSURANCE_MANAGER_ADDRESS,
//         abi: INSURANCE_MANAGER_ABI,
//         functionName: "createPolicy",
//         args: [parseEther(coverageAmount), BigInt(period)],
//         value: premiumFeeBigInt, // Send the premium fee as value
//       });

//       // Success toast
//       toast.success(`Policy created successfully!`);

//       // Clear form after successful transaction
//       setCoverageAmount("");
//       setPeriod("");
//     } catch (err: any) {
//       setError(err.message || "Error creating policy");
//       // Error toast
//       toast.error(`Error creating policy: ${err.message}`);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Create Insurance Policy</h2>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Coverage Amount (ETH)
//           </label>
//           <input
//             type="number"
//             value={coverageAmount}
//             onChange={(e) => setCoverageAmount(e.target.value)}
//             className="w-full p-2 border rounded"
//             placeholder="Enter coverage amount"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Period (days)
//           </label>
//           <input
//             type="number"
//             value={period}
//             onChange={(e) => setPeriod(e.target.value)}
//             className="w-full p-2 border rounded"
//             placeholder="Enter period in days"
//           />
//         </div>

//         {premiumFee !== undefined && (
//           <div className="bg-gray-50 p-3 rounded">
//             <p className="text-sm">
//               Premium Fee:{" "}
//               {(() => {
//                 // Check if premiumFee is a bigint
//                 if (typeof premiumFee === "bigint") {
//                   // Convert bigint to number and return as a number
//                   return Number(premiumFee) / 1e18; // Returns a number
//                 }
//                 // Check if premiumFee is a number and return as a number
//                 if (typeof premiumFee === "number") {
//                   return premiumFee; // Returns a number
//                 }
//                 // Fallback to a string if the type doesn't match
//                 return "0"; // Returns a string
//               })()}{" "}
//               ETH
//             </p>
//           </div>
//         )}

//         {/* {premiumFee && (
//   <div className="bg-gray-50 p-3 rounded">
//     <p className="text-sm">
//       Premium Fee: {premiumFee ? (Number(premiumFee) / 1e18).toFixed(6) : '0'} ETH
//     </p>
//   </div>
// )} */}

//         <button
//           onClick={handleCreatePolicy}
//           disabled={isPending || !coverageAmount || !period}
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {isPending ? "Creating Policy..." : "Create Policy"}
//         </button>

//         {/* {error && <div className="text-red-600 text-sm">{error}</div>} */}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseEther } from "viem";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import INSURANCE_MANAGER_ABI from "@/contractData/InsuranceManager";

const INSURANCE_MANAGER_ADDRESS = "0x51045De164CEB24f866fb788650748aEC8370769";

// Create Policy Component
export function CreatePolicy() {
  const [coverageAmount, setCoverageAmount] = useState("");
  const [period, setPeriod] = useState("");
  const { address } = useAccount();

  const { data: premiumFee } = useReadContract({
    address: INSURANCE_MANAGER_ADDRESS,
    abi: INSURANCE_MANAGER_ABI,
    functionName: "getPremiumFee",
    args: [parseEther(coverageAmount || "0"), BigInt(period || "0")],
  });

  const { writeContractAsync, isPending } = useWriteContract();

  const handleCreatePolicy = async () => {
    if (!address || !coverageAmount || !period) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const premiumFeeBigInt = premiumFee || 0n;

      await writeContractAsync({
        address: INSURANCE_MANAGER_ADDRESS,
        abi: INSURANCE_MANAGER_ABI,
        functionName: "createPolicy",
        args: [parseEther(coverageAmount), BigInt(period)],
        value: premiumFeeBigInt,
      });

      toast.success("Policy created successfully!");
      setCoverageAmount("");
      setPeriod("");
    } catch (err: any) {
      toast.error(`Error creating policy: ${err.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Insurance Policy</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Coverage Amount (ETH)
          </label>
          <input
            type="number"
            value={coverageAmount}
            onChange={(e) => setCoverageAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter coverage amount"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Period (days)
          </label>
          <input
            type="number"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter period in days"
            min="1"
          />
        </div>

        {premiumFee !== undefined && (
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm">
              Premium Fee: {Number(premiumFee) / 1e18} ETH
            </p>
          </div>
        )}

        <Button
          onClick={handleCreatePolicy}
          disabled={isPending || !coverageAmount || !period}
          className="w-full"
        >
          {isPending ? "Creating Policy..." : "Create Policy"}
        </Button>
      </div>
    </div>
  );
}

// Cancel Policy Component
export function CancelPolicy() {
  const { writeContractAsync, isPending } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelPolicy = async () => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        address: INSURANCE_MANAGER_ADDRESS,
        abi: INSURANCE_MANAGER_ABI,
        functionName: "cancelPolicy",
      });
      toast.success("Policy cancelled successfully!");
    } catch (error: any) {
      console.error("Error cancelling policy:", error);
      toast.error(error?.message || "Failed to cancel policy");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCancelPolicy}
      variant="destructive"
      disabled={isPending || isLoading}
    >
      {isPending || isLoading ? "Cancelling..." : "Cancel Policy"}
    </Button>
  );
}
