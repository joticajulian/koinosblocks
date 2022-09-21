import {reactive, Ref, ref} from 'vue'
import {Client} from 'koinos-rpc'
import {Field} from "protobufjs";

let client = ref<Client>(new Client(["https://api.koinosblocks.com"]));

export interface Argument {
    name: string;
    details: Field;
}

export function useClient() {

    const updateApiAddress = (api: string) => {
        client.value = new Client([api]);
    }

    return reactive({
        updateApiAddress,
        client
    })
}
