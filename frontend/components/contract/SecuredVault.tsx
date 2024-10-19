
'use client';
import { useState } from "react";
import {
  useReadContract,
  useAccount,
  useSendTransaction,
  useWriteContract,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { Eye, EyeOff, ScanEye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import securedVaultABI from "../../contractData/SecuredVault";
import { toast } from 'sonner'


export default function SecuredVault({
  vaultAddress,
  userAddress,
}: {
  vaultAddress: `0x${string}`;
  userAddress: `0x${string}`;
}) {
  const [depositAmount, setDepositAmount] = useState("");
  const [unfreezeSecret, setUnfreezeSecret] = useState("");
  const [newThreshold, setNewThreshold] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const { address } = useAccount();
  const { data: hash, sendTransaction } = useSendTransaction();
  const { writeContract } = useWriteContract();

  const { data: vaultBalance } = useReadContract({
    address: vaultAddress,
    abi: securedVaultABI,
    functionName: "getBalance",
  });

  const { data: accountStatus } = useReadContract({
    address: vaultAddress,
    abi: securedVaultABI,
    functionName: "getAccountStatus",
  });

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (amount < 0.001 || amount > 1000) {
      toast.error("Deposit amount must be between 0.001 and 1000 ETH");
      return;
    }
    sendTransaction({
      to: vaultAddress,
      value: parseEther(depositAmount || "0"),
    });
  };

  const handleUnfreeze = () => {
    writeContract({
      address: vaultAddress,
      abi: securedVaultABI,
      functionName: "unfreezeAccount",
      args: [unfreezeSecret],
    });
  };

  const handleSetThreshold = () => {
    const threshold = parseFloat(newThreshold);
    if (threshold < 0.001 || threshold > 1000) {
      toast.error("Threshold must be between 0.001 and 1000 ETH");
      return;
    }
    writeContract({
      address: vaultAddress,
      abi: securedVaultABI,
      functionName: "setThreshold",
      args: [parseEther(newThreshold)],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base xl:text-2xl">Manage Your Secured Vault</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="break-all">Vault Address: {vaultAddress}</p>
          <p>Balance: {vaultBalance ? formatEther(vaultBalance) : "0"} ETH</p>
          <p>Account Status: {accountStatus ? "Frozen" : "Active"}</p>
        </div>

        <Tabs defaultValue="deposit" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="unfreeze" disabled={!accountStatus}>
              Unfreeze
            </TabsTrigger>
            <TabsTrigger value="threshold">Set Threshold</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <form onSubmit={handleDeposit} className="space-y-4">
              <Label htmlFor="depositAmount">Deposit Amount (ETH)</Label>
              <Input
                id="depositAmount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                type="number"
                step="0.001"
                min="0.001"
                max="1000"
                required
              />
              <Button type="submit" className="w-full">
                Deposit
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="unfreeze">
            <div className="space-y-4">
              <Label htmlFor="unfreezeSecret">Unfreeze Secret</Label>
              <div className="flex">
                <Input
                  id="unfreezeSecret"
                  type={showSecret ? "text" : "password"}
                  value={unfreezeSecret}
                  onChange={(e) => setUnfreezeSecret(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="ml-2"
                >
                  {showSecret ? <EyeOff size={20} /> : <ScanEye size={20} />}
                </Button>
              </div>
              <Button onClick={handleUnfreeze} className="w-full">
                Unfreeze Account
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="threshold">
            <div className="space-y-4">
              <Label htmlFor="newThreshold">New Threshold (ETH)</Label>
              <Input
                id="newThreshold"
                type="number"
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
                step="0.001"
                min="0.001"
                max="1000"
              />
              <Button onClick={handleSetThreshold} className="w-full">
                Set New Threshold
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
