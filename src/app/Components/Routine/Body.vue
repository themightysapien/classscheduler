<template>
    <div class="timetable-body timetable-body-group">
        <div
            v-for="(rowData, index) of value"
            :key="getRowKey(rowData, index) + '_subheader'"
            class="timetable-body-row"
        >
            <div
                class="timetable-row-col table-col-day"

            >
                {{ index + 1 }}
            </div>
            <template
                v-for="(col, colIndex) of columns"
                :key="index + '_' + colIndex + '_colkey'"
            >
                <BodyCell
                    @onDrop="$emit('onDrop', $event)"
                    :rowData="rowData"
                    :column="col"
                    :rowIndex="index"
                    :index="colIndex"
                    :style="{
                        width: columnProp(col, 'width') + 'px',

                    }"
                >
                    <template v-slot:item="slotData">
                        <slot name="item" v-bind="slotData" />
                    </template>
                </BodyCell>
            </template>
        </div>
    </div>
</template>
<script>
import { ObjectUtils } from "@/app/utils";
import BodyCell from "./BodyCell.vue";
export default {
    components: {
        BodyCell,
    },
    emits: ["onDrop"],
    props: {
        columns: { default: () => [] },
        value: { default: () => [] },
        dataKey: { default: null },
    },
    methods: {
        columnProp(col, prop) {
            return ObjectUtils.getVNodeProp(col, prop);
        },
        getRowKey(rowData, index) {
            return this.dataKey
                ? ObjectUtils.resolveFieldData(rowData, this.dataKey)
                : index;
        },
    },
};
</script>
