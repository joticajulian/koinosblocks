<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>Proposal details</va-card-title>
      <va-card-content v-if="details">
        <DescriptionRow
          description="Vote start height"
          :data="details.vote_start_height ?? '0'"
        />
        <DescriptionRow
          description="Vote end height"
          :data="voteHeightEnd(details.vote_start_height ?? 0)"
        />
        <DescriptionRow
          description="Vote threshold"
          :data="details.vote_threshold ?? '0'"
        />
        <DescriptionRow
          description="Vote tally"
          :data="votesTallyText(details.vote_tally, details.status)"
        />
        <DescriptionRow
          description="Shall authorize"
          :data="details.shall_authorize ?? 'false'"
        />
        <DescriptionRow
          description="Updates governance"
          :data="details.updates_governance ?? 'false'"
        />
        <DescriptionRow
          description="Status"
          :data="details.status ?? 'pending'"
        />
        <DescriptionRow
          description="Operation merkle root"
          :data="details.operation_merkle_root"
        />
        <DescriptionRow description="Fee" :data="details.fee" />
        <RawData v-if="details" :data="details" />
      </va-card-content>
    </va-card>
  </va-inner-loading>
  <ProposalOperationsTable
    v-if="details"
    :operations="details.operations"
    :loading="loading"
  />
</template>

<script lang="ts">
import { computed, ref } from 'vue';
import { useClient } from '../composable/useClient';
import * as koinosPbToProto from '@roamin/koinos-pb-to-proto';
import * as protobuf from 'protobufjs';
import { Root } from 'protobufjs';
import { utils } from 'koilib';
import base64url from 'base64url';
import RawData from './common/RawData.vue';
import DescriptionRow from './common/DescriptionRow.vue';
import ProposalOperationsTable from './proposal/ProposalOperationsTable.vue';
import { useNameService } from '../composable/useNameService';
import headBlock from './block/HeadBlock.vue';

export default {
  name: 'SingleProposal',
  computed: {
    headBlock() {
      return headBlock;
    },
  },
  components: { ProposalOperationsTable, DescriptionRow, RawData },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props: any) {
    const proposalId = ref(props.id);
    const loading = ref(true);
    const root = ref<Root | null>(null);
    const details = ref<any | null>(null);
    const headBlock = ref<number | null>(null);

    const { client } = useClient();
    const { getSystemContractAddress } = useNameService();

    const getGovernanceProto = async (governance: string) => {
      try {
        const { meta } = await client.contractMetaStore.getContractMeta(
          governance,
        );
        const abi = JSON.parse(meta.abi);
        return koinosPbToProto.convert(abi.types);
      } catch (e) {
        console.error(e);
      }
    };

    const parseProtos = (protos: any[]) => {
      const root = new protobuf.Root();
      for (const proto of protos) {
        try {
          protobuf.parse(proto.definition, root, { keepCase: true });
        } catch (e) {
          continue;
        }
      }
      return root;
    };

    const getProposal = async (address: string) => {
      const argumentType = root.value!.lookup(
        'koinos.contracts.governance.get_proposal_by_id_arguments',
      );
      const returnType = root.value!.lookup(
        'koinos.contracts.governance.get_proposal_by_id_result',
      );

      const message = argumentType!.create({
        proposal_id: utils.toUint8Array(props.id.slice(2)),
      });
      const args = base64url.encode(
        Buffer.from(argumentType!.encode(message!).finish()),
      );

      const { result } = await client.chain.readContract(
        address,
        0xc66013ad,
        args,
      );
      const buf = base64url.toBuffer(result);
      // eslint-disable-next-line no-unsafe-optional-chaining
      const { value } = returnType?.decode(buf).toJSON();
      details.value = value;
    };

    const load = async () => {
      loading.value = true;
      const governanceContractAddress = await getSystemContractAddress(
        'governance',
      );
      const protos = await getGovernanceProto(governanceContractAddress);
      root.value = parseProtos(protos!);
      await getProposal(governanceContractAddress);
      const { head_topology } = await client.chain.getHeadInfo();
      headBlock.value = Number(head_topology.height);
      loading.value = false;
    };

    const votesPassed = computed(() => {
      return headBlock.value - Number(details?.value?.vote_start_height);
    });

    const votesPercentage = computed(() => {
      return (
        (Number(details?.value?.vote_tally) / Number(votesPassed.value)) *
        100
      ).toFixed(0);
    });

    const votesTallyText = (tally: string, status?: string) => {
      if (!status || status === 'pending') return '0';
      return `${tally} out of ${votesPassed.value} (${votesPercentage.value}%)`;
    };

    load().catch(console.error);

    return {
      proposalId,
      loading,
      details,
      headBlock,
      voteHeightEnd: (height: string | number) => Number(height) + 201600 * 2, // two weeks voting period with 3 second block target
      votesPassed,
      votesPercentage,
      votesTallyText,
    };
  },
};
</script>
