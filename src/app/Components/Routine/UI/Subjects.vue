<template>
    <div class="settings-ui-sections" v-if="section">
        <DraggableSubject
            class="p-2  mb-1"
            :style="{ 'background-color': subject.color ?? 'gray' }"
            :class="{ 'bg-red-200': !remainingPeriods[subject.uuid] }"
            v-for="(subject, pIndex) of subjects"
            :draggable="remainingPeriods[subject.uuid] > 0"
            :key="sectionIndex + '_' + pIndex + '_' + subject.uuid"
            :draggableData="{ subject: subject.uuid, section: section.uuid }"
        >
            <SubjectBlock :subject="subject" class="flex">
                {{ subject.subject }} -
                <span class="font-sm">
                    {{ subject.teacher }}
                </span>
                <span class="ml-auto">
                    Remaining: {{ remainingPeriods[subject.uuid] }}
                </span>
            </SubjectBlock>
        </DraggableSubject>

        <button title="Add New Subject" class="mt-2 px-2 bg-blue-300 rounded">
            Shuffle
        </button>
    </div>
</template>
<script lang="ts">
import { useRoutineStore } from "@/app/stores/routine";
import DraggableSubject from "@/app/Components/Routine/DraggableSubject.vue";
import { defineComponent, PropType, computed } from "vue";
import SubjectBlock from "@/app/Components/Routine/UI/SubjectBlock.vue";
import store from '@/app/stores';

export default defineComponent({
    setup(props) {
        const routineStore = useRoutineStore(store);

        return {
            routineStore,
            subjects: computed(() =>
                routineStore.sectionSubjects(props.section.uuid)
            ),
            remainingPeriods: computed(() =>
                routineStore.remainingPeriods(props.section.uuid)
            ),
        };
    },
    components: { DraggableSubject, SubjectBlock },
    props: {
        section: { required: true, type: Object /* as PropType<Section> */ },
        sectionIndex: { default: 0 },
    },
    mounted() {
        // console.log(this.section.subjects);
        // console.log(this.routineStore);
    },
    methods: {},
});
</script>
