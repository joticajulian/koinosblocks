import { reactive } from 'vue';
import { Client } from 'koinos-rpc';
import { Token } from 'koinos-rpc/dist/helpers/token';
import { useClient } from './useClient';

export function useToken() {
  const { client } = useClient();

  const createToken = async (address: string) => {
    return Token.create(client as Client, address);
  };

  return reactive({
    createToken,
  });
}
