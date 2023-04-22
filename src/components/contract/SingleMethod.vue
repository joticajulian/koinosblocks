<template>
  <div class="row">
    <va-collapse
      class="mb-2 mt-2 xs6"
      :color="color"
      style="width: 100%"
      :header="header"
      solid
    >
      <div class="method-content">
        <pre>{{ source }}</pre>
        <RawData v-if="fields.length" :data="fields" label="arguments proto" />
        <p v-if="!isReadOnly && !isKondorConnected" class="not-authorized">
          You need to connect Kondor wallet in order to write to contract
        </p>
        <va-form class="mt-2">
          <ContractInputField
            v-for="field in fields"
            v-if="isReadOnly || isKondorConnected"
            v-model="arg[field.name]"
            :argument="field"
          />
          <va-select
            v-if="!isReadOnly && isKondorConnected"
            v-model="selectedSigner"
            style="width: 100%"
            class="mb-4"
            label="Sign as"
            :options="signers"
          />
          <va-slider
            v-if="!isReadOnly && isKondorConnected"
            v-model="rcLimitPercentage"
            label="RC limit"
            class="mb-4"
            track-label-visible
          >
            <template #trackLabel="{ value }"> {{ value }}% </template>
          </va-slider>
          <va-button
            v-if="!isReadOnly && isKondorConnected"
            class="mb-4"
            color="primary"
            :disabled="!selectedSigner || loading"
            @click="writeContract(details.argument, details.return)"
          >
            Sign and broadcast
          </va-button>
          <va-button
            v-if="isReadOnly"
            class="mb-4"
            color="primary"
            @click="readContract(details.argument, details.return)"
          >
            Read
          </va-button>
          <pre v-if="res">Response: {{ JSON.stringify(res, null, 2) }}</pre>
          <div v-if="txReceipt">
            <span>
              Transaction with ID
              <router-link :to="`/tx/` + txReceipt.id">{{
                txReceipt.id
              }}</router-link>
              created, {{ txReceipt.rc_used }} mana used.
            </span>
            <RawData :data="txReceipt" label="transaction receipt" />
          </div>
          <pre v-if="error">Error: {{ JSON.stringify(error, null, 2) }}</pre>
          <pre v-if="dataError">Data: {{ dataError }}</pre>
        </va-form>
      </div>
    </va-collapse>
  </div>
</template>

<script lang="ts">
import { computed, reactive, ref } from 'vue';
import { VaButton, VaCollapse, VaInput } from 'vuestic-ui';
import { Argument, useClient } from '../../composable/useClient';
import ContractInputField from './contractForm/ContractInputField.vue';
import { useKondor } from '../../composable/useKondor';
import { utils } from 'koilib';
import { Root, Type } from 'protobufjs';
import RawData from '../common/RawData.vue';

export default {
  components: { RawData, VaCollapse, ContractInputField, VaButton },
  props: {
    abi: {
      type: Object,
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    details: {
      type: Object,
      required: true,
    },
    root: {
      type: Object as () => Root,
      required: true,
    },
    signers: {
      type: Array,
      required: true,
    },
  },

  setup(props: any) {
    const res = ref<any | null>(null);
    const arg = reactive({});

    const txReceipt = ref(null);

    const error = ref(null);
    const dataError = ref(null);
    const selectedSigner = ref<string | null>(null);
    const rcLimitPercentage = ref(10);
    const loading = ref(false);

    const { client } = useClient();
    const { getSigner } = useKondor();

    const getType = (type_description: string): Type =>
      props.root.lookup(type_description);

    const encodeArguments = (type: string, input: any): string => {
      if (type == '') {
        return '';
      }
      const inputType = getType(type);
      const message = inputType.create(input);
      return utils.encodeBase64url(
        Buffer.from(inputType.encode(message!).finish()),
      );
    };

    const decodeReturn = (type: string, result: string): any => {
      if (type == '') {
        return result;
      }
      const buffer = utils.decodeBase64url(result);
      return getType(type).decode(buffer).toJSON();
    };

    const fields = computed<Argument[]>((): Argument[] => {
      if (!props.root || props.details.argument == '') {
        return [];
      }
      const type = getType(props.details.argument);
      if (!type || !type.fields) {
        return [];
      }
      return Object.keys(type.fields).map((name) => {
        return {
          name: name,
          details: type.fields[name],
        };
      });
    });

    const convertEntryPoints = (methods: any) => {
      return Object.keys(methods).reduce((acc: any, key: string) => {
        acc[key] = {
          ...methods[key],
          entry_point: parseInt(methods[key]['entry-point'], 16),
        };
        return acc;
      }, {});
    };

    const readContract = async (argumentType: string, responseType: string) => {
      try {
        res.value = null;
        error.value = null;
        dataError.value = null;
        const { result } = await client.chain.readContract(
          props.address,
          parseInt(props.details['entry-point'], 16),
          encodeArguments(argumentType, { ...arg }),
        );
        if (!result) {
          return;
        }
        res.value = decodeReturn(responseType, result);
      } catch (e: any) {
        error.value = e.message;
        dataError.value = e.jse_info?.data;
      }
    };

    const writeContract = async (
      argumentType: string,
      responseType: string,
    ) => {
      try {
        loading.value = true;
        res.value = null;
        txReceipt.value = null;
        error.value = null;
        dataError.value = null;

        const signer = await getSigner(selectedSigner.value!);

        const { rc } = await client.chain.getAccountRC(signer.getAddress());
        const rcLimit = Math.ceil(
          Number(rc) * (Number(rcLimitPercentage.value) / 100),
        ).toString();

        console.log(`Using RC limit: ${rcLimit} out of ${rc}`);

        const tx = await signer.prepareTransaction({
          operations: [
            {
              call_contract: {
                args: encodeArguments(argumentType, { ...arg }),
                contract_id: props.address,
                entry_point: parseInt(props.details['entry-point'], 16),
              },
            },
          ],
          header: {
            rc_limit: rcLimit,
          },
        });

        const abis = {
          [props.address]: {
            methods: convertEntryPoints(props.abi.methods),
            koilib_types: props.root,
          },
        };

        const signedTx = await signer.signTransaction(tx, abis);

        const { receipt } = await client.call('chain', 'submit_transaction', {
          transaction: signedTx,
          broadcast: true,
        });
        console.log(receipt);
        txReceipt.value = receipt;
      } catch (e: any) {
        console.log(e);
        error.value = e.message;
        dataError.value = e.jse_info?.data;
      } finally {
        loading.value = false;
      }
    };

    return {
      readContract,
      writeContract,
      res,
      arg,
      header: computed(() => `${props.name} - ${props.details.description}`),
      source: computed(() => JSON.stringify(props.details, null, 2)),
      color: computed(() =>
        props.details['read-only'] ? '#a8bacc' : '#cccccc',
      ),
      fields,
      error,
      dataError,
      selectedSigner,
      isReadOnly: computed(() => props.details['read-only']),
      isKondorConnected: computed(() => props.signers.length > 0),
      txReceipt,
      rcLimitPercentage,
      loading,
    };
  },
};
</script>

<style scoped>
.not-authorized {
  font-weight: bold;
  margin: 10px 0;
}

.method-content {
  padding: 10px;
}

a {
  color: #34495e;
}

a:hover {
  text-decoration: underline;
}

pre {
  white-space: break-spaces;
}
</style>
