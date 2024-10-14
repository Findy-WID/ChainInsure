'use client'

import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import  managerABI  from '../../contractData/Manager';
import  securedVaultABI  from '../../contractData/SecuredVault';
// import { wagmiConfig } from '@/wagmi';
import { getBalance } from 'viem/actions';

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

  // const balance = getBalance(wagmiConfig as any, {
  //   address: vaultAddress as any,
  //   unit: 'ether' as const, 
  // })

  const handleCreateVault = () => {
    if (address && threshold && secret) {
      writeContract({
        address: MANAGER_CONTRACT_ADDRESS,
        abi: managerABI,
        functionName: 'createVault',
        args: [address, parseEther(threshold), secret],
      })
    }
  };


  const handleWithdraw = () => {
    if (address && withdrawAddress && withdrawAmount) {
      writeContract({
        address: MANAGER_CONTRACT_ADDRESS,
        abi: managerABI,
        functionName: 'withdrawFunds',
        args: [address, withdrawAddress as any, parseEther(withdrawAmount) as any]
      })
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
          <Button onClick={handleCreateVault} 
          // disabled={isCreatingVault}
          >
            {
            // isCreatingVault ? 
            // 'Creating...' : 
            'Create Vault'}
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
            <p>Balance: {vaultBalance ? `${parseEther(vaultBalance.toString())} ETH` : '0 ETH'}</p>
          </CardContent>
        </Card>
      )}

      {vaultAddress && (
        <Card>
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="withdrawAddress">Recipient Address</Label>
              <Input
                id="withdrawAddress"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                placeholder="Enter recipient address"
              />
            </div>
            <div>
              <Label htmlFor="withdrawAmount">Amount (ETH)</Label>
              <Input
                id="withdrawAmount"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleWithdraw} 
            // disabled={isWithdrawing}
            >
              {
              // isWithdrawing ? 
              // 'Withdrawing...' : 
              'Withdraw'
              }
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}