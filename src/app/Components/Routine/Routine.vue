<script setup>
import TimeTable from './TimeTable.vue'
import SubjectSchedules from './SubjectSchedules.vue'
import Settings from './Settings/Index.vue'
import SubjectBlock from './UI/SubjectBlock.vue'
import RemoveOnDropBox from './UI/RemoveOnDropBox.vue'
import Column from './Column.vue'
import { ObjectUtils } from '@/app/utils'
import { useRoutineStore } from '@/app/stores/routine'
import { useGradeStore, PERIOD_WIDTH, PERIOD_HEIGHT } from '@/app/stores/grade'
import { computed } from 'vue'
import usePeriodValidator from '@/app/hooks/usePeriodValidator'
import { timeToSeconds } from '@/app/utils/helpers'
import { useSubjectStore } from '@/app/stores/subject'
import { useUIStore } from '@/app/stores/ui'
import store from '@/app/stores'

const props = defineProps({
  grade: { default: '' }
})
const routineStore = useRoutineStore(store)
const gradeStore = useGradeStore(store)
const subjectStore = useSubjectStore(store)
const operationStore = useUIStore(store)

const classPeriods = computed(() => routineStore.classPeriods)

const isDragging = computed(() => operationStore.dragging)

// console.log(subjectStore.items[0]);
const draggingSubjectId = computed(() => {
  // return subjectStore.items[0].uuid;
  return isDragging.value ? operationStore.dragData['subject'] : null
})

const isDraggingInSection = (sectionId) => {
  return (
    isDragging.value && operationStore.dragData && operationStore.dragData['section'] == sectionId
  )
}

// const columns = computed(() => {

// })
// const activeGrade = computed(() => gradeStore.active);

const header = (period) => {
  return `${period.start_hour}:${ObjectUtils.n(period.start_minute)} - ${
    period.end_hour
  }:${ObjectUtils.n(period.end_minute)}`
}

const width = (period, zoom) => {
  const seconds =
    timeToSeconds(period.end_hour, period.end_minute) -
    timeToSeconds(period.start_hour, period.start_minute)

  const width = (seconds / PERIOD_WIDTH) * 2
  return zoom > 0 ? width * zoom : width
}
const height = (zoom) => {
  return zoom > 0 ? PERIOD_HEIGHT * zoom : PERIOD_HEIGHT
}

const borderSeconds = (period) => {
  return timeToSeconds(period.start_hour, period.start_minute)
}

const addSectionHandler = (e) => {
  const section = prompt('New Section', 'A')
  if (!section) {
    return
  }
  routineStore.addSection({
    grade: gradeStore.active,
    name: section,
    periods: [],
    subjects: [],
    schedules: {}
  })
}

const onDropHandler = (section, $event) => {
  const fromData = $event.fromData
  const toData = $event.toData
  // console.log(fromData);

  if (!fromData.section || fromData.section != section.uuid) {
    return
  }

  const peridoValidator = usePeriodValidator({
    gradeId: gradeStore.active,
    sectionId: section.uuid,
    subjectId: fromData.subject,
    rowindex: toData.rowindex,
    index: toData.index,
    fromData
  })

  if (!peridoValidator.isValid()) {
    alert(peridoValidator.lastMessage())
    return
  }

  // console.log(fromData, toData);

  /* if dropped from outside */
  if (fromData['section'] && fromData['subject'] && typeof fromData['index'] === 'undefined') {
    // console.log('not here');
    routineStore.addSubjectToPeriod(
      fromData['section'],
      fromData['subject'],
      toData['rowindex'],
      toData['index']
    )
    return
  }

  /* if dropped from inside */
  if (Number(fromData['rowindex']) >= 0 && Number(fromData['index']) >= 0) {
    // console.log('here');
    routineStore.moveSubjectPeriod(
      section.uuid,
      fromData['rowindex'],
      fromData['index'],
      toData['rowindex'],
      toData['index']
    )
  }
}

const onSectionNameClick = (sectionId) => {
  const name = prompt('Rename Section')
  if (name) {
    routineStore.renameSection(sectionId, name)
  }
}

const onSectionRemoveClick = (sectionId) => {
  if (confirm('Are you sure you want to remove this section?')) {
    routineStore.removeSection(sectionId)
  }
}
</script>
<template>
  <div>
    <template v-for="(section, sIndex) of gradeStore.currentSections" :key="section.uuid">
      <div class="grid grid-cols-4 gap-6 mt-3 print:grid-cols-1">
        <div class="col-span-3">
          <div class="flex flex-wrap items-center justify-center">
            <span class="text-xl text-900 font-bold my-2"
              >Section
              <a href="#" title="Rename Section" @click.prevent="onSectionNameClick(section.uuid)">{{
                section.name
              }}</a></span
            >
            <a
              href="#"
              title="Remove Section"
              @click.prevent="onSectionRemoveClick(section.uuid)"
              class="ml-3 text-red-400 font-bold"
              >Delete</a
            >
          </div>
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div class="text-gray-900 dark:text-gray-100 relative timetable-wrapper">
              <TimeTable
                @onDrop="(e) => onDropHandler(section, e)"
                :value="classPeriods(section.uuid)"
                :section="section"
              >
                <!-- <template #header>
                                                        <div class="flex flex-wrap align-items-center justify-center gap-2">
                                                            <span class="text-xl text-900 font-bold">{{ section.name }}</span>

                                                        </div>
                                                    </template> -->
                <template #item="slotProps">
                  <SubjectBlock v-if="slotProps.data" :subject="slotProps.data" />

                  <span v-else>{{ slotProps.break ? 'BREAK' : 'Empty' }}</span>
                </template>
                <template #footer>
                  <RemoveOnDropBox v-if="isDraggingInSection(section.uuid)" />
                </template>
                <template #afterbody>
                  <SubjectSchedules
                    v-if="isDraggingInSection(section.uuid)"
                    :subject="draggingSubjectId"
                    :start="borderSeconds(section.periods[0])"
                  />
                </template>
                <Column
                  v-for="(col, i) of section.periods"
                  :key="'col_' + i"
                  field="code"
                  :width="width(col, section.zoom)"
                  :header="header(col)"
                  :break="col.break"
                ></Column>
              </TimeTable>
            </div>
          </div>
        </div>
        <div>
          <div
            class="print:hidden bg-white pt-4 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg settings"
          >
            <!-- <h3 class="text-xl text-900 font-bold">Settings</h3> -->
            <Settings :section="section" :index="sIndex" />
          </div>
        </div>
      </div>
    </template>
    <button
      class="print:hidden mt-3 p-3 bg-blue-300 text-gray-800 font-bold"
      @click.prevent="addSectionHandler"
    >
      Add New Section
    </button>
  </div>
</template>
