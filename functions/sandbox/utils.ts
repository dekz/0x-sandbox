import { getContractAddressesForNetworkOrThrow } from '@0x/contract-addresses';
import { devConstants } from '@0x/dev-utils';
import { constants } from '@0x/dev-utils/lib/src/constants';
import {
    FakeGasEstimateSubprovider,
    GanacheSubprovider,
    MnemonicWalletSubprovider,
    Web3ProviderEngine,
} from '@0x/subproviders';
import { AbiDecoder, providerUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { JSONRPCRequestPayload, SupportedProvider, TransactionReceiptWithDecodedLogs } from 'ethereum-types';

const logger = {
    // tslint:disable-next-line:no-empty
    log: (arg: any) => {},
};
export const TX_DEFAULTS = {
    from: devConstants.TESTRPC_FIRST_ADDRESS,
};
export const NETWORK_ID = 50;
export const addresses = getContractAddressesForNetworkOrThrow(NETWORK_ID);
export const MNEMONIC = 'concert load couple harbor equip island argue ramp clarify fence smart topic';

export const buildProvider = (): SupportedProvider => {
    const provider = new Web3ProviderEngine();
    const ganacheSubprovider = new GanacheSubprovider({
        vmErrorsOnRPCResponse: false,
        gasLimit: constants.GAS_LIMIT,
        logger,
        verbose: false,
        port: 8545,
        network_id: NETWORK_ID,
        mnemonic: MNEMONIC,
    } as any);
    provider.addProvider(new FakeGasEstimateSubprovider(constants.GAS_LIMIT));
    provider.addProvider(ganacheSubprovider);
    providerUtils.startProviderEngine(provider);
    return provider;
};

export const buildResponse = (result: any) => {
    const httpResponse = {
        isBase64Encoded: false,
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(result),
    };
    return httpResponse;
};

export const decodeLogs = (txReceipt: TransactionReceiptWithDecodedLogs, abiDecoder: AbiDecoder) => {
    const logs = [];
    for (const log of txReceipt.logs) {
        try {
            const decodedLog = abiDecoder.tryToDecodeLogOrNoop(log);
            logs.push(decodedLog);
        } catch (e) {
            logs.push(log);
        }
    }
    return logs;
};

const payloads: JSONRPCRequestPayload[] = [];
const mnemonicWallet = new MnemonicWalletSubprovider({ mnemonic: MNEMONIC });
const fakeSignerProvider = new Web3ProviderEngine();
fakeSignerProvider.addProvider(mnemonicWallet);
providerUtils.startProviderEngine(fakeSignerProvider);

export const recorderProvider = {
    getPayloads: () => payloads,
    sendAsync: async (payload: JSONRPCRequestPayload, cb: any): Promise<void> => {
        const web3Wrapper = new Web3Wrapper(fakeSignerProvider);
        if (payload.method === 'eth_estimateGas') {
            cb(null, { result: constants.GAS_LIMIT });
        } else {
            // Return signature requests for better flow
            if (
                payload.method === 'eth_accounts' ||
                payload.method === 'eth_sign' ||
                payload.method === 'eth_signTypedData'
            ) {
                const result = await web3Wrapper.sendRawPayloadAsync(payload);
                cb(null, { result });
            }
            payloads.push(payload);
        }
        cb(null, { result: '0x' });
    },
};
