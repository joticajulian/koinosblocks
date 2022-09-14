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
          <va-input
              width="100%"
              v-for="field in fields"
              class="mb-4"
              :label="field.name"
              v-model="arg[field.name]"
              :placeholder="field?.details?.options && field?.details.options['(koinos.btype)'] == 'ADDRESS' ? 'address' : field.details.type"
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
import {computed, reactive, Ref, ref, unref, watch} from "vue";
import {Client} from "koinos-rpc";
import * as protobuf from "protobufjs";
import {VaButton, VaInput} from "vuestic-ui";
import base64url from "base64url";
import {utils} from 'koilib'

export default {
  components: {VaInput, VaButton},
  props: {
    client: {
      type: Client,
      required: true
    },
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
    const form: Record<string, any> = reactive({});
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

    watch(arg, (newVal: any, oldVal) => {
      try {
        if (fields.value) {
          for (const field of fields.value) {
            if (!field) {
              continue;
            }
            const value = newVal[field.name];
            if (field.details.options!['(koinos.btype)'] == 'ADDRESS') {
              form[field.name] = utils.decodeBase58(value);
            } else {
              form[field.name] = value;
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }, {deep: true});

    const prepareInputArg = (type: string, input: any) => {
      const inputType = getType(type);

      if (!inputType) {
        return null;
      }
      const message = inputType.create(input)
      return base64url.encode(Buffer.from(inputType!.encode(message!).finish()))
    }

    const fields = computed(() => {
      for (const proto of props.protos) {
        try {
          const parse = protobuf.parse(proto.definition);
          const type = parse.root.lookupType(props.details.argument)
          console.log(type)
          return Object.keys(type.fields).map((name) => {
            return {
              name: name,
              details: type.fields[name]
            }
          });
        } catch (e) {
        }
      }
      return null;
    })

    return {
      readContract: async (argType: string, responseType: string) => {
        try {
          res.value = null;
          error.value = null;
          console.log("submit", argType, responseType);

          const {result} = await props.client.call('chain', 'read_contract', {
            args: prepareInputArg(argType, {...form}),
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
      form,
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
