import {reactive} from "vue";
import {useClient} from "./useClient";
import {useContract} from "./useContract";
import {utils} from "koilib";

const KAP_CONTRACT_ADDRESS = '13tmzDmfqCsbYT26C4CmKxq86d33senqH3'

export function useKAP() {

    const {fetchContractMeta, encodeArgs, decodeResult} = useContract();

    const getKAPOwnerAddress = async (name: string): Promise<string> => {
        const {client} = useClient();
        const {root} = await fetchContractMeta(KAP_CONTRACT_ADDRESS);
        if (!root) {
            throw new Error('Failed to fetch contract meta');
        }
        const args = encodeArgs(root, 'collections.get_name_arguments', {
            name: name
        });
        const {result} = await client.chain.readContract(KAP_CONTRACT_ADDRESS, 0xe5070a16, args);
        const {owner} = decodeResult(root, 'collections.name_object', result);
        return utils.encodeBase58(utils.decodeBase64(owner));
    }

    return reactive({
        getKAPOwnerAddress
    })
}
