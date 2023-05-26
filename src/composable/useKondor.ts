import { ref } from 'vue';
import * as kondor from 'kondor-js';

export interface KondorAccount {
  name: string;
  address: string;
}

const storageAccounts = localStorage.getItem('kondorAccounts');

const accounts = ref<KondorAccount[]>(
  storageAccounts ? JSON.parse(storageAccounts) : [],
);

export function useKondor() {
  const requestAccounts = async () => {
    try {
      accounts.value =
        (await kondor.getAccounts()) as unknown as KondorAccount[]; // Types in kondor-js are wrong
      localStorage.setItem('kondorAccounts', JSON.stringify(accounts.value));
    } catch (e) {
      console.error('error', e);
    }
  };

  return {
    accounts,
    requestAccounts,
    getSigner: (signerAddress: string) => kondor.getSigner(signerAddress),
    logout: () => {
      localStorage.removeItem('kondorAccounts');
      accounts.value = [];
    },
  };
}
