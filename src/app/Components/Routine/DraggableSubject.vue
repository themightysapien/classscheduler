<template>
    <div
        :draggable="draggable"
        class="draggable_item"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
    >
        <slot></slot>
    </div>
</template>
<script>
import { useUIStore } from "@/app/stores/ui";
import store from '@/app/stores';

export default {
    setup() {
        const operationStore = useUIStore(store);

        return { operationStore };
    },
    props: {
        draggable: { default: true },
        draggableData: { default: () => ({}) },
        rowIndex: { default: 0 },
        index: { default: 0 },
    },
    methods: {
        onDragStart(e) {
            e.dataTransfer.dropEffect = "move";
            e.currentTarget.style.border = "2px dashed yellow";
            // e.currentTarget.style.borderColor = 'blue';
            // e.currentTarget.style.borderWidth = '5px';

            // console.log(JSON.stringify({
            //     rowindex: this.rowIndex,
            //     index: this.index
            // }));
            // console.log(this.draggableData);
            this.operationStore.dragStarted(this.draggableData);

            e.dataTransfer.setData(
                "text/plain",
                JSON.stringify(this.draggableData)
            );
            // e.dataTransfer.setData('text/plain', JSON.stringify({
            //     rowindex: this.rowIndex,
            //     index: this.index
            // }));
        },
        onDragEnd(e) {
            this.operationStore.dropped();
            // console.log('dragend');
            e.dataTransfer.clearData();
            e.currentTarget.style.border = "none";
        },
    },
};
</script>
<style>
div[draggable="true"] {
    cursor: move;
}
</style>
