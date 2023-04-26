import { useGradeStore } from "@/app/stores/grade";
import { useRoutineStore } from "@/app/stores/routine";
import { timeToSeconds } from "@/app/utils/helpers";
import { ref, reactive, computed } from "vue";
import { useSubjectStore } from '../stores/subject';
import { ObjectUtils } from '@/app/utils';

export default function usePeriodValidator(data: PeriodValidationData) {
    const state = reactive({
        message: "",
    });

    // console.log(data);
    const gradeStore = useGradeStore();
    const subjectStore = useSubjectStore();
    const routineStore = useRoutineStore();

    // console.log(routineStore.sectionSubjectSchedules);

    // const section = computed(() => routineStore.mappedSections[data.sectionId]);

    const subjectsMapped = computed(() => subjectStore.mapped);
    const gradesMapped = computed(() => gradeStore.mapped);
    const sectionsMapped = computed(() => routineStore.mappedSections);

    const section = sectionsMapped.value[data.sectionId];

    const subjectSchedules = computed(
        () => routineStore.sectionSubjectSchedules[data.subjectId]
    );

    // console.log(subjectSchedules.value);

    const isValid = () => {
        if (alreadyHasPeriodOnSameSection()) {
            return false;
        }

        if (alreadyHasPeriodOnSameTime()) {
            return false;
        }

        return true;
    };

    function alreadyHasPeriodOnSameTime(): boolean {
        if(!subjectSchedules.value || !subjectSchedules.value[data.rowindex]){
            return false;
        }
        const period = section.periods[data.index];
        const [start, end] = [
            timeToSeconds(period.start_hour, period.start_minute),
            timeToSeconds(period.end_hour, period.end_minute),
        ];

        // console.log(start, end);

        const targetDaySchedules =
            subjectSchedules.value[data.rowindex].dayPeriods;

            let found = false;
        targetDaySchedules.some((item) => {
            // console.log(start, end, item.secondsGroup);
            if(
              (start == item.secondsGroup[0] && end == item.secondsGroup[1]) ||
                (start >= item.secondsGroup[0] && start < item.secondsGroup[1]) ||
                (end > item.secondsGroup[0] && end <= item.secondsGroup[1])
                ){

                    state.message = `Period already taken (${item.start_hour + ':' + ObjectUtils.n(item.start_minute)} - ${item.end_hour + ':' + ObjectUtils.n(item.end_minute)}) on ${gradesMapped.value[item.grade]['name']} - ${sectionsMapped.value[item.section]['name']}`;
                    found = true;
                    return true;
                }
        });

        return found;
    }

    function alreadyHasPeriodOnSameSection(): boolean {
        if(!subjectSchedules.value || !subjectSchedules.value[data.rowindex]){
            return false;
        }
        const targetDaySchedules =
            subjectSchedules.value[data.rowindex].dayPeriods;
        // console.log(targetSchedule);
        const sameSectionPeriod = targetDaySchedules.find(
            (item) => item.section == data.sectionId
        );
        // console.log(sameSectionPeriod?.index, data.fromData);
        if (sameSectionPeriod) {
            if (
                typeof data.fromData.index !== "undefined" &&
                data.fromData.index == sameSectionPeriod.index &&
                typeof data.fromData.rowindex !== 'undefined' &&
                data.fromData.rowindex == data.rowindex
            ) {
                return false;
            }

            state.message = "Already have period for this day on this section.";

            return true;
        }
        return false;
    }

    return {
        isValid,
        lastMessage: () => {
            return state.message;
        },
    };
}

export interface PeriodValidationData {
    gradeId: string;
    sectionId: string;
    subjectId: string;
    rowindex: number;
    index: number;
    fromData: {
        index?: number;
        rowindex?: number;
    };
}
