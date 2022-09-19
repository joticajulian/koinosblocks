import {reactive, Ref, ref} from 'vue'
import {Client} from 'koinos-rpc'

let client = ref<Client>(new Client(["https://api.koinosblocks.com"]));

export function useClient() {

    const updateApiAddress = (api: string) => {
        client.value = new Client([api]);
    }

    return reactive({
        updateApiAddress,
        client
    })
}
