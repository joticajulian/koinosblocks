<template>
  <tr>
    <td>{{ event.name }}</td>
    <td>
      <router-link :to="toContractLink(event.source)">
        {{ event.source }}
      </router-link>
    </td>
    <td>
      <span v-for="wallet in event.impacted" :key="wallet" class="impacted">
        <router-link class="impacted" :to="toContractLink(wallet)"
          >{{ wallet }}
        </router-link>
      </span>
    </td>
    <td>
      <pre class="data">{{
        humanReadableData ? humanReadableData : event.data
      }}</pre>
    </td>
    <td>
      <va-popover v-if="!humanReadableData" message="Decode data">
        <va-icon size="small" class="material-icons icon" @click="decode()">
          visibility
        </va-icon>
      </va-popover>
      <va-popover v-if="humanReadableData" message="Encode data">
        <va-icon
          size="small"
          class="material-icons icon"
          @click="clearDecoded()"
        >
          visibility_off
        </va-icon>
      </va-popover>
    </td>
  </tr>
</template>

<script lang="ts">
import { useContract } from '../../composable/useContract.js';
import { useNotification } from '../../composable/useNotification.js';
import { computed, ref } from 'vue';
import { Root } from 'protobufjs';
import { utils } from 'koilib';

export default {
  name: 'EventRow',
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  setup(props: any) {
    const { fetchContractMeta, normalize } = useContract();
    const { showError } = useNotification();

    const contractId = computed(() => props.event.source);

    const data = computed(() => props.event.data);

    const humanReadableData = ref<string | null>(null);

    const clearDecoded = () => {
      humanReadableData.value = null;
    };

    const getPotentialEventTypes = (abi: any, event: any) => {
      const types = [
        event.name,
        `${event.name.split('.')[1]}_event`,
        `${event.name.replace('.', '_')}_event`,
      ];

      if (abi.events) {
        const eventType = Object.keys(abi.events).find((e) => e === event.name);
        if (eventType) {
          types.push(abi.events[eventType].argument);
        }
      }
      return types;
    };

    const decode = async () => {
      try {
        const { root, abi } = await fetchContractMeta(contractId.value);
        if (!root || !abi) {
          showError(
            'Error occurred while reading contract ABI or decoding the data',
          );
          return;
        }
        humanReadableData.value = decodeData(root, abi, data.value);
      } catch (e) {
        console.error(e);
        showError(
          'Error occurred while reading contract ABI or decoding the data',
        );
      }
    };

    const decodeData = (root: Root, abi: any, data: any) => {
      const potentialTypes = getPotentialEventTypes(abi, props.event);
      let type = null;
      for (const potentialType of potentialTypes) {
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
        enums: String,
      });
      const normalized = normalize(type, decoded);
      return JSON.stringify(normalized, null, 2);
    };

    return {
      humanReadableData,
      clearDecoded,
      decode,
      toContractLink: (address: string) => `/address/${address}`,
    };
  },
};
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
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
