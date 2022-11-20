import {reactive} from "vue";
import {useClient} from "./useClient";
import {useContract} from "./useContract";
import {utils} from "koilib";

const mainnetChainid = "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==";
const testnetChainId = "EiAAKqFi-puoXnuJTdn7qBGGJa8yd-dcS2P0ciODe4wupQ==" ;

export function useNameService() {

    const {fetchContractMeta, encodeArgs, decodeResult} = useContract();

    const getNameServiceAddress = async (): Promise<string> => {
        const {client} = useClient();
        const {chain_id} = await client.chain.getChainId();
        return chain_id === testnetChainId ? '1AM1c73tDNTc24KYqYvSHmoZ2C7oe4DZhh' : '19WxDJ9Kcvx4VqQFkpwVmwVEy1hMuwXtQE';
    }

    const getSystemContractAddress = async (name: string): Promise<string> => {
        const {client} = useClient();
        const nameServiceAddress = await getNameServiceAddress();
        const {root} = await fetchContractMeta(nameServiceAddress);
        if (!root) {
            throw new Error('Failed to fetch contract meta');
        }
        const args = encodeArgs(root, 'koinos.contracts.name_service.get_address_arguments', {
            name: name
        });
        const {result} = await client.chain.readContract(nameServiceAddress, 0xa61ae5e8, args);
        const {value: {address}} = decodeResult(root, 'koinos.contracts.name_service.get_address_result', result);
        return utils.encodeBase58(utils.decodeBase64(address));
    }

    return reactive({
        getNameServiceAddress,
        getSystemContractAddress
    })
}
