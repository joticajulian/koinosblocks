import {parse, Root} from "protobufjs";
import {useClient} from "./useClient";
import * as koinosPbToProto from "@roamin/koinos-pb-to-proto";
import {ProtoDescriptor} from "@roamin/koinos-pb-to-proto";

export interface ContractMeta {
    abi: any | null;
    root: Root | null;
    protos: ProtoDescriptor[] | null;
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
                root,
                protos
            }
        } catch (e) {
            console.error(e);
            return {
                abi: null,
                root: null,
                protos: null
            }
        }
    }

    const parseProtos = (protos: ProtoDescriptor[]): Root => {
        const root = new Root();
        for (const proto of protos) {
            try {
                parse(proto.definition, root, {keepCase: true})
            } catch (e) {
            }
        }
        return root;
    }

    return {
        fetchContractMeta
    }
}
