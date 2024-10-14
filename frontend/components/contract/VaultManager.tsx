


/**
|--------------------------------------------------
| max limit 1000eth min 0.001eth
2 add icon to mke the word visible 

|--------------------------------------------------
*/





import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { formatEther, parseEther } from 'viem';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import managerABI from '../../contractData/Manager';
import { SecuredVault } from './SecuredVault';

const MANAGER_CONTRACT_ADDRESS = '0x8690c9e8329aeEB65bB5ad299fD4B6d67882C05D'; // Replace with the actual contract address

export default function VaultManager() {
  const { address } = useAccount();
  const [threshold, setThreshold] = useState('');
  const [secret, setSecret] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const { data: hash, isPending: isWpending, writeContract } = useWriteContract() 

  const { data: vaultBalance } = useReadContract({
    address: MANAGER_CONTRACT_ADDRESS,
    abi: managerABI,
    functionName: 'getVaultBalance',
    args: [address] as any,
  });

  const { data: vaultAddress, error, isPending } = useReadContract({
    address: MANAGER_CONTRACT_ADDRESS,
    abi: managerABI,
    functionName: 'getVaultAddress',
    args: [address] as any,
  });

  const handleCreateVault = () => {
    if (address && threshold && secret) {
      writeContract({
        address: MANAGER_CONTRACT_ADDRESS,
        abi: managerABI,
        functionName: 'createVault',
        args: [address, parseEther(threshold), secret],
      });
    }
  };

  const handleWithdraw = () => {
    if (address && withdrawAddress && withdrawAmount) {
      writeContract({
        address: MANAGER_CONTRACT_ADDRESS,
        abi: managerABI,
        functionName: 'withdrawFunds',
        args: [address, withdrawAddress as any, parseEther(withdrawAmount) as any],
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Vault</CardTitle>
          <CardDescription>Set up a new secured vault</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="threshold">Threshold (ETH)</Label>
            <Input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="Enter threshold in ETH"
            />
          </div>
          <div>
            <Label htmlFor="secret">Secret</Label>
            <Input
              id="secret"
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter secret"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateVault}>
            Create Vault
          </Button>
        </CardFooter>
      </Card>

      {vaultAddress && (
        <Card>
          <CardHeader>
            <CardTitle>Vault Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Vault Address: {vaultAddress}</p>
            {/* <p>Balance: {vaultBalance ? `${parseEther(vaultBalance.toString())} ETH` : '0 ETH'}</p> */}
            <p>Balance: {vaultBalance ? `${formatEther(vaultBalance)} ETH` : '0 ETH'}</p>

          </CardContent>
        </Card>
      )}
      {vaultAddress && address && (
        <SecuredVault vaultAddress={vaultAddress} userAddress={address} />
      )}
    </div>
  );
}
