<template>
  <tr>
    <td>{{ type }}</td>
    <td>
      <router-link :to="walletLink(operation[Object.keys(operation)[0]].contract_id)">
        {{ operation[Object.keys(operation)[0]].contract_id }}
      </router-link>
    </td>
    <td>{{ humanReadableMethod ? humanReadableMethod: entryPoint }}</td>
    <td><pre>{{ humanReadableArgs ? humanReadableArgs : args }}</pre></td>
    <td>
      <va-popover v-if="!humanReadableArgs && !humanReadableMethod && type != 'upload_contract'" message="Decode operation" >
        <va-icon size="small" @click="decode()" class="material-icons icon">visibility</va-icon>
      </va-popover>
      <va-popover v-if="humanReadableArgs && humanReadableMethod" message="Encode operation" >
        <va-icon size="small" @click="clearDecoded()" class="material-icons icon">visibility_off</va-icon>
      </va-popover>
    </td>
  </tr>
</template>

<script lang="ts">
import {computed, ref} from "vue";
import {useContract} from "../../composable/useContract";
import {Root} from "protobufjs";
import {utils} from "koilib";
import { useNotification } from "../../composable/useNotification";

export default {
  name: 'OperationRow',
  props: {
    operation: {
      type: Object,
      required: true
    }
  },
  methods: {
    walletLink: (address: string) => `/address/${address}`
  },
  setup(props: any) {

    const {fetchContractMeta, normalize} = useContract();
    const {showError} = useNotification();

    console.log(props.operation)

    const contractId = computed(() => props.operation[Object.keys(props.operation)[0]].contract_id);
    const entryPoint = computed(() => props.operation[Object.keys(props.operation)[0]].entry_point ? `0x${props.operation[Object.keys(props.operation)[0]].entry_point?.toString(16)}` : "");
    const args = computed(() => props.operation[Object.keys(props.operation)[0]].args);

    const humanReadableMethod = ref<string | null>(null)
    const humanReadableArgs = ref<string | null>(null)

    const decode = async () => {
      try {
        const {root, abi} = await fetchContractMeta(contractId.value);
        if (!root || !abi) {
          return;
        }
        humanReadableMethod.value = findEntryPoint(entryPoint.value, abi);
        humanReadableArgs.value = decodeArgs(entryPoint.value, args.value, abi, root);
      } catch (e) {
        console.error(e);
        showError('Error occurred while reading contract proto or decoding the arguments')
      }
    }

    const clearDecoded = () => {
      humanReadableMethod.value = null;
      humanReadableArgs.value = null;
    }

    const findEntryPoint = (entryPoint: string, abi: any) => {
      for (const method of Object.keys(abi.methods)) {
        if (abi.methods[method]['entry-point'] === entryPoint) {
          return method;
        }
      }
      return null;
    }

    const decodeArgs = (entryPoint: string, args: string, abi: any, root: Root) => {
      const method = findEntryPoint(entryPoint, abi);
      if (!method) {
        return null;
      }
      const type = root.lookupType(abi.methods[method].argument);
      const buffer = utils.decodeBase64url(args);
      const decoded = type.toObject(type.decode(buffer), {defaults: true, arrays: true, bytes: Array, longs: String, enums: String});
      const normalized = normalize(type, decoded);
      return JSON.stringify(normalized, null, 2);
    }

    return {
      type: computed(() => Object.keys(props.operation)[0]),
      contractId,
      entryPoint,
      args,
      humanReadableMethod,
      humanReadableArgs,
      decode,
      clearDecoded
    }
  }
}
</script>

<style scoped>
.icon {
  font-size: 1.5rem;
  color: #3c87c0;
}
.icon:hover {
  cursor: pointer;
}

pre {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
</style>
