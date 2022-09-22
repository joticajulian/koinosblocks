<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>Proposal details</va-card-title>
      <va-card-content v-if="details">
        <ElementWithDescription element="Vote start height" :description="details.vote_start_height ?? '0'" />
        <ElementWithDescription element="Vote threshold" :description="details.vote_threshold ?? '0'" />
        <ElementWithDescription element="Vote tally" :description="details.vote_tally ?? '0'" />
        <ElementWithDescription element="Shall authorize" :description="details.shall_authorize ?? 'false'" />
        <ElementWithDescription element="Updates governance" :description="details.updates_governance ?? 'false'" />
        <ElementWithDescription element="Status" :description="getStatus(details.status ?? 0)" />
        <ElementWithDescription element="Operation merkle root" :description="details.operation_merkle_root"
                                :value="details.fee"/>
        <ElementWithDescription element="Fee" :description="details.fee" :value="details.fee"/>
        <RawData v-if="details" :data="details"/>
      </va-card-content>
    </va-card>
  </va-inner-loading>
  <ProposalOperationsTable v-if="details" :operations="details.operations" :loading="loading"/>
</template>

<script lang="ts">
import SingleBlock from "./SingleBlock.vue";
import {ref, watch} from "vue";
import {useClient} from "../composable/useClient";
import * as koinosPbToProto from "@roamin/koinos-pb-to-proto";
import * as protobuf from "protobufjs";
import {Root} from "protobufjs";
import {utils} from "koilib";
import base64url from "base64url";
import RawData from "./RawData.vue";
import ElementWithDescription from "./ElementWithDescription.vue";
import ProposalOperationsTable from "./proposal/ProposalOperationsTable.vue";

export default {
  name: 'SingleProposal',
  components: {ProposalOperationsTable, ElementWithDescription, RawData, SingleBlock},
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props: any) {
    const id = ref(props.id);
    const loading = ref(true);
    const root = ref<Root | null>(null);
    const details = ref<any | null>(null);

    const {client} = useClient();

    const getGovernanceProto = async () => {
      try {
        const {meta} = await client.contractMetaStore.getContractMeta('1NsnpSsXJDgPTFgFXRiP8F3Acg9gj6VjUi');
        const abi = JSON.parse(meta.abi);
        return koinosPbToProto.convert(abi.types);
      } catch (e) {
        console.error(e);
      }
    }

    const parseProtos = (protos: any[]) => {
      const root = new protobuf.Root();
      for (const proto of protos) {
        try {
          protobuf.parse(proto.definition, root, {keepCase: true});
        } catch (e) {
        }
      }
      console.log(root);
      return root;
    }

    const getProposal = async () => {
      const argumentType = root.value!.lookup('koinos.contracts.governance.get_proposal_by_id_arguments')
      const returnType = root.value!.lookup('koinos.contracts.governance.get_proposal_by_id_result')

      const message = argumentType!.create({proposal_id: utils.toUint8Array(props.id.slice(2))})
      const args = base64url.encode(Buffer.from(argumentType!.encode(message!).finish()))

      const {result} = await client.chain.readContract('1NsnpSsXJDgPTFgFXRiP8F3Acg9gj6VjUi', 0xc66013ad, args);
      const buf = base64url.toBuffer(result);
      const {value} = returnType?.decode(buf).toJSON()
      details.value = value;
    }

    const load = async () => {
      loading.value = true;
      const protos = await getGovernanceProto();
      root.value = parseProtos(protos!);
      console.log(root.value)
      await getProposal();
      loading.value = false;
    }

    load().then(() => {
      console.log('done');
    }).catch((e) => {
      console.log(e);
    });

    const getStatus = (status: number): string => {
      switch (status) {
        case 0:
          return 'pending';
        case 1:
          return 'active';
        case 2:
          return 'approved';
        case 3:
          return 'expired';
        case 4:
          return 'applied';
        case 5:
          return 'failed';
        case 6:
          return 'reverted';
        default:
          return 'unknown';
      }
    }

    return {
      id,
      loading,
      details,
      getStatus
    }
  }
}
</script>
