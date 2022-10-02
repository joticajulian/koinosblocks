import {parse, Root, Type} from "protobufjs";
import {useClient} from "./useClient";
import * as koinosPbToProto from "@roamin/koinos-pb-to-proto";
import {ProtoDescriptor} from "@roamin/koinos-pb-to-proto";
import {utils} from "koilib";

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

    // TODO make it recursive
    const normalize = (type: Type, decoded: any): any => {
        const normalized: any = {};
        for(const name of Object.keys(type.fields)) {
            const field = type.fields[name];

            if (field.type !== 'bytes' || !field.options) {
                normalized[field.name] = decoded[field.name];
                continue;
            }

            switch (field.options['(koinos.btype)']) {
                case "BASE58":
                case "CONTRACT_ID":
                case "ADDRESS":
                    normalized[field.name] = utils.encodeBase58(decoded[field.name]);
                    break;
                case "BASE64":
                    normalized[field.name] = utils.encodeBase64url(decoded[field.name]);
                    break;
                case "HEX":
                case "BLOCK_ID":
                case "TRANSACTION_ID":
                    normalized[field.name] = `0x${utils.toHexString(decoded[field.name])}`;
                    break;
                default:
                    normalized[field.name] = decoded[field.name];
            }
        }
        return normalized;
    }


    return {
        fetchContractMeta,
        normalize
    }
}
