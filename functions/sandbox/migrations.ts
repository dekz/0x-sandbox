import { ContractWrappers } from '@0x/contract-wrappers';
import { ContractAddresses, runMigrationsAsync as runZeroExMigrationsAsync } from '@0x/migrations';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { SupportedProvider, TxData } from 'ethereum-types';

import { NETWORK_ID } from './utils';

// tslint:disable-next-line:completed-docs
export async function runMigrationsAsync(
    supportedProvider: SupportedProvider,
    txDefaults: TxData,
): Promise<ContractAddresses> {
    const contractAddresses = await runZeroExMigrationsAsync(supportedProvider, txDefaults);
    const web3Wrapper = new Web3Wrapper(supportedProvider);
    const userAddresses = await web3Wrapper.getAvailableAddressesAsync();
    const contractWrappers = new ContractWrappers(supportedProvider, { contractAddresses, networkId: NETWORK_ID });
    // Set up first account for trading
    await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(contractAddresses.zrxToken, userAddresses[0]);
    // Set up second account for trading
    const weiAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(10), 18);
    await contractWrappers.etherToken.depositAsync(contractAddresses.etherToken, weiAmount, userAddresses[1]);
    await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(contractAddresses.etherToken, userAddresses[1]);
    return contractAddresses;
}
