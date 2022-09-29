<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>Proposal details</va-card-title>
      <va-card-content v-if="details">
        <DescriptionRow description="Vote start height" :data="details.vote_start_height ?? '0'"/>
        <DescriptionRow description="Vote threshold" :data="details.vote_threshold ?? '0'"/>
        <DescriptionRow description="Vote tally" :data="details.vote_tally ?? '0'"/>
        <DescriptionRow description="Shall authorize" :data="details.shall_authorize ?? 'false'"/>
        <DescriptionRow description="Updates governance" :data="details.updates_governance ?? 'false'"/>
        <DescriptionRow description="Status" :data="details.status ?? 'pending'"/>
        <DescriptionRow description="Operation merkle root" :data="details.operation_merkle_root"/>
        <DescriptionRow description="Fee" :data="details.fee"/>
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
import {Message, Root} from "protobufjs";
import {utils} from "koilib";
import base64url from "base64url";
import RawData from "./common/RawData.vue";
import DescriptionRow from "./common/DescriptionRow.vue";
import ProposalOperationsTable from "./proposal/ProposalOperationsTable.vue";

export default {
  name: 'SingleProposal',
  components: {ProposalOperationsTable, DescriptionRow, RawData, SingleBlock},
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
      return root;
    }

    const getProposal = async () => {
      const argumentType = root.value!.lookup('koinos.contracts.governance.get_proposal_by_id_arguments')
      const returnType = root.value!.lookup('koinos.contracts.governance.get_proposal_by_id_result')

      const message = argumentType!.create({proposal_id: utils.toUint8Array(props.id.slice(2))})
      const args = base64url.encode(Buffer.from(argumentType!.encode(message!).finish()))

      const {result} = await client.chain.readContract('1NsnpSsXJDgPTFgFXRiP8F3Acg9gj6VjUi', 0xc66013ad, args);
      const buf = base64url.toBuffer(result);
      const {value} = returnType?.decode(buf).toJSON();
      details.value = value;
    }

    const load = async () => {
      loading.value = true;
      const protos = await getGovernanceProto();
      root.value = parseProtos(protos!);
      await getProposal();
      loading.value = false;
    }

    load().then(() => {
      console.log('done');
    }).catch((e) => {
      console.log(e);
    });

    return {
      id,
      loading,
      details,
      toProposalId: (root: string) => `0x${utils.toHexString(utils.decodeBase64(root))}`
    }
  }
}
</script>
