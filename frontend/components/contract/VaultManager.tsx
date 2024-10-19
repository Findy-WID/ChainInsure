

import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import managerABI from '../../contractData/Manager';
import { SecuredVault } from './SecuredVault';

const MANAGER_CONTRACT_ADDRESS = '0x8690c9e8329aeEB65bB5ad299fD4B6d67882C05D';

export default function VaultManager() {
  const { address } = useAccount();
  const [threshold, setThreshold] = useState('');
  const [secret, setSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { writeContract } = useWriteContract();

  const { data: vaultBalance } = useReadContract({
    address: MANAGER_CONTRACT_ADDRESS,
    abi: managerABI,
    functionName: 'getVaultBalance',
    args: [address] as any,
  });

  const { data: vaultAddress } = useReadContract({
    address: MANAGER_CONTRACT_ADDRESS,
    abi: managerABI,
    functionName: 'getVaultAddress',
    args: [address] as any,
  });

  const handleCreateVault = useCallback(() => {
    if (address && threshold && secret) {
      const thresholdValue = parseFloat(threshold);
      if (thresholdValue < 0.001 || thresholdValue > 1000) {
        toast.error('Threshold must be between 0.001 and 1000 ETH');
        return;
      }
      setIsLoading(true);
      writeContract({
        address: MANAGER_CONTRACT_ADDRESS,
        abi: managerABI,
        functionName: 'createVault',
        args: [address, parseEther(threshold), secret],
      }, {
        onSuccess: () => {
          toast.success('Vault created successfully!');
          setIsLoading(false);
        },
        onError: (error) => {
          toast.error(`Error creating vault: ${error.message}`);
          setIsLoading(false);
        },
      });
    }
  }, [address, threshold, secret, writeContract]);

  return (
    <Tabs defaultValue={vaultAddress ? "manage" : "create"} className="space-y-8">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">Create Vault</TabsTrigger>
        <TabsTrigger value="manage" disabled={!vaultAddress}>Manage Vault</TabsTrigger>
      </TabsList>

      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Create New Vault</CardTitle>
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
                placeholder="Enter threshold in ETH (0.001 - 1000)"
                min="0.001"
                max="1000"
                step="0.001"
              />
            </div>
            <div>
              <Label htmlFor="secret">Secret</Label>
              <div className="flex">
                <Input
                  id="secret"
                  type={showSecret ? 'text' : 'password'}
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter secret"
                />
                <Button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="ml-2"
                >
                  {showSecret ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateVault} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Vault'}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="manage">
        {vaultAddress && (
          <>
            <Card className="mb-8 [@media(max-width:996px)]:w-[50%]">
              <CardHeader>
                <CardTitle>Vault Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='[@media(max-width:996px)]:truncate [@media(max-width:996px)]:w-[70%]'>Vault Address: {vaultAddress}</p>
                <p>Balance: {vaultBalance ? `${formatEther(vaultBalance)} ETH` : '0 ETH'}</p>
              </CardContent>
            </Card>
            <SecuredVault vaultAddress={vaultAddress as `0x${string}`} userAddress={address as `0x${string}`} />
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}