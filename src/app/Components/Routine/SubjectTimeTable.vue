<script lang="ts" setup>
import { useRoutineStore } from "@/app/stores/routine";
import { computed, defineComponent, ref, reactive } from "vue";
import { useSubjectStore } from "@/app/stores/subject";
import { ObjectUtils } from "@/app/utils";
import { useGradeStore } from "@/app/stores/grade";

const routineStore = useRoutineStore();
const gradeStore = useGradeStore();
const subjectStore = useSubjectStore();

const subjects = computed(() => subjectStore.items);
const subjectsMapped = computed(() => subjectStore.mapped);
const sectionMapped = computed(() => routineStore.mappedSections);
const gradesMapped = computed(() => gradeStore.mapped);
const activeSubject = computed(() => subjectStore.active);

const subjectSchedules = computed(
    () => routineStore.sectionSubjectSchedules[activeSubject.value]
);

const onSubjectChangeHandler = ($event: any) => {
    if ($event.target.value) {
        subjectStore.activate($event.target.value);
    }
};

const sortPeriods = (periods: any[]) => {
    return periods.sort((a: any, b: any) => {
        const valA = a['secondsGroup'][0];
        const valB = b['secondsGroup'][0];
        return valA - valB;
    });
};
</script>

<template>
    <div class="bg-white p-3 mt-3">
        <div class="print:hidden">
            <select
                class="select-xs"
                @change="onSubjectChangeHandler"
                :value="activeSubject"
            >
                <option value="">Select Subject</option>
                <option
                    v-for="(subject, sIndex) of subjects"
                    :key="'available_' + sIndex"
                    :value="subject.uuid"
                >
                    {{ `${subject.subject}-${subject.teacher}` }}
                </option>
            </select>
        </div>
            <h3 class="printable__only" v-if="activeSubject">Subject: {{ subjectsMapped[activeSubject]['subject'] }}  Teacher: {{ subjectsMapped[activeSubject]['teacher'] }}</h3>
        <div class="mt-2 timetable" v-if="activeSubject">
            <div class="table subject-timetable">
                <div
                    class="timetable-body timetable-body-group table-row-group"
                >
                    <div
                        v-for="(subjectSchedule, $sIndex) of subjectSchedules"
                        :key="$sIndex"
                        class="timetable-body-row table-row"
                    >
                        <div class="timetable-row-col table-col-day table-cell p-2">
                            Day {{ $sIndex + 1 }}
                        </div>
                        <div
                            class="timetable-row-col table-cell p-2"
                            v-for="(period, p) of sortPeriods(subjectSchedule.dayPeriods)"
                            :key="'period_' + p"
                        >
                            <div class="p-1" data-rowindex="6" data-index="0">
                                <div class="">
                                    <span
                                        class="block bg-green-200 font-bold text-lg"
                                    >
                                        {{
                                            `${
                                                period.start_hour
                                            }:${ObjectUtils.n(
                                                period.start_minute
                                            )} to ${
                                                period.end_hour
                                            }:${ObjectUtils.n(
                                                period.end_minute
                                            )}`
                                        }}
                                    </span>
                                    <span
                                        class="block bg-red-200 font-bold text-xl"
                                    >
                                        {{
                                            `${
                                                gradesMapped[period.grade][
                                                    "name"
                                                ]
                                            } (${
                                                sectionMapped[period.section][
                                                    "name"
                                                ]
                                            })`
                                        }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
