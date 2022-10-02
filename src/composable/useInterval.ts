import {onBeforeUnmount, ref} from "vue";

export function useInterval() {

    const intervalId = ref<NodeJS.Timer | null>(null);

    const set = (callback: () => void, delay: number) => {
        intervalId.value = setInterval(callback, delay);
        onBeforeUnmount(() => {
            if(intervalId.value) {
                clearInterval(intervalId.value)
            }
        });
    }

    const clear = () => {
        if (intervalId.value) {
            clearInterval(intervalId.value);
            intervalId.value = null;
        }
    }

    return {
        set,
        clear
    }
}
