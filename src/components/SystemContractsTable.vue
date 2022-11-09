<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>System contracts</va-card-title>
      <va-card-content>
        <table v-if="!loading" class="va-table va-table--hoverable va-table--striped" style="width: 100%;">
          <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Address</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="contract in contracts" v-if="contracts.length" :key="contract.name">
            <td>{{ contract.name }}</td>
            <td>{{ contract.description }}</td>
            <td>
              <router-link :to=toContractLink(contract.address)>{{ contract.address }}</router-link>
            </td>
          </tr>
          </tbody>
        </table>
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">
import {ref} from 'vue'
import {useContract} from "../composable/useContract";
import {useClient} from "../composable/useClient";
import {Root} from "protobufjs";
import {utils} from "koilib";

interface Contract {
  description: string;
  name: string;
  address?: string;
}

export default {

  async setup() {

    const {client} = useClient();

    const loading = ref(true);
    const contracts = ref<Contract[]>([{
      name: 'koin',
      description: 'Koin token',
    }, {
      name: 'vhp',
      description: 'Virtual Hash Power token',
    }, {
      name: 'pob',
      description: 'Proof of Burn consensus algorithm',
    }, {
      name: 'claim',
      description: 'Koin claiming contract',
    }, {
      name: 'governance',
      description: 'Governance mechanism (proposals)',
    }, {
      name: 'name_service',
      description: 'Contract discovery service',
    }, {
      name: 'resources',
      description: 'Blockchain resources contract (MANA)',
    }]);

    const nameService = '19WxDJ9Kcvx4VqQFkpwVmwVEy1hMuwXtQE'

    const {fetchContractMeta, encodeArgs, decodeResult} = useContract();

    const getData = async () => {
      loading.value = true;
      try {
        const {root} = await fetchContractMeta(nameService);
        if (root) {
          const contractsWithAddresses = await Promise.all(contracts.value.map(getContractAddress(root)));
          contracts.value = contractsWithAddresses.filter((contract) => contract.address);
        }
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    };

    const getContractAddress = (root: Root) => {
      return async (contract: Contract): Promise<Contract> => {
        try {
          const args = encodeArgs(root, 'koinos.contracts.name_service.get_address_arguments', {
            name: contract.name
          });
          const {result} = await client.chain.readContract(nameService, 0xa61ae5e8, args);
          const {value: {address}} = decodeResult(root, 'koinos.contracts.name_service.get_address_result', result);
          return {
            ...contract,
            address: utils.encodeBase58(utils.decodeBase64(address))
          };
        } catch (e) {
          console.error(e);
          return contract;
        }
      }
    }

    getData().then();

    return {
      loading,
      contracts,
      toContractLink: (address: string) => `/address/${address}`
    }
  }
}

</script>
