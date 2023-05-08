import { reactive, ref } from 'vue';
import { Client } from 'koinos-rpc';
import { Field } from 'protobufjs';
import { config } from '../config';

const client = ref<Client>(
  new Client([localStorage.getItem('api') ?? config.DEFAULT_API_NODES[0]]),
);

export interface Argument {
  name: string;
  details: Field;
}

export function useClient() {
  const updateApiAddress = (api: string) => {
    client.value = new Client([api]);
  };

  return reactive({
    updateApiAddress,
    client,
  });
}
