# 0x Sandbox

Provides a sandboxed runtime to replay any number of JSONRPC requests and receive their responses. Each new request executes in a fresh environment so a request can be considered stateless. Multiple users executing at the same time do not clash as they are sandboxed from each other.

This enables a developer to provide a simple interface into seeing the results of contract outputs for a given scenario, without requiring the entire Ganache runtime or a pre-deployed test network.

Use cases:

-   Runnable documentation examples with results
-   Generate test signatures for a user without a wallet
-   Quickly and easily generate test data (Signed Orders, EIP712)

## Example

List accounts and sign with EIP712.

**Request**

```json
[
    {
        "id": 1,
        "params": [],
        "jsonrpc": "2.0",
        "method": "eth_accounts"
    },
    {
        "id": 2,
        "params": [
            "0x5409ed021d9299bf6814279a6a1411a7e866a631",
            {
                "types": {
                    "EIP712Domain": [
                        {
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "name": "version",
                            "type": "string"
                        },
                        {
                            "name": "verifyingContract",
                            "type": "address"
                        }
                    ],
                    "Order": [
                        {
                            "name": "makerAddress",
                            "type": "address"
                        },
                        {
                            "name": "takerAddress",
                            "type": "address"
                        },
                        {
                            "name": "feeRecipientAddress",
                            "type": "address"
                        },
                        {
                            "name": "senderAddress",
                            "type": "address"
                        },
                        {
                            "name": "makerAssetAmount",
                            "type": "uint256"
                        },
                        {
                            "name": "takerAssetAmount",
                            "type": "uint256"
                        },
                        {
                            "name": "makerFee",
                            "type": "uint256"
                        },
                        {
                            "name": "takerFee",
                            "type": "uint256"
                        },
                        {
                            "name": "expirationTimeSeconds",
                            "type": "uint256"
                        },
                        {
                            "name": "salt",
                            "type": "uint256"
                        },
                        {
                            "name": "makerAssetData",
                            "type": "bytes"
                        },
                        {
                            "name": "takerAssetData",
                            "type": "bytes"
                        }
                    ]
                },
                "domain": {
                    "name": "0x Protocol",
                    "version": "2",
                    "verifyingContract": "0x48bacb9266a570d521063ef5dd96e61686dbe788"
                },
                "message": {
                    "exchangeAddress": "0x48bacb9266a570d521063ef5dd96e61686dbe788",
                    "makerAddress": "0x5409ed021d9299bf6814279a6a1411a7e866a631",
                    "takerAddress": "0x0000000000000000000000000000000000000000",
                    "feeRecipientAddress": "0x0000000000000000000000000000000000000000",
                    "senderAddress": "0x0000000000000000000000000000000000000000",
                    "makerAssetAmount": "1000",
                    "takerAssetAmount": "1000",
                    "makerAssetData": "0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c",
                    "takerAssetData": "0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082",
                    "expirationTimeSeconds": "96097608051760036456632387423125371855986249348833106664676554039085047358612",
                    "salt": "76015437130882660261159651308605817041596035130262292114382227154808448204046",
                    "takerFee": "0",
                    "makerFee": "0"
                },
                "primaryType": "Order"
            }
        ],
        "jsonrpc": "2.0",
        "method": "eth_signTypedData"
    }
]
```

**Response**

```json
[
    {
        "payload": {
            ...
            "method": "eth_accounts"
        },
        "result": [
            "0x5409ed021d9299bf6814279a6a1411a7e866a631",
            "0x6ecbe1db9ef729cbe972c83fb886247691fb6beb",
            "0xe36ea790bc9d7ab70c55260c66d52b1eca985f84",
            "0xe834ec434daba538cd1b9fe1582052b880bd7e63",
            "0x78dc5d2d739606d31509c31d654056a45185ecb6",
            "0xa8dda8d7f5310e4a9e24f8eba77e091ac264f872",
            "0x06cef8e666768cc40cc78cf93d9611019ddcb628",
            "0x4404ac8bd8f9618d27ad2f1485aa1b2cfd82482d",
            "0x7457d5e02197480db681d3fdf256c7aca21bdc12",
            "0x91c987bf62d25945db517bdaa840a6c661374402"
        ]
    },
    {
        "payload": {
            ...
            "method": "eth_signTypedData"
        },
        "result": "0xccf330d5fd8477825b01e5a3231206bc2f7cdb1a02ffd16e57db5895d61b05030aa2677bac1527f7519df02e6748607577406b869e2f5b72d69fa15ab65cd4f31c"
    }
]
```

Cancel an order and query the state of filled and cancelled.

**Request**

```json
[
    {
        "id": 2,
        "params": [
            {
                "to": "0x48bacb9266a570d521063ef5dd96e61686dbe788",
                "data": "0xd46b02c300000000000000000000000000000000000000000000000000000000000000200000000000000000000000005409ed021d9299bf6814279a6a1411a7e866a63100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d755d8031d33f19aa929579ddf3c46cd0ae23fa676046fd347bad89b73c7bc135b128eb3956c1be3d93aa985edcb2a41e320896a846f1625eede2b3f3ec345ce000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000024f47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024f47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e808200000000000000000000000000000000000000000000000000000000",
                "gas": "0x6acfc0",
                "from": "0x5409ed021d9299bf6814279a6a1411a7e866a631"
            }
        ],
        "jsonrpc": "2.0",
        "method": "eth_sendTransaction"
    },
    {
        "id": 3,
        "params": [
            {
                "to": "0x48bacb9266a570d521063ef5dd96e61686dbe788",
                "data": "0x288cdc915e9783e47972827721f824c77911b693daf7daf4c6715dadc9c9f672a197c9aa"
            },
            "latest"
        ],
        "jsonrpc": "2.0",
        "method": "eth_call"
    },
    {
        "id": 4,
        "params": [
            {
                "to": "0x48bacb9266a570d521063ef5dd96e61686dbe788",
                "data": "0x2ac126225e9783e47972827721f824c77911b693daf7daf4c6715dadc9c9f672a197c9aa"
            },
            "latest"
        ],
        "jsonrpc": "2.0",
        "method": "eth_call"
    }
]
```

**Response**

```json
[
    {
        "payload": {
            "id": 2,
            "params": [
                {
                    "to": "0x48bacb9266a570d521063ef5dd96e61686dbe788",
                    "data": "0xd46b02c300000000000000000000000000000000000000000000000000000000000000200000000000000000000000005409ed021d9299bf6814279a6a1411a7e866a63100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d755d8031d33f19aa929579ddf3c46cd0ae23fa676046fd347bad89b73c7bc135b128eb3956c1be3d93aa985edcb2a41e320896a846f1625eede2b3f3ec345ce000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000024f47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024f47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e808200000000000000000000000000000000000000000000000000000000",
                    "gas": "0x6acfc0",
                    "from": "0x5409ed021d9299bf6814279a6a1411a7e866a631"
                }
            ],
            "jsonrpc": "2.0",
            "method": "eth_sendTransaction"
        },
        "result": {
            "receipt": {
                "transactionHash": "0x86f70b4039b82830b0cc99ed354bc7cdf725085517525ba3ed2244a89ade06ea",
                "transactionIndex": 0,
                "blockHash": "0x3c62cea405812b9cc17709096cce34e7e82e747ab2c3e743ef4ed63e86d3a513",
                "blockNumber": 33,
                "from": "0x5409ed021d9299bf6814279a6a1411a7e866a631",
                "to": "0x48bacb9266a570d521063ef5dd96e61686dbe788",
                "gasUsed": 76641,
                "cumulativeGasUsed": 76641,
                "contractAddress": null,
                "logs": [
                    {
                        "logIndex": 0,
                        "transactionIndex": 0,
                        "transactionHash": "0x86f70b4039b82830b0cc99ed354bc7cdf725085517525ba3ed2244a89ade06ea",
                        "blockHash": "0x3c62cea405812b9cc17709096cce34e7e82e747ab2c3e743ef4ed63e86d3a513",
                        "blockNumber": 33,
                        "address": "0x48bacb9266a570d521063ef5dd96e61686dbe788",
                        "data": "0x0000000000000000000000005409ed021d9299bf6814279a6a1411a7e866a631000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000024f47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024f47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e808200000000000000000000000000000000000000000000000000000000",
                        "topics": [
                            "0xdc47b3613d9fe400085f6dbdc99453462279057e6207385042827ed6b1a62cf7",
                            "0x0000000000000000000000005409ed021d9299bf6814279a6a1411a7e866a631",
                            "0x0000000000000000000000000000000000000000000000000000000000000000",
                            "0x5e9783e47972827721f824c77911b693daf7daf4c6715dadc9c9f672a197c9aa"
                        ],
                        "type": "mined",
                        "event": "Cancel",
                        "args": {
                            "makerAddress": "0x5409ed021d9299bf6814279a6a1411a7e866a631",
                            "feeRecipientAddress": "0x0000000000000000000000000000000000000000",
                            "senderAddress": "0x5409ed021d9299bf6814279a6a1411a7e866a631",
                            "orderHash": "0x5e9783e47972827721f824c77911b693daf7daf4c6715dadc9c9f672a197c9aa",
                            "makerAssetData": "0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c",
                            "takerAssetData": "0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082"
                        }
                    }
                ],
                "status": 1,
                "logsBloom": "0x00000000000000000000000000000000100000000000000000200000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000100000000000000000000000000008000008000000000000000000020000000000000000000800000000000000000000000040000000000000000000000002000000000000000080000000000000000000000000000000000008000000000000000000000000000000000000000000004000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000",
                "v": "0x1c",
                "r": "0x9827b3c7960efed1f82de20e4b9c394bba2e4a0a9b4017bb2cd90f7d002f0ac3",
                "s": "0x106d7d4bc5c0e91bc0653279619f94614ff4608778ae8ed146f58db91ef1ab35"
            }
        }
    },
    {
        "payload": {
            "id": 3,
            "params": [
                {
                    "to": "0x48bacb9266a570d521063ef5dd96e61686dbe788",
                    "data": "0x288cdc915e9783e47972827721f824c77911b693daf7daf4c6715dadc9c9f672a197c9aa"
                },
                "latest"
            ],
            "jsonrpc": "2.0",
            "method": "eth_call"
        },
        "result": "0x0000000000000000000000000000000000000000000000000000000000000000"
    },
    {
        "payload": {
            "id": 4,
            "params": [
                {
                    "to": "0x48bacb9266a570d521063ef5dd96e61686dbe788",
                    "data": "0x2ac126225e9783e47972827721f824c77911b693daf7daf4c6715dadc9c9f672a197c9aa"
                },
                "latest"
            ],
            "jsonrpc": "2.0",
            "method": "eth_call"
        },
        "result": "0x0000000000000000000000000000000000000000000000000000000000000001"
    }
]
```

## Lambda

We host this service allowing any consumer to call via a lambda at URL https://x0t9gv1466.execute-api.us-east-1.amazonaws.com/test/sandbox.

For example:

```sh
export DATA='[{"id":1,"params":[],"jsonrpc":"2.0","method":"eth_accounts"},{"id":2,"params":["0x5409ed021d9299bf6814279a6a1411a7e866a631",{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"verifyingContract","type":"address"}],"Order":[{"name":"makerAddress","type":"address"},{"name":"takerAddress","type":"address"},{"name":"feeRecipientAddress","type":"address"},{"name":"senderAddress","type":"address"},{"name":"makerAssetAmount","type":"uint256"},{"name":"takerAssetAmount","type":"uint256"},{"name":"makerFee","type":"uint256"},{"name":"takerFee","type":"uint256"},{"name":"expirationTimeSeconds","type":"uint256"},{"name":"salt","type":"uint256"},{"name":"makerAssetData","type":"bytes"},{"name":"takerAssetData","type":"bytes"}]},"domain":{"name":"0x Protocol","version":"2","verifyingContract":"0x48bacb9266a570d521063ef5dd96e61686dbe788"},"message":{"exchangeAddress":"0x48bacb9266a570d521063ef5dd96e61686dbe788","makerAddress":"0x5409ed021d9299bf6814279a6a1411a7e866a631","takerAddress":"0x0000000000000000000000000000000000000000","feeRecipientAddress":"0x0000000000000000000000000000000000000000","senderAddress":"0x0000000000000000000000000000000000000000","makerAssetAmount":"1000","takerAssetAmount":"1000","makerAssetData":"0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c","takerAssetData":"0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082","expirationTimeSeconds":"98119090220420793290099074920862299662277466652421895082263395045765581399922","salt":"27224947334704417905013873223344464434514002491657395458665998836131281035369","takerFee":"0","makerFee":"0"},"primaryType":"Order"}],"jsonrpc":"2.0","method":"eth_signTypedData"}]'
curl --header "Content-Type: application/json" --request POST --data $DATA https://x0t9gv1466.execute-api.us-east-1.amazonaws.com/test/sandbox

```

## Generating requests

Using a recorder provider we can record the JSONRPC requests for replay later. This also has the added advantage of being language agnostic since it purely results in ABI encoded JSONRPC requests.

```typescript
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
    await exchangeContract.cancelOrder.sendTransactionAsync(order, { from: maker });
    await exchangeContract.filled.callAsync(orderHash);
    await exchangeContract.cancelled.callAsync(orderHash);
    return recorderProvider.getPayloads();
};
```

## Build and deploy

```
yarn build:lambda
yarn deploy:lambda
```

Note some of the library dependencies are not compatible with Webpack:

-   `got` is a library which looks for the presence of electron, a work around exists in the latest version though the ganache dependency has this locked down. We override in `package.json`.
-   `scrypt` has a strange relative file path error, replacing the require with `require("scrypt")` is sufficient but is manually required every yarn install.
