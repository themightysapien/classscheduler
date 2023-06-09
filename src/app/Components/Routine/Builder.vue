<script setup>
import Routine from './Routine.vue'
import SubjectTimeTable from './SubjectTimeTable.vue'
import { computed, onMounted, ref } from 'vue'
import { useGradeStore } from '@/app/stores/grade'
import store from '@/app/stores'
import { useRoutineStore } from '../../stores/routine'

const gradeStore = useGradeStore(store)

const routineStore = useRoutineStore()

onMounted(() => {
  gradeStore.generateTemplate()
})

const currentView = ref('section')

const setCurrentView = (view) => {
  currentView.value = view
}

const addGrade = (e) => {
  const grade = prompt('Add Grade')
  if (grade) {
    gradeStore.activate(gradeStore.add({ name: grade }).uuid)
  }
  //   console.log(gradeStore.mapped);
}

const autoFillAll = (e) => {
  if (
    confirm(
      'WARNING!! THIS WILL RESET ALL FILLED VALUES ACCROSS ALL GRADES AND SECTIONS. Are you sure you want to proceed?'
    )
  ) {
    if (
      confirm(
        'Did you make sure all your sections are filled with required subject/teacher and have backed up the current settings?'
      )
    ) {
      routineStore.sections.forEach((section, index) => {
        routineStore.shuffle(section.uuid, index)
      })
    }
  }
}

const onPrintClick = (e) => {
  window.print()
}
</script>
<template>
  <div>
    <div class="flex justify-center items-center print:hidden">
      <button
        @click.prevent="setCurrentView('section')"
        title="Add New Period"
        class="ml-auto mt-2 p-2 bg-blue-100 rounded mr-2"
        :class="{ 'view-btn-active': currentView == 'section' }"
      >
        Sections
      </button>
      <button
        @click.prevent="setCurrentView('subject')"
        title="Add New Period"
        class="mt-2 p-2 bg-blue-100 rounded"
        :class="{ 'view-btn-active': currentView == 'subject' }"
      >
        Subjects
      </button>
      <span class="w-[45%] text-right">
        <button @click.prevent="onPrintClick" title="Print" class="mt-2 p-2 bg-blue-100 rounded">
          Print
        </button>
      </span>
    </div>
    <div v-if="currentView == 'section'">
      <ul class="flex items-center border-b border-gray-100 print:hidden">
        <li class="flex" v-for="(grade, gIndex) of gradeStore.items" :key="'grade' + gIndex">
          <a class="relative block p-4" href="" @click.prevent="gradeStore.activate(grade.uuid)">
            <span
              v-if="gradeStore.active == grade.uuid"
              class="absolute inset-x-0 -bottom-px h-px w-full bg-pink-600"
            ></span>
            <div class="flex items-center justify-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4"
                data-darkreader-inline-stroke=""
                style="--darkreader-inline-stroke: currentColor"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>

              <span class="text-sm font-medium text-gray-900">
                {{ grade.name }}
              </span>
            </div>
          </a>
        </li>
        <li class="flex">
          <a class="relative block p-4" href="" @click.prevent="addGrade"> Add New Grade </a>
        </li>
        <li class="flex ml-auto">
          <a
            class="relative block px-4 py-3 bg-red-600 text-white"
            href=""
            @click.prevent="autoFillAll"
          >
            Auto Fill All
          </a>
        </li>
      </ul>
      <Routine :grade="gradeStore.active" />
    </div>
    <div v-else>
      <SubjectTimeTable />
    </div>
  </div>
</template>
