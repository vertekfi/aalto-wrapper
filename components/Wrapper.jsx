import Image from "next/image";
import { useContext, useMemo, useEffect, useState } from "react";
import { Card } from "./utils/Card";
import aaltoLogo from '../public/img/aalto-icon.svg';
import { useAccount, useContractRead, useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { WRAPPER, AALTO, PRICE_ORACLE, defaultChainId } from "../constants";
import { BigNumber, utils, constants } from 'ethers';
import { ExternalLink, ArrowUpRight } from "react-feather";
import NotificationContext from "../context/NotificationContext";
import CountUp from 'react-countup';

export const Wrapper = () => {
  const { popNotification } = useContext(NotificationContext);
  const { address, isConnected } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const [chain, setChain] = useState({ id: defaultChainId });
  const [mode, setMode] = useState('wrap');
  const [allowance, setAllowance] = useState(0);
  const [approvalInProgress, setApprovalInProgress] = useState(false);
  const [wrapInProgress, setWrapInProgress] = useState(false);
  const [unwrapInProgress, setUnwrapInProgress] = useState(false);
  const [inputAmount, setInputAmount] = useState('');
  const [wrappedAaltoBalance, setWrappedAaltoBalance] = useState('');
  const [aaltoBalance, setAaltoBalance] = useState('');
  const [hasSufficientAllowance, setHasSufficientAllowance] = useState(true);
  const [wrappedQuantity, setWrappedQuantity] = useState('0');
  const [unwrappedQuantity, setUnwrappedQuantity] = useState('0');
  const [unwrappedBalance, setUnwrappedBalance] = useState('0');
  const [aaltoPrice, setAaltoPrice] = useState('0');
  const [ratio, setRatio] = useState('0');

  const formatError = (error) => {
    if (error.toString().match(/'(.*?)'/)?.length) {
      return error.toString().match(/'(.*?)'/)[0].replaceAll('\'','');
    }
    if (typeof error === 'object') {
      return JSON.stringify(error);
    }
    return error?.toString();
  }

  const handleInputAmountChanged = (e) => {
    if (isNaN(Number(e.target.value))) return;
    setInputAmount(e.target.value);
  }

  const checkHasSufficientAllowance = async () => {
    if (mode === 'unwrap') return setHasSufficientAllowance(true);
    if (!inputAmount) return setHasSufficientAllowance(true);
    setHasSufficientAllowance(
      BigNumber.from(allowance?.toString() || '0').gte(
        BigNumber.from(inputAmountWei || '0')
      )
    );
  }

  const inputAmountWei = useMemo(() => {
    return utils.parseEther(inputAmount?.toString() || '0');
  }, [inputAmount]);

  const { 
    data: wrappedQuantityData, 
    isFetched: wrappedQuantityIsFetched, 
    internal: { 
      dataUpdatedAt: wrappedQuantityUpdated 
    }} = useContractRead({
    addressOrName: WRAPPER[chain?.id]?.address,
    contractInterface: WRAPPER[chain?.id]?.abi,
    functionName: 'getWrappedQuantity',
    args: [inputAmountWei],
  });

  const { 
    data: unwrappedQuantityData, 
    isFetched: unwrappedQuantityIsFetched, 
    internal: { 
      dataUpdatedAt: unwrappedQuantityUpdated 
    }} = useContractRead({
    addressOrName: WRAPPER[chain?.id]?.address,
    contractInterface: WRAPPER[chain?.id]?.abi,
    functionName: 'getUnwrappedQuantity',
    args: [inputAmountWei],
  });

  const { 
    data: unwrappedBalanceQuantityData, 
    isFetched: unwrappedBalanceQuantityIsFetched, 
    internal: { 
      dataUpdatedAt: unwrappedBalanceQuantityUpdated 
    }} = useContractRead({
    addressOrName: WRAPPER[chain?.id]?.address,
    contractInterface: WRAPPER[chain?.id]?.abi,
    functionName: 'getUnwrappedQuantity',
    args: [aaltoBalance],
  });

  const { 
    data: ratioData, 
    isFetched: ratioIsFetched, 
    internal: { 
      dataUpdatedAt: ratioUpdated 
    }} = useContractRead({
    addressOrName: WRAPPER[chain?.id]?.address,
    contractInterface: WRAPPER[chain?.id]?.abi,
    functionName: 'getUnwrappedQuantity',
    args: [utils.parseEther('1')],
  }); // get the value of 1 Aaalto

  const { 
    data: aaltoPriceData, 
    isFetched: aaltoPriceIsFetched,
    internal: { 
      dataUpdatedAt: aaltoPriceUpdated 
    }} = useContractRead({
    addressOrName: PRICE_ORACLE[56]?.address,
    contractInterface: PRICE_ORACLE[56]?.abi,
    functionName: 'priceOf',
    chainId: 56,
    args: [AALTO[56].address],
  });

  const { 
    data: allowanceData, 
    isFetched: allowanceIsFetched, 
    refetch: refetchAllowances,
    internal: { 
      dataUpdatedAt: allowanceUpdated 
    }} = useContractRead({
    addressOrName: AALTO[chain?.id]?.address,
    contractInterface: AALTO[chain?.id]?.abi,
    functionName: 'allowance',
    args: [address, WRAPPER[chain?.id]?.address],
    watch: true,
  });

  const { 
    data: wrappedAaltoBalanceData, 
    isFetched: wrappedAaltoBalanceIsFetched, 
    refetch: refetchWrappedAaltoBalance,
    internal: { 
      dataUpdatedAt: wrappedAaltoBalanceUpdated 
    }} = useContractRead({
    addressOrName: WRAPPER[chain?.id]?.address,
    contractInterface: WRAPPER[chain?.id]?.abi,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  const { 
    data: aaltoBalanceData, 
    isFetched: aaltoBalanceIsFetched, 
    refetch: refetchAaltoBalance,
    internal: { 
      dataUpdatedAt: aaltoBalanceUpdated 
    }} = useContractRead({
    addressOrName: AALTO[chain?.id]?.address,
    contractInterface: AALTO[chain?.id]?.abi,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  const { config: approveConfig } = usePrepareContractWrite({
    addressOrName: AALTO[chain?.id]?.address,
    contractInterface: AALTO[chain?.id]?.abi,
    functionName: 'approve',
    args: [WRAPPER[chain?.id]?.address, constants.MaxUint256]
  });

  const { write: approve, isLoading: approvalIsLoading  } = useContractWrite({
    ...approveConfig,
    async onSuccess (data) {
      setApprovalInProgress(true);
      popNotification({
        type: 'success',
        title: 'Approval Submitted',
        description: 
          <div className="flex items-center">
            <span className="mt-1">{`View on ${chain?.blockExplorers?.default?.name}`}</span> 
            <ExternalLink className="ml-1 h-5 w-5" />
          </div>
        ,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
      await data.wait();
      const refetchedAlowance = await refetchAllowances();
      setAllowance(refetchedAlowance?.data);
      checkHasSufficientAllowance();
      refetchWrapPrepare();
      setApprovalInProgress(false);
      popNotification({
        type: 'success',
        title: 'Approval Confirmed!',
        description: 
          <div className="flex items-center">
            <span className="mt-1">{`View on ${chain?.blockExplorers?.default?.name}`}</span> 
            <ExternalLink className="ml-1 h-5 w-5" />
          </div>
        ,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
    },
    onError (e) {
      popNotification({
        type: 'error',
        title: 'Approval Error!',
        description: typeof e === 'object' ? JSON.stringify(e) : e?.toString(),
      });
    }
  });

  const { config: wrapConfig, error: wrapError, refetch: refetchWrapPrepare } = usePrepareContractWrite({
    addressOrName: WRAPPER[chain?.id]?.address,
    contractInterface: WRAPPER[chain?.id]?.abi,
    functionName: 'wrap',
    args: [inputAmountWei]
  });

  const { write: wrap, isLoading: wrapIsLoading  } = useContractWrite({
    ...wrapConfig,
    async onSuccess (data) {
      setWrapInProgress(true);
      popNotification({
        type: 'success',
        title: 'Wrap Submitted',
        description: 
          <div className="flex items-center">
            <span className="mt-1">{`View on ${chain?.blockExplorers?.default?.name}`}</span> 
            <ExternalLink className="ml-1 h-5 w-5" />
          </div>
        ,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
      await data.wait();
      setWrapInProgress(false);
      popNotification({
        type: 'success',
        title: 'Wrap Confirmed!',
        description: 
          <div className="flex items-center">
            <span className="mt-1">{`View on ${chain?.blockExplorers?.default?.name}`}</span> 
            <ExternalLink className="ml-1 h-5 w-5" />
          </div>
        ,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
      const refetchedWrappedBalance = await refetchWrappedAaltoBalance();
      setWrappedAaltoBalance(refetchedWrappedBalance?.data);
      const refetchedBalance = await refetchAaltoBalance();
      setAaltoBalance(refetchedBalance?.data);
      setInputAmount('');
    },
    onError (e) {
      popNotification({
        type: 'error',
        title: 'Wrap Error!',
        description: typeof e === 'object' ? JSON.stringify(e) : e?.toString(),
      });
      setInputAmount('');
    }
  });

  const { config: unwrapConfig, error: unwrapError } = usePrepareContractWrite({
    addressOrName: WRAPPER[chain?.id]?.address,
    contractInterface: WRAPPER[chain?.id]?.abi,
    functionName: 'wrap',
    args: [inputAmountWei]
  });

  const { write: unwrap, isLoading: unwrapIsLoading  } = useContractWrite({
    ...unwrapConfig,
    async onSuccess (data) {
      setUnwrapInProgress(true);
      popNotification({
        type: 'success',
        title: 'Unwrap Submitted',
        description: 
          <div className="flex items-center">
            <span className="mt-1">{`View on ${chain?.blockExplorers?.default?.name}`}</span> 
            <ExternalLink className="ml-1 h-5 w-5" />
          </div>
        ,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
      await data.wait();
      setUnwrapInProgress(false);
      popNotification({
        type: 'success',
        title: 'Unwrap Confirmed!',
        description: 
          <div className="flex items-center">
            <span className="mt-1">{`View on ${chain?.blockExplorers?.default?.name}`}</span> 
            <ExternalLink className="ml-1 h-5 w-5" />
          </div>
        ,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
      const refetchedWrappedBalance = await refetchWrappedAaltoBalance();
      setWrappedAaltoBalance(refetchedWrappedBalance?.data);
      const refetchedBalance = await refetchAaltoBalance();
      setAaltoBalance(refetchedBalance?.data);
      setInputAmount('');
    },
    onError (e) {
      popNotification({
        type: 'error',
        title: 'Unwrap Error!',
        description: typeof e === 'object' ? JSON.stringify(e) : e?.toString(),
      });
      setInputAmount('');
    }
  });

  useEffect(() => {
    setAllowance(allowanceData);
  }, [allowanceIsFetched, allowanceUpdated]);

  useEffect(() => {
    if (!allowance) return setHasSufficientAllowance(false);
    checkHasSufficientAllowance();
  }, [allowance, inputAmountWei, mode]);

  useEffect(() => {
    setWrappedAaltoBalance(wrappedAaltoBalanceData);
  }, [wrappedAaltoBalanceIsFetched, wrappedAaltoBalanceUpdated]);

  useEffect(() => {
    setAaltoBalance(aaltoBalanceData);
  }, [aaltoBalanceIsFetched, aaltoBalanceUpdated]);

  useEffect(() => {
    setUnwrappedQuantity(unwrappedQuantityData?.toString());
  }, [unwrappedQuantityIsFetched, unwrappedQuantityUpdated]);

  useEffect(() => {
    setWrappedQuantity(wrappedQuantityData?.toString());
  }, [wrappedQuantityIsFetched, wrappedQuantityUpdated]);

  useEffect(() => {
    setUnwrappedBalance(unwrappedBalanceQuantityData?.toString());
  }, [unwrappedBalanceQuantityIsFetched, unwrappedBalanceQuantityUpdated]);

  useEffect(() => {
    setAaltoPrice(aaltoPriceData?.toString() || '0');
  }, [aaltoPriceIsFetched, aaltoPriceUpdated]);

  useEffect(() => {
    if (!ratioData || ratioData?.toString() === '0') {
      setRatio('Loading...');
    }
    setRatio(1 / Number(utils.formatEther(ratioData?.toString() || utils.parseEther('1'))));
  }, [ratioIsFetched, ratioUpdated]);

  const userAaltoBalanceUsd = useMemo(() => {
    return Number(utils.formatEther(aaltoBalance || '0')) * Number(utils.formatEther(aaltoPrice || '0'));
  }, [aaltoBalance, aaltoPrice]);

  const userWrappedAaltoBalanceUsd = useMemo(() => {
    return Number(utils.formatEther(wrappedAaltoBalance || '0')) / Number(utils.formatEther(aaltoPrice || '0'));
  }, [unwrappedBalance, aaltoPrice]);

  useEffect(() => {
    if (isConnected && connectedChain) {
      setChain(connectedChain);
    } else {
      setChain({ id: defaultChainId });
    }
  }, [isConnected, connectedChain]);


  const maxWrap = () => {
    setInputAmount(utils.formatEther(aaltoBalance?.toString()));
  }

  const maxUnwrap = () => {
    setInputAmount(utils.formatEther(wrappedAaltoBalance?.toString()));
  }

  return (
    <div className="sm:mx-0 mx-2">
      <div className="text-center mt-12 text-white">
        <div className="mb-4">
          <Image
            src={aaltoLogo}
            height={75}
            width={75}
          />
        </div>
        <h1 className="text-6xl font-bold">Wrap &amp; Unwrap</h1>
        <div className="text-xl mt-4">Wrap your Aalto into wAALTO and interact with our ecosystem while the Aalto within still rebases!</div>
      </div>
      <div className="flex w-full justify-center mt-8">
        <a 
          className={`btn ${mode === 'wrap' ? 'btn-primary' : 'btn-ghost text-white'} btn-sm rounded-3xl mr-2`}
          onClick={() => setMode('wrap')}
        >
          Wrap
        </a>
        <a 
          className={`btn ${mode === 'unwrap' ? 'btn-primary' : 'btn-ghost text-white'} btn-sm rounded-3xl ml-2`}
          onClick={() => setMode('unwrap')}
        >
          Unwrap
        </a>
      </div>
      <div className="flex w-full justify-center mt-4">
        <Card>
          <div className="flex w-full justify-between">
            <div className="grid grid-rows-3">
              <div className="heading">Aalto Balance</div>
              <div>
                <CountUp end={utils.formatEther(aaltoBalance?.toString() || '0')} decimals={2} separator="," />
              </div>
              <div>
                <CountUp end={userAaltoBalanceUsd} decimals={2} separator="," prefix="~" suffix="&nbsp;USD" />
              </div>
            </div>
            <div className="grid grid-rows-3">
              <div className="w-full flex justify-end">
                <div className="heading"><span className="lowercase">w</span>Aalto Balance</div>
              </div>
              <div className="flex justify-end">
                <CountUp end={utils.formatEther(wrappedAaltoBalance?.toString() || '0')} decimals={2} separator="," />
              </div>
              <div className="flex justify-end">
                <CountUp end={userWrappedAaltoBalanceUsd} decimals={2} separator="," prefix="~" suffix="&nbsp;USD" />
              </div>
            </div>
          </div>

          <div className="grid grid-flow-row mt-4">
            <div className="text-xs text-brand-gray tracking-widest">
            {mode === "wrap" ? "AALTO AMOUNT" : "wAALTO AMOUNT"}
            </div>
            <div className="relative rounded-sm shadow-sm">
              <div className="absolute inset-y-0 ml-2 flex items-center">
                {
                  mode === "wrap" ? 
                  <Image
                    src={aaltoLogo}
                    height={20}
                    width={20}
                  />
                : <img
                    src="https://github.com/0xBriz/token-list/blob/1336217076f0fcfa734d52bea28fe5e0bfa6e549/images/waalto-token-round.png?raw=true"
                    alt=""
                    width={22}
                    height={22}
                    style={{ marginRight: "6px" }}
                  />
                }
               
              </div>
              <input 
                type="text" 
                placeholder={`Amount to ${mode}`} 
                className="input input-sm w-full rounded-sm bg-brand-blue-black border-brand-dark-gray pl-8 shadow-inner"
                value={inputAmount}
                onChange={handleInputAmountChanged}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <div className="badge badge-primary mr-2 cursor-pointer" onClick={() => {
                  mode === 'wrap' ? maxWrap() : maxUnwrap();
                }}>Max</div>
              </div>
            </div>
            <div className="mb-6">
            {
              !hasSufficientAllowance
              ?
                <a 
                  className={`btn btn-block btn-sm btn-primary mt-2 rounded-sm${approvalIsLoading || approvalInProgress ? 'loading' : ''}`}
                  onClick={() => approve?.()}
                >
                  Enable
                </a>
              :
                <button
                  className={`btn btn-block btn-sm btn-primary mt-2 rounded-sm ${
                    mode === 'wrap' && (wrapIsLoading || wrapInProgress) 
                    ? 'loading'
                    : mode === 'unwrap' && (unwrapIsLoading || unwrapInProgress)
                      ? 'loading'
                      : ''
                  }`}
                  onClick={() => {
                    mode === 'wrap' ? wrap?.() : unwrap?.();
                  }}
                  disabled={ (mode === 'wrap' && wrapError) || (mode === 'unwrap' && unwrapError) }
                >
                  <span className="capitalize">{ mode }</span>
                </button>
            }
    
            </div>
            <div className="mb-6">
              <button
                className={`btn btn-block btn-sm btn-primary mt-2 rounded-sm`}
                onClick={() => {
                  window.open(
                    "https://aequinox.exchange/#/pool/0xe53896c872b39fa3254262d18157447504b211de00020000000000000000000d",
                    "__blank",
                  );
                }}
              >
              <img
                src="https://github.com/0xBriz/token-list/blob/main/images/aeq_token.png?raw=true"
                alt="AEQ Token"
                height={20}
                width={20}
                style={{
                  marginRight: "5px",
                }}
              />{" "}
              <span style={{
                    marginRight: "5px",
                  }}>
              Go to wAALTO-BUSD pool
             </span> <ExternalLink size={20}/>
              </button>
            </div>
            <div className="flex justify-between mb-1">
              <div className="text-brand-gray">You will receive</div>
              <div>
                {
                  mode === 'wrap'
                  ? <CountUp end={utils.formatEther(unwrappedQuantity?.toString() || '0')} decimals={2} separator="," suffix="&nbsp;wAALTO" />
                  : <CountUp end={utils.formatEther(wrappedQuantity?.toString() || '0')} decimals={2} separator="," suffix="&nbsp;Aalto" />    
                }
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-brand-gray">Ratio</div>
              <div>1 wAALTO = {ratio || '0'} Aalto</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}