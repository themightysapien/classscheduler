<template>
  <div
    class="relative z-10"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
    v-if="visible"
  >
    <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
        <div
          class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6 xl:w-6/12 xl:max-w-6/12"
        >
          <div>
            <h3
              class="text-xl font-semibold leading-6 text-gray-900 mb-4 flex"
              id="modal-title"
            >
              <span class="font-bold"> Settings </span>
              <span class="text-blue-600 font-bold ml-auto">{{ grade?.name }} </span>
                <span class="ml-2">::</span>
              <span class="ml-2"> Section {{ section.name }} </span>
            </h3>
            <Subjects :section="section" :sectionIndex="sectionIndex" />
            <hr class="my-4" />
            <Periods class="mt-4" :section="section" :sectionIndex="sectionIndex" />
          </div>
          <div class="mt-5 sm:mt-6 flex justify-end">
            <button
              @click.prevent="$emit('update:visible', false)"
              type="button"
              class="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, computed } from "vue";
import Subjects from "./Subjects.vue";
import Periods from "./Periods.vue";
import { useGradeStore } from "../../../stores/grade";
defineEmits(["update:visible"]);

const props = defineProps({
  visible: { default: false },
  sectionIndex: { default: 0 },
  section: { default: null },
});

const gradeStore = useGradeStore();

onMounted(() => {
  console.log(props.section);
});

const grade = computed(() => {
  if (!props.section) {
    return null;
  }

  return gradeStore.mapped[props.section["grade"]];
});
</script>
