import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { AccountId, Address, Hash } from "@polkadot/types/interfaces";
import { RegistryTypes } from "@polkadot/types/types";

export type PolkadotHelper = {
    readonly api: ApiPromise,
    readonly faucet: KeyringPair,
}

export async function newHelper(node_uri: string, faucet_seed: string): Promise<PolkadotHelper> {
    const ws = new WsProvider(node_uri);
    const api = await ApiPromise.create({ provider: ws,  types: runtimeTypes });

    const keyring = new Keyring();
    const faucet = keyring.addFromSeed(Buffer.from(faucet_seed, 'hex'), undefined, 'sr25519');

    return {
        api,
        faucet,
    }
}

export async function transfer(helper: PolkadotHelper, target: Address, amount: BigInt): Promise<Hash> {
    return await helper.api.tx.balances
        .transfer(target, amount.toString())
        .signAndSend(helper.faucet);
}

const runtimeTypes: RegistryTypes = {
    ActionId: "u128",
    TokenId: "u128",
    CommodityId: "H256",
    CommodityInfo: "Vec<u8>",
    NftId: "H256",
    NftInfo: "Vec<u8>",
    EgldBalance: "Balance",
    Commodity: "(H256, Vec<u8>)",
    LocalAction: {
      _enum: {
        //@ts-expect-error enum struct
        Unfreeze: {
          to: "AccountId",
          value: "Balance",
        },
        //@ts-expect-error enum struct
        RpcCall: {
          contract: "AccountId",
          call_data: "Vec<u8>",
        },
        //@ts-expect-error enum struct
        TransferWrapped: {
          to: "AccountId",
          value: "Balance",
        },
      },
    },
    ActionInfo: {
      action: "LocalAction",
      validators: "BTreeSet<AccountId>",
    },
  };