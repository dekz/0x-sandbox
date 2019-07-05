import { ExchangeContract } from '@0x/abi-gen-wrappers';
import { ContractWrappers } from '@0x/contract-wrappers';
import { devConstants, web3Factory } from '@0x/dev-utils';
import { assetDataUtils, generatePseudoRandomSalt, Order, orderHashUtils, signatureUtils } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';
import { JSONRPCRequestPayload } from 'ethereum-protocol';

import { handle } from './index';
import { addresses, NETWORK_ID, recorderProvider } from './utils';

const providerConfigs = { shouldUseInProcessGanache: true };
const ganacheSubprovider = web3Factory.getRpcProvider(providerConfigs);

const generatePayloads = async (): Promise<JSONRPCRequestPayload[]> => {
    const maker = devConstants.TESTRPC_FIRST_ADDRESS;
    const contractWrappers = new ContractWrappers(recorderProvider, {
        contractAddresses: addresses,
        networkId: NETWORK_ID,
    });
    const exchangeContract: ExchangeContract = await (contractWrappers.exchange as any)._getExchangeContractAsync();
    const nullAddress = '0x0000000000000000000000000000000000000000';
    const order: Order = {
        exchangeAddress: addresses.exchange,
        makerAddress: maker,
        takerAddress: nullAddress,
        feeRecipientAddress: nullAddress,
        senderAddress: nullAddress,
        makerAssetAmount: new BigNumber(1000),
        takerAssetAmount: new BigNumber(1000),
        makerAssetData: assetDataUtils.encodeERC20AssetData(addresses.zrxToken),
        takerAssetData: assetDataUtils.encodeERC20AssetData(addresses.etherToken),
        expirationTimeSeconds: generatePseudoRandomSalt(),
        salt: generatePseudoRandomSalt(),
        takerFee: new BigNumber(0),
        makerFee: new BigNumber(0),
    };
    const signedOrder = await signatureUtils.ecSignOrderAsync(ganacheSubprovider, order, maker);
    const orderHash = orderHashUtils.getOrderHashHex(order);
    await signatureUtils.ecSignOrderAsync(recorderProvider, order, maker);
    // await exchangeContract.cancelOrder.sendTransactionAsync(order, { from: maker });
    await exchangeContract.fillOrder.sendTransactionAsync(order, order.takerAssetAmount, signedOrder.signature, {
        from: '0x6ecbe1db9ef729cbe972c83fb886247691fb6beb',
    });
    // await exchangeContract.filled.callAsync(orderHash);
    // await exchangeContract.cancelled.callAsync(orderHash);
    return recorderProvider.getPayloads();
};

(async () => {
    const payloads = await generatePayloads();
    const request = { body: JSON.stringify(payloads) };
    console.log(request.body);
    const response = await handle(request, {}, {});
    const body = response.body;
    console.log(body);
})();
