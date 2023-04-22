<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>System contracts</va-card-title>
      <va-card-content>
        <table
          v-if="!loading"
          class="va-table va-table--hoverable va-table--striped"
          style="width: 100%"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="contract in contracts"
              v-if="contracts.length"
              :key="contract.name"
            >
              <td>{{ contract.name }}</td>
              <td>{{ contract.description }}</td>
              <td>
                <router-link :to="toContractLink(contract.address)">
                  {{ contract.address }}
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useNameService } from '../composable/useNameService';

interface Contract {
  description: string;
  name: string;
  address?: string;
}

export default {
  async setup() {
    const loading = ref(true);

    const contracts = ref<Contract[]>([
      {
        name: 'koin',
        description: 'Koin token',
      },
      {
        name: 'vhp',
        description: 'Virtual Hash Power token',
      },
      {
        name: 'pob',
        description: 'Proof of Burn consensus algorithm',
      },
      {
        name: 'claim',
        description: 'Koin claiming contract',
      },
      {
        name: 'governance',
        description: 'Governance mechanism (proposals)',
      },
      {
        name: 'name_service',
        description: 'Contract discovery service',
      },
      {
        name: 'resources',
        description: 'Blockchain resources contract (MANA)',
      },
    ]);

    const { getSystemContractAddress } = useNameService();

    const getContractAddress = async (contract: Contract) => {
      try {
        return {
          ...contract,
          address: await getSystemContractAddress(contract.name),
        };
      } catch (e) {
        console.error(e);
        return contract;
      }
    };

    const getData = async () => {
      loading.value = true;
      try {
        const contractsWithAddresses = await Promise.all(
          contracts.value.map(getContractAddress),
        );
        contracts.value = contractsWithAddresses.filter(
          (contract) => contract.address,
        );
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    };

    getData().then();

    return {
      loading,
      contracts,
      toContractLink: (address: string) => `/address/${address}`,
    };
  },
};
</script>
