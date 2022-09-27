import {ref} from "vue";
import * as kondor from "engrave-kondor-js";

const accounts = ref([]);

export function useKondor() {

    const requestAccounts = () => {
        kondor.getAccounts().then((accs: any) => {
            accounts.value = accs;
        }).catch(e => {
            console.error('error', e)
        })
    };

    return {
        accounts,
        requestAccounts,
        getSigner: (signerAddress: string) => kondor.getSigner(signerAddress)
    }
}