<template>
    <div class="timetable-row-col table-col-slot" >
        <div
            class="timetable-col-content"
            @drop="onDrop"
            @dragover="onDragOver"
            :data-rowindex="rowIndex"
            :data-index="index"
        >
            <DraggableSubject
                :draggable="!isEmpty"
                class="bg-green-200 draggable-subject"
                :class="[{ 'bg-red-200 bg-empty': isEmpty, 'bg-gray-300 bg-break': isBreak }]"
                :style="getStyle(rowData[index])"
                :draggableData="{
                    rowindex: rowIndex,
                    index,
                    section: sectionId,
                    subject: rowData[index] ? rowData[index]['uuid'] : null,
                }"
            >
                <component
                    :is="column.children.body"
                    :data="rowData"
                    :break="isBreak"
                    :column="column"
                    :index="rowIndex"
                    v-if="column.children && column.children.body"
                />
                <slot
                    v-else
                    name="item"
                    :data="rowData[index]"
                    :break="isBreak"
                    :iundex="index"
                    :rowIndex="rowIndex"
                />
            </DraggableSubject>
        </div>
    </div>
</template>

<script>
import DraggableSubject from "@/app/Components/Routine/DraggableSubject.vue";
import { useRoutineStore } from "@/app/stores/routine";
import { ObjectUtils } from "@/app/utils";
import { useUIStore } from '@/app/stores/ui';
import store from '@/app/stores';
export default {
    setup() {
        const routineStore = useRoutineStore(store);
        const operationStore = useUIStore(store);

        return { routineStore, operationStore };
    },
    emits: ["onDrop"],
    inject: ["sectionId"],
    components: { DraggableSubject },
    props: {
        rowData: { default: () => ({}) },
        column: { default: () => ({}) },
        rowIndex: { default: null },
        index: { default: 0 },
    },
    computed: {
        isEmpty() {
            return !this.rowData || !this.rowData[this.index];
        },
        isBreak() {
            return ObjectUtils.getVNodeProp(this.column, "break") == true;
        },
        // isDragging(){
        //     return this.operationStore.dragging;
        // }
    },
    mounted() {},

    methods: {
        onDragStart(e) {
            // console.log('dragstart');
            e.dataTransfer.dropEffect = "move";
            e.currentTarget.style.border = "2px dashed yellow";
            // e.currentTarget.style.borderColor = 'blue';
            // e.currentTarget.style.borderWidth = '5px';

            e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                    rowindex: this.rowIndex,
                    index: this.index,
                })
            );
        },
        onDragEnd(e) {
            // console.log('dragend');
            e.dataTransfer.clearData();
            e.currentTarget.style.border = "none";
        },
        onDragOver(e) {
            e.preventDefault();
            this.operationStore.toggleDragging(true);
            // console.log('onover');
            e.dataTransfer.dropEffect = "move";
        },
        onDrop(e) {
            e.preventDefault();

            if (this.isBreak) {
                return;
            }
            // console.log('drop');
            let fromData = JSON.parse(e.dataTransfer.getData("text/plain"));
            // console.log(fromData);

            this.$emit("onDrop", {
                fromData,
                toData: {
                    rowindex: Number(e.currentTarget.dataset["rowindex"]),
                    index: Number(e.currentTarget.dataset["index"]),
                },
            });

            // if (fromData['section'] && fromData['subject']) {
            //     // console.log('not here');
            //     this.routineStore.addSubjectToPeriod(
            //         fromData['section'],
            //         fromData['subject'],
            //         Number(e.currentTarget.dataset['rowindex']),
            //         Number(e.currentTarget.dataset['index'])
            //     )
            //     return;
            // }

            // if (Number(fromData['rowindex']) >= 0 && Number(fromData['index']) >= 0 && fromData['section']) {
            //     // console.log('here');
            //     this.routineStore.moveSubjectPeriod(
            //         fromData['section'],
            //         Number(fromData['rowindex']),
            //         Number(fromData['index']),
            //         Number(e.currentTarget.dataset['rowindex']),
            //         Number(e.currentTarget.dataset['index'])
            //     )
            // }
        },
        getStyle(data){
            if(data){
                return {
                    'background-color': data.color ?? 'green'
                }
            }

            return {};
        }
    },
};
</script>

<style>

</style>
