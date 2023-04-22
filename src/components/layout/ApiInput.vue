<template>
    <va-select
            v-model="url"
            :options="availableApiUrls"
            allow-create="unique"
            label="API node address"
            searchPlaceholderText="Search or enter new API url"
            @select="updateClientApi(url)"
            @create-new="addNewNodeUrl"/>
    <va-button
            size="medium"
            @click="updateClientApi(url)">Set
    </va-button>
</template>

<script>
import {ref, watch} from 'vue';
import {useClient} from "../../composable/useClient";
import {useNotification} from "../../composable/useNotification";
import * as isUrl from 'is-url';

export default {
    name: 'ApiInput',
    setup() {
        const {updateApiAddress} = useClient();
        const {showSuccess, showError} = useNotification();

        const url = ref(localStorage.getItem('api') || 'https://api.koinosblocks.com');
        const rawOptions = localStorage.getItem('availableApiUrls');
        const availableApiUrls = ref(rawOptions ? JSON.parse(rawOptions) : ["https://api.koinosblocks.com", "https://api.koinos.io", "https://harbinger-api.koinos.io"])

        const updateClientApi = () => {
            const currentApi = localStorage.getItem('api');
            if (currentApi !== url.value) {
                localStorage.setItem('api', url.value);
                updateApiAddress(url.value)
                showSuccess('API node updated');
            }
        }

        const addNewNodeUrl = (url) => {
            if (!isUrl(url)) {
                showError('Invalid URL');
                return;
            }
            availableApiUrls.value.push(url);
            localStorage.setItem('availableApiUrls', JSON.stringify(availableApiUrls.value));
        }

        watch(url, updateClientApi);

        return {
            url,
            availableApiUrls,
            updateClientApi,
            addNewNodeUrl
        }
    }
};
</script>

<style scoped>
button {
    margin-left: 5px;
}
</style>
