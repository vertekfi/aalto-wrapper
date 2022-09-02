import Image from 'next/image';
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Activity, ChevronDown } from 'react-feather';
import { useAccount, useConnect, useDisconnect, useEnsName, useNetwork, useSwitchNetwork } from 'wagmi';
import walletIcon from '../../public/img/wallet.svg';

// constants
import { validChains } from '../../constants';
// helpers
import shortenAddress from '../../helpers/shortenAddress'

export default function Connect() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { chain: connectedChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork()
  const { activeConnector, connect, connectors } = useConnect();
  const [hasAccount, setHasAccount] = useState(false);
  
  const [showMenu, setShowMenu] = useState(false);
  const showMenuHandler = () => setShowMenu((showMenu) => !showMenu);

  const { disconnect } = useDisconnect();

  const connectedToWrongNetwork = useMemo(() => {
    if (!connectedChain?.id || !isConnected) return false;
    const validChainIds = validChains?.map(c => c?.id);
    return !validChainIds?.includes(connectedChain?.id);
  }, [connectedChain, isConnected]);

  useEffect(() => {
    setHasAccount(isConnected && !!address);
  }, [address, isConnected]);

  if (hasAccount) return (
    <div className="top-16 text-right">
      <div className="dropdown dropdown-end">
        {
          connectedToWrongNetwork 
          ? 
            <div>
              <label tabIndex={0} className="btn btn-sm h-10 btn-warning rounded-sm m-1">
                <Activity
                  className="mr-2 h-5 w-5"
                  aria-hidden="true"
                />
                <span className="mr-2">Wrong Network</span>
                <ChevronDown
                  className="ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-neutral-content text-neutral w-52">
                { !validChains ? <></> : validChains
                  ?.map(chain => (
                    <li key={chain.id}>
                      <a
                        className="hover:bg-neutral-focus hover:text-neutral-content"
                        onClick={async () => {
                          switchNetwork?.(chain?.id);
                          setShowMenu(false);
                        }}
                      >
                        {chain?.name}
                      </a>
                    </li>
                ))}
              </ul>
            </div>
          :
            <div>
              <label tabIndex={0} className="btn btn-sm m-1 h-10 rounded-sm bg-gradient-to-r from-primary via-primary to-brand-blue-black hover:bg-opacity-50">
                <Image
                  src={walletIcon}
                  height={16}
                  width={16}
                  alt=""
                />
                <span className="mx-2">{ensName ?? shortenAddress(address)}</span>
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-neutral-content text-neutral rounded-sm w-52">
                <li>
                  <a onClick={() => { disconnect(); setShowMenu(false); }} className="hover:bg-neutral-focus hover:text-neutral-content">
                    Disconnect
                  </a>
                </li>
              </ul>
            </div>
        }
      </div>
    </div>
  )

  return (
    <div className="top-16 w-56 text-right">
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-sm m-1 h-10 rounded-sm bg-gradient-to-r from-primary via-primary to-brand-blue-black" onClick={showMenuHandler}>
          <Image
            src={walletIcon}
            height={16}
            width={16}
            alt=""
          />
          <span className="ml-2">Connect</span>
        </label>
        {showMenu && <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-neutral-content text-neutral rounded-sm w-52">
          { !connectors ? <></> : connectors
            .filter(connector => connector.ready && connector.id !== activeConnector?.id)
            ?.map(connector => (
              <li key={connector.id} className="rounded-sm">
                <a
                  className="hover:bg-neutral-focus hover:text-neutral-content"
                  onClick={async () => {
                    await connect({ connector });
                    setShowMenu(false);
                  }}
                >
                  {connector.name}
                </a>
              </li>
            ))}
        </ul>}
      </div>
    </div>
  )
}