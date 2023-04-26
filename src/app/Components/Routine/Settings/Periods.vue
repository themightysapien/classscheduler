<template>
    <div class="settings-sections" v-if="section">
        <table style="width: 100%">
            <tr>
                <th style="width: 30%">Start</th>
                <th style="width: 30%">End</th>
                <th>Break</th>
                <th>Action</th>
            </tr>
            <tr
                v-for="(period, pIndex) of section['periods']"
                :key="sectionIndex + '_' + pIndex"
            >
                <td class="flex items-center">
                    <input
                        type="number"
                        class="input-xs w-[40px]"
                        v-model="period['start_hour']"
                        min="0"
                        max="23"
                    />
                    <span>:</span>
                    <input
                        type="number"
                        class="input-xs w-[40px]"
                        v-model="period['start_minute']"
                        min="0"
                        max="59"
                    />
                </td>
                <td>
                    <div class="flex justify-end">
                        <input
                            type="number"
                            class="input-xs w-[40px]"
                            v-model="period['end_hour']"
                            min="0"
                            max="23"
                        />
                        <span>:</span>
                        <input
                            type="number"
                            class="input-xs w-[40px]"
                            v-model="period['end_minute']"
                            min="0"
                            max="59"
                        />
                    </div>
                </td>
                <td class="text-center">
                    <input
                        type="checkbox"
                        name="break"
                        v-model="period['break']"
                    />
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
import store from '@/app/stores';

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
