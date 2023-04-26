<script lang="ts" setup>
import { useRoutineStore } from "@/app/stores/routine";
import { computed, defineComponent, ref, reactive } from "vue";

import { useSubjectStore } from "@/app/stores/subject";
import { ObjectUtils } from "@/app/utils";
import { PERIOD_HEIGHT, PERIOD_WIDTH, useGradeStore } from "@/app/stores/grade";
import { invertColor } from "@/app/utils/helpers";
import store from '@/app/stores';

const props = withDefaults(
    defineProps<{
        subject?: string;
        offset?: number;
        offsetY?: number;
        width?: number;
        zoom?: number;
        start: number;
    }>(),
    {
        subject: "",
        offset: 40,
        offsetY: PERIOD_HEIGHT,
        width: PERIOD_WIDTH,
        zoom: 1,
        start: 0,
    }
);

const routineStore = useRoutineStore(store);
const gradeStore = useGradeStore(store);
const subjectStore = useSubjectStore(store);

const subjects = computed(() => subjectStore.items);
const subjectsMapped = computed(() => subjectStore.mapped);
const sectionMapped = computed(() => routineStore.mappedSections);
const gradesMapped = computed(() => gradeStore.mapped);

const subjectSchedules = computed(() =>
    props.subject ? routineStore.sectionSubjectSchedules[props.subject] : null
);

const currentSubject = computed(() => subjectsMapped.value[props.subject]);
const fontColor = computed(() => invertColor(currentSubject.value.color, true))

const colWdith = (period: any) => {
    const seconds = period.secondsGroup[1] - period.secondsGroup[0];

    const width = (seconds / PERIOD_WIDTH) * 2;
    return props.zoom > 0 ? width * props.zoom : width;
};

const colHeight = computed(() => {
    return PERIOD_HEIGHT;
});

const left = (index: number, period: any) => {
    const seconds = period.secondsGroup[0] - props.start;
    // console.log(period, props.start);
    let width = (seconds / PERIOD_WIDTH) * 2;
    width = props.zoom > 0 ? width * props.zoom : width;
    return props.offset + width;
};
const top = (rowindex: number) => {
    // console.log(rowindex);
    return props.offsetY + rowindex * PERIOD_HEIGHT;
};

const sortPeriods = (periods: any[]) => {
    return periods
        .filter((item) => {
            // console.log(item.secondsGroup, props.start);
            return item.secondsGroup[0] >= props.start;
        })
        .sort((a: any, b: any) => {
            const valA = a["secondsGroup"][0];
            const valB = b["secondsGroup"][0];
            return valA - valB;
        });
};
</script>

<template>
    <div class="subject-scheduler" v-if="subject">
        <template
            v-for="(subjectSchedule, $sIndex) of subjectSchedules"
            :key="$sIndex"
        >
            <div
                class="subect-scheduler-col absolute"
                v-for="(period, p) of sortPeriods(subjectSchedule.dayPeriods)"
                :key="'period_' + p"
                :style="{
                    'background-color': currentSubject.color,
                    top: top($sIndex) + 'px',
                    left: left(p, period) + 'px',
                    width: colWdith(period) + 'px',
                    height: colHeight + 'px'
                }"
            >
                <div class="scheduler-col-content">
                    <div class="scheduler-subject">
                        <span
                            class="block font-bold"
                            :style="{
                                color: fontColor
                            }"
                        >
                            {{
                                `${gradesMapped[period.grade]["name"]} (${
                                    sectionMapped[period.section]["name"]
                                })`
                            }}
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
