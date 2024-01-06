<template>
  <div class="settings-sections" v-if="section">
    <h3 class="text-xl font-bold">Periods Table</h3>
    <table class="w-full">
      <tr>
        <th class="font-bold" >#</th>
        <th class="font-bold" align="left">Start</th>
        <th class="font-bold" align="left">End</th>
        <th align="left">Break</th>
        <th align="left">Action</th>
      </tr>
      <tr
        v-for="(period, pIndex) of section['periods']"
        :key="sectionIndex + '_' + pIndex"
      >
        <td class="font-bold" ><span>Period</span> {{ pIndex + 1 }}</td>
        <td class="">
          <input
            type="number"
            class="input-xs w-[60px]"
            v-model="period['start_hour']"
            min="00"
            max="23"
          />
          <span class="mx-2">:</span>
          <input
            type="number"
            class="input-xs w-[60px]"
            v-model="period['start_minute']"
            min="00"
            max="59"
          />
        </td>
        <td>
          <div class="">
            <input
              type="number"
              class="input-xs w-[60px]"
              v-model="period['end_hour']"
              min="0"
              max="23"
            />
            <span class="mx-2">:</span>
            <input
              type="number"
              class="input-xs w-[60px]"
              v-model="period['end_minute']"
              min="0"
              max="59"
            />
          </div>
        </td>
        <td class="">
          <input type="checkbox" name="break" v-model="period['break']" />
        </td>
        <td>
          <!-- <a
                        href="#"
                        class="w-7 h-7 inline-flex justify-center items-center bg-blue-300 text-white bold rounded-full"
                        title="Add New Period"
                        @click.prevent="
                            routineStore.addPeriod(section.uuid, {
                                ...(period as any),
                            })
                        "
                        >+</a
                    > -->
          <a
            href="#"
            title="Remove Period"
            class="ml-2 w-7 h-7 inline-flex justify-center items-center bg-red-300 text-white bold rounded-full"
            @click.prevent="onRemoveHandler(section.uuid, pIndex)"
            >-</a
          >
        </td>
      </tr>
    </table>
    <button
      @click.prevent="addSectionPeriod($event, section?.uuid)"
      title="Add New Period"
      class="mt-2 px-2 bg-blue-300 rounded"
    >
      Add Period
    </button>
  </div>
</template>
<script lang="ts">
import { useRoutineStore } from "@/app/stores/routine";
import { defineComponent, PropType, computed } from "vue";
// import { Section } from "@/app/stores/routine";
import store from "@/app/stores";

export default defineComponent({
  setup() {
    const routineStore = useRoutineStore(store);

    return { routineStore };
  },
  props: {
    section: { required: true, type: Object /* as PropType<Section> */ },
    sectionIndex: { default: 0 },
  },
  mounted() {
    // console.log(this.routineStore);
  },
  methods: {
    onRemoveHandler(sectionId: string, index: number) {
      if (confirm("Are you sure?")) {
        this.routineStore.removePeriod(sectionId, index);
      }
    },
    addSectionPeriod(e: any, sectionId: string) {
      // const name = prompt('From : To');
      // if (name) {
      // }
      this.routineStore.addPeriod(sectionId, {
        start_hour: 8,
        start_minute: 0,
        end_hour: 9,
        end_minute: 0,
        break: false,
      });
    },
  },
});
</script>
