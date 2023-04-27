<template>
  <va-input
    v-model="userInput"
    class="mb-4"
    :label="argument.name"
    :placeholder="placeholder()"
  />
</template>
<script lang="ts">
import { ref, watch } from 'vue';
import { utils } from 'koilib';
import { Argument } from '../../../composable/useClient';

// TODO validate field

export default {
  props: {
    modelValue: {
      type: [Object, String], // TODO fix type to Uint8Array | String | null
      default: '',
    },
    argument: {
      type: Object as () => Argument, // workaround to make it work with ts interface
      required: true,
    },
  },

  setup(props: any, context: any) {
    const userInput = ref('');
    const encodedInput = ref<Uint8Array | number | string | null>(null);

    const encodeValue = (value: any) => {
      if (props.argument.details.type !== 'bytes') return value; // TODO change and fix

      if (!props.argument.details?.options['(koinos.btype)']) {
        return utils.decodeBase64url(value);
      }

      switch (props.argument.details?.options['(koinos.btype)']) {
        case 'BASE58':
        case 'CONTRACT_ID':
        case 'ADDRESS':
          return utils.decodeBase58(value);
        case 'BASE64':
          return utils.decodeBase64url(value);
        case 'HEX':
        case 'BLOCK_ID':
        case 'TRANSACTION_ID':
          return utils.toUint8Array(value.slice(2));
        default:
          throw new Error(
            `unknown btype ${props.argument.details?.options['(koinos.btype)']}`,
          );
      }
    };

    watch(userInput, (value) => {
      if (value === '') {
        encodedInput.value = null;
        context.emit('update:modelValue', encodedInput.value);
        return;
      }
      encodedInput.value = encodeValue(value);
      context.emit('update:modelValue', encodedInput.value);
    });

    const placeholder = (): string => {
      if (props.argument?.details?.options) {
        if (props.argument?.details?.options['(koinos.btype)']) {
          return props.argument?.details?.options[
            '(koinos.btype)'
          ].toLowerCase();
        }
      }
      return props.argument?.details?.type ?? '';
    };

    return {
      placeholder,
      userInput,
    };
  },
};
</script>

<style scoped>
.va-input {
  width: 100%;
}
</style>
