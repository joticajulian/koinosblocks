<template>
  <div class="row">
    <va-collapse class="mb-2 mt-2"
                 :color="color"
                 style="width: 100%;"
                 :header="header"
                 solid
    >
      <div>
        <pre>{{ source }}</pre>
        <pre>Arguments: {{ JSON.stringify(fields, null, 2) }}</pre>
        <va-form style="width: 400px;">
          <ContractInputField
              v-for="field in fields"
              v-model="arg[field.name]"
              :argument="field"
          />
        </va-form>
        <pre v-if="res">Response: {{ JSON.stringify(res, null, 2) }}</pre>
        <pre v-if="error">Error: {{ JSON.stringify(error, null, 2) }}</pre>
        <va-button
            v-if="details['read-only']"
            class="mb-4"
            color="primary"
            @click="readContract(details.argument, details.return)">Read
        </va-button>

      </div>
    </va-collapse>
  </div>
</template>

<script lang="ts">
import {computed, reactive, Ref, ref} from "vue";
import * as protobuf from "protobufjs";
import {VaButton, VaInput} from "vuestic-ui";
import base64url from "base64url";
import {Argument, useClient} from "../../composable/useClient";
import ContractInputField from "./contractForm/ContractInputField.vue";

export default {
  components: {ContractInputField, VaInput, VaButton},
  props: {
    address: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    details: {
      type: Object,
      required: true
    },
    protos: {
      type: Array,
      required: true
    }
  },
  setup(props: any) {

    let res: Ref<any | null> = ref(null)
    let arg = reactive({});
    const error = ref(null);

    const getType = (type_description: string) => {
      for (const proto of props.protos) {
        try {
          const parse = protobuf.parse(proto.definition);
          const type = parse.root.lookupType(type_description)
          return type;
        } catch (e) {
        }
      }
      return null;
    }

    const prepareInputArg = (type: string, input: any) => {

      console.log("type", type);
      console.log("input", input);

      const inputType = getType(type);

      if (!inputType) {
        return null;
      }
      const message = inputType.create(input)
      return base64url.encode(Buffer.from(inputType!.encode(message!).finish()))
    }

    const fields = computed<Argument[]>((): Argument[] => {
      for (const proto of props.protos) {
        try {
          const parse = protobuf.parse(proto.definition);
          const type = parse.root.lookupType(props.details.argument)
          return Object.keys(type.fields).map((name) => {
            return {
              name: name,
              details: type.fields[name]
            }
          });
        } catch (e) {
        }
      }
      return [];
    })

    return {
      readContract: async (argType: string, responseType: string) => {
        try {
          const {client} = useClient();

          res.value = null;
          error.value = null;

          console.log("submit", argType, responseType);

          const {result} = await client.call('chain', 'read_contract', {
            args: prepareInputArg(argType, {...arg}),
            contract_id: props.address,
            entry_point: parseInt(props.details['entry-point'], 16)
          });

          console.log('result', result);

          if (!result) {
            return;
          }

          const type = getType(responseType);
          const buf = base64url.toBuffer(result);
          const message = type?.decode(buf)
          if (message) {
            const mes = message.toJSON();
            console.log(mes);
            res.value = mes
          }
        } catch (e: any) {
          error.value = e.message;
        }

      },
      res,
      arg,
      header: computed(() => `${props.name} - ${props.details.description}`),
      source: computed(() => JSON.stringify(props.details, null, 2)),
      color: computed(() => props.details['read-only'] ? "#a8bacc" : "#cccccc"),
      fields,
      error
    }
  }
}
</script>

<style scoped>
pre {
  margin: 10px;
}
va-input {
  margin: 10px;
}
</style>
