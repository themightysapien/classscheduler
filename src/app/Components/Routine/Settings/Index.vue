<script setup lang="ts">
import Subjects from './Subjects.vue';
import Periods from './Periods.vue';
import Modal from './Modal.vue';
import SubjectsUI from '@/app/Components/Routine/UI/Subjects.vue';
import { ref, defineProps } from 'vue';
import useTabs from '@/app/hooks/useTabs';


const props = defineProps({
    section: { default: null },
    sectionIndex: { default: 0 }
});

const settingModalVisible = ref(false);

const { tabChange, isOpen } = useTabs('app');

</script>
<template>
    <div v-if="section">

        <!-- <h4>Section {{ section['name'] }}</h4> -->
        <ul class="flex border-b border-gray-100">
            <li class="flex-1">
                <a class="relative block px-4 pb-2" href="" @click.prevent="tabChange('app')">
                    <span v-if="isOpen('app')" class="absolute inset-x-0 -bottom-px h-px w-full bg-pink-600"></span>
                    <div class="flex items-center justify-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"
                            data-darkreader-inline-stroke="" style="--darkreader-inline-stroke:currentColor;">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                        </svg>

                        <span class="text-sm font-medium text-gray-900"> Application </span>
                    </div>
                </a>
                
            </li>
            <li class="flex-1">
                <a class="relative block  px-4 pb-2" href="" @click.prevent="settingModalVisible=true;">
                    <span v-if="isOpen('settings')" class="absolute inset-x-0 -bottom-px h-px w-full bg-pink-600"></span>

                    <div class="flex items-center justify-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 text-gray-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>

                        <span class="text-sm font-medium text-gray-900"> Settings </span>
                    </div>
                </a>
            </li>
        </ul>
        <div class="section__container">
            <div class="pt-5" :class="{ 'hidden': !isOpen('settings') }">
                <!-- <Subjects :section="section" :sectionIndex="sectionIndex" />
                <hr class="mt-3"/>
                <Periods class="mt-4" :section="section" :sectionIndex="sectionIndex" /> -->
            </div>
            <div class="pt-5" :class="{ 'hidden': !isOpen('app') }">
                <SubjectsUI :section="section" :sectionIndex="sectionIndex" />
            </div>
        </div>

        <Modal v-model:visible="settingModalVisible" :sectionIndex="sectionIndex" :section="section"/>
    </div>
</template>
<style>
.section__container {
    max-height: 275px;
    overflow-y: scroll;
}
</style>
