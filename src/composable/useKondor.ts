import { ref } from 'vue';
import * as kondor from 'kondor-js';

export interface KondorAccount {
  name: string;
  address: string;
}

const accounts = ref<KondorAccount[]>([]);

export function useKondor() {
  const requestAccounts = async () => {
    try {
      accounts.value =
        (await kondor.getAccounts()) as unknown as KondorAccount[]; // Types in kondor-js are wrong
    } catch (e) {
      console.error('error', e);
    }
  };

  return {
    accounts,
    requestAccounts,
    getSigner: (signerAddress: string) => kondor.getSigner(signerAddress),
  };
}
