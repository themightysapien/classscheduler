<template>
    <div class="timetable-header-group">
        <div
            class="timetable-col timetable-col-header table-col-slot table-col-day"

        >
            Day
        </div>
        <template
            v-for="(col, i) of columns"
            :key="columnProp(col, 'columnKey') || columnProp(col, 'field') || i"
        >
            <div
                class="timetable-col timetable-col-header table-col-slot"
                :style="{
                    width: columnProp(col, 'width') + 'px',

                }"
                :title="columnProp(col, 'header')"
            >
                <span>
                    {{ columnProp(col, "header") }}
                </span>
            </div>
        </template>
    </div>
</template>
<script>
import { ObjectUtils } from "@/app/utils";
export default {
    props: {
        columns: { default: () => [] },
    },
    methods: {
        columnProp(col, prop) {
            return ObjectUtils.getVNodeProp(col, prop);
        },
    },
};
</script>
