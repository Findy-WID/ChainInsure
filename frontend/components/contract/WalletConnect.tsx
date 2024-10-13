'use client'

import { useConnect } from 'wagmi'
import { Button } from '@/components/ui/button'

export function WalletConnect() {
  const { connect, connectors, 
    // isLoading, pendingConnector 
  } = useConnect()

  return (
    <div>
      {connectors.map((connector) => (
        <Button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {/* {isLoading &&
            pendingConnector?.id === connector.id &&
            ' (connecting)'} */}
        </Button>
      ))}
    </div>
  )
}