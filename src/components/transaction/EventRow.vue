<template>
  <tr>
    <td>{{ event.name }}</td>
    <td>
      <router-link :to=toContractLink(event.source)>{{ event.source }}</router-link>
    </td>
    <td>
      <span class="impacted" v-for="wallet in event.impacted" >
      <router-link class="impacted" :to=toContractLink(wallet)>{{
          wallet
        }}
      </router-link>
      </span>
    </td>
    <td><pre class="data">{{ humanReadableData ? humanReadableData : event.data }}</pre>
    </td>
    <td>
      <va-popover v-if="!humanReadableData" message="Decode data">
        <va-icon size="small" @click="decode()" class="material-icons icon">visibility</va-icon>
      </va-popover>
      <va-popover v-if="humanReadableData" message="Encode data">
        <va-icon size="small" @click="clearDecoded()" class="material-icons icon">visibility_off</va-icon>
      </va-popover>
    </td>
  </tr>
</template>

<script lang="ts">
import {useContract} from "../../composable/useContract.js";
import {useNotification} from "../../composable/useNotification.js";
import {computed, ref} from "vue";
import {Root} from "protobufjs";
import {utils} from "koilib";

export default {
  name: 'EventRow',
  props: {
    event: {
      type: Object,
      required: true
    },
  },
  setup(props: any) {
    const {fetchContractMeta, normalize} = useContract();
    const {showError} = useNotification();

    const contractId = computed(() => props.event.source);
    const potentialTypes = computed(() => ([
      `${props.event.name.split('.')[1]}_event`,
      `${props.event.name.replace('.', '_')}_event`,
    ]));
    const data = computed(() => props.event.data);

    const humanReadableData = ref<string | null>(null)

    const clearDecoded = () => {
      humanReadableData.value = null;
    }

    const decode = async () => {
      try {
        const {root, abi} = await fetchContractMeta(contractId.value);
        if (!root || !abi) {
          return;
        }
        humanReadableData.value = decodeData(root, data.value);
      } catch (e) {
        console.error(e);
        showError('Error occurred while reading contract proto or decoding the data')
      }
    }

    const decodeData = (root: Root, data: any) => {
      let type = null;
      for (const potentialType of potentialTypes.value) {
        try {
          type = root.lookupType(potentialType);
        } catch (e) {
          continue;
        }
      }
      if (!type) {
        throw new Error(`Cannot find type for event ${props.event.name}`);
      }
      const buffer = utils.decodeBase64url(data);
      const decoded = type.toObject(type.decode(buffer), {
        defaults: true,
        arrays: true,
        bytes: Array,
        longs: String,
        enums: String
      });
      const normalized = normalize(type, decoded);
      return JSON.stringify(normalized, null, 2);
    }

    return {
      humanReadableData,
      clearDecoded,
      decode,
      toContractLink: (address: string) => `/address/${address}`
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

.impacted {
  display: block;
}

.data {
  /*overflow: scroll;*/
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
