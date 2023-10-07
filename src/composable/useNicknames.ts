import { reactive } from 'vue';
import { useClient } from './useClient';
import { useContract } from './useContract';
import { utils } from 'koilib';
import { config } from '../config';

export function useNicknames() {
  const { fetchContractMeta, encodeArgs, decodeResult } = useContract();

  const getNicknameOwner = async (name: string): Promise<string> => {
    console.log(`Checking owner of ${name}...`);
    const { client } = useClient();
    const { root } = await fetchContractMeta(config.NICKNAMES_CONTRACT_ID);
    if (!root) {
      throw new Error('Failed to fetch contract meta');
    }
    const normalizedName = name.startsWith('@') ? name.slice(1) : name;
    console.log('Normalized name:', normalizedName);
    const args = encodeArgs(root, 'nft.token', {
      token_id: Buffer.from(normalizedName),
    });

    const { result } = await client.chain.readContract(
      config.NICKNAMES_CONTRACT_ID,
      0xed61c847,
      args,
    );
    const { account } = decodeResult(root, 'common.address', result); // TODO change if decodeResult contains normalizing
    return utils.encodeBase58(utils.decodeBase64(account));
  };

  const getNicknames = async (owner: string): Promise<string[]> => {
    const { client } = useClient();
    const { root } = await fetchContractMeta(config.NICKNAMES_CONTRACT_ID);
    if (!root) {
      throw new Error('Failed to fetch contract meta');
    }
    const args = encodeArgs(root, 'nft.get_tokens_by_owner_args', {
      owner: utils.decodeBase58(owner),
      limit: 1000,
    });
    const { result } = await client.chain.readContract(
      config.NICKNAMES_CONTRACT_ID,
      0xfc13eb75,
      args,
    );
    if (!result) {
      return [];
    }
    const { token_ids } = decodeResult(root, 'nft.token_ids', result);
    return token_ids.map((name) => {
      const hex = utils.toHexString(utils.decodeBase64(name));
      return Buffer.from(hex, 'hex').toString();
    });
  };

  return reactive({
    getNicknameOwner,
    getNicknames,
  });
}
