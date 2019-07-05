import { ContractWrappers } from '@0x/contract-wrappers';
import { TransactionReceiptWithDecodedLogs, Web3Wrapper } from '@0x/web3-wrapper';
import { JSONRPCRequestPayload } from 'ethereum-protocol';

import { runMigrationsAsync } from './migrations';
import { addresses, buildProvider, buildResponse, NETWORK_ID, TX_DEFAULTS } from './utils';

interface TxResult {
    receipt: TransactionReceiptWithDecodedLogs;
    callResult: string;
}

interface PayloadResult {
    payload: JSONRPCRequestPayload;
    result: TxResult | string;
}

const runAsync = async (payloads: JSONRPCRequestPayload[]): Promise<PayloadResult[]> => {
    let deployed = false;
    const provider = buildProvider();
    const contractWrappers = new ContractWrappers(provider, { contractAddresses: addresses, networkId: NETWORK_ID });
    // Re-use this web3 wrapper as it has all of the ABI's added
    const web3Wrapper = (contractWrappers as any)._web3Wrapper as Web3Wrapper;
    const results: PayloadResult[] = [];
    for (const payload of payloads) {
        // Only deploy if we have to, i.e free signatures for testing
        if (payload.method === 'eth_call' || payload.method === 'eth_sendTransaction') {
            if (!deployed) {
                await runMigrationsAsync(provider, TX_DEFAULTS);
                deployed = true;
            }
        }
        if (payload.method === 'eth_sendTransaction') {
            const callResult = (await web3Wrapper.sendRawPayloadAsync({ ...payload, method: 'eth_call' })) as string;
            const result = await web3Wrapper.sendRawPayloadAsync(payload);
            const receipt: TransactionReceiptWithDecodedLogs = await web3Wrapper.awaitTransactionMinedAsync(
                result as string,
            );
            results.push({ payload, result: { receipt, callResult } });
        } else {
            const result = await web3Wrapper.sendRawPayloadAsync(payload);
            results.push({ payload, result: result as string });
        }
    }
    return results;
};

export const handle = async (_event: any, _ctx: any, _cb: any): Promise<any> => {
    const payloads: JSONRPCRequestPayload[] = JSON.parse(_event.body);
    const results = await runAsync(payloads);
    return buildResponse(results);
};
