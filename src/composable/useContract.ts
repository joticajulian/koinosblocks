import {reactive, Ref, ref} from 'vue'
import {Field, parse, Root} from "protobufjs";
import {useClient} from "./useClient";
import * as koinosPbToProto from "@roamin/koinos-pb-to-proto";
import {useToast} from "vuestic-ui";

export interface ContractMeta {
    abi: any | null;
    root: Root | null;
}

export function useContract() {

    const {client} = useClient();

    const fetchContractMeta = async (contractId: string): Promise<ContractMeta> => {
        const {meta} = await client.contractMetaStore.getContractMeta(contractId);
        try {
            const abi = JSON.parse(meta.abi);
            const protos = koinosPbToProto.convert(abi.types);
            const root = parseProtos(protos);
            return {
                abi,
                root
            }
        } catch (e) {
            console.error(e);
            return {
                abi: null,
                root: null
            }
        }
    }

    const parseProtos = (protos: any[]): Root => {
        const root = new Root();
        for (const proto of protos){
            parse(proto.definition, root, {keepCase: true})
        }
        return root;
    }

    return reactive({
        fetchContractMeta,
    })
}
