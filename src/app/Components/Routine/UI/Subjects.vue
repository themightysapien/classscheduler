<template>
  <div class="settings-ui-sections" v-if="section">
    <DraggableSubject
      class="p-2 mb-1 hover:opacity-80"
      :style="{ 'background-color': subject.color ?? 'gray' }"
      :class="{ 'bg-red-200': !remainingPeriods[subject.uuid] }"
      v-for="(subject, pIndex) of subjects"
      :draggable="remainingPeriods[subject.uuid] > 0"
      :key="sectionIndex + '_' + pIndex + '_' + subject.uuid"
      :draggableData="{ subject: subject.uuid, section: section.uuid }"
    >
      <SubjectBlock :subject="subject" class="flex ">
        {{ subject.subject }} -
        <span class="font-sm">
          {{ subject.teacher }}
        </span>
        <span class="ml-auto"> Remaining: {{ remainingPeriods[subject.uuid] }} </span>
      </SubjectBlock>
    </DraggableSubject>

    <button
      title="Shuffle Subjects"
      class="mt-2 p-2 block w-full  bg-red-700 font-bold hover:bg-red-400 rounded"
      @click.prevent="shuffle"
    >
      Auto Fill
    </button>
  </div>
</template>
<script lang="ts">
import { useRoutineStore } from '@/app/stores/routine'
import DraggableSubject from '@/app/Components/Routine/DraggableSubject.vue'
import { defineComponent, PropType, computed } from 'vue'
import SubjectBlock from '@/app/Components/Routine/UI/SubjectBlock.vue'
import store from '@/app/stores'

export default defineComponent({
  setup(props) {
    const routineStore = useRoutineStore(store)

    return {
      routineStore,
      subjects: computed(() => routineStore.sectionSubjects(props.section.uuid)),
      remainingPeriods: computed(() => routineStore.remainingPeriods(props.section.uuid))
    }
  },
  components: { DraggableSubject, SubjectBlock },
  props: {
    section: { required: true, type: Object /* as PropType<Section> */ },
    sectionIndex: { default: 0 }
  },
  mounted() {
    // console.log(this.section.subjects);
    // console.log(this.routineStore);
  },
  methods: {
    shuffle() {
      if (
        confirm('Are you sure you want to auto fill ? This will reset all current filled slots.')
      ) {
        this.routineStore.shuffle(this.section.uuid, this.sectionIndex)
      }
    }
  }
})
</script>
