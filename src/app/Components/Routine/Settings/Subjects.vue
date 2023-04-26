<template>
  <div class="settings-sections" v-if="section">
    <table>
      <tr>
        <th class="text-left">Subject-Teacher</th>
        <th>Periods</th>
        <th></th>
      </tr>
      <tr v-for="(subject, pIndex) of subjects" :key="sectionIndex + '_' + pIndex" class="">
        <td class="font-bold" :style="{ color: subject.color ?? 'gray' }">
          <div class="flex items-center">
            <span v-html="subject.subject"></span>
            <span>-</span>
            <!-- <input type="text" class="input-xs w-[100px]" :value="subject.teacher" /> -->
            <span v-html="subject.teacher"></span>
            <!-- <input type="text" class="input-xs" :value="subject.subject" /> -->
          </div>
        </td>
        <td class="">
          <input
            type="number"
            class="input-xs w-[50px]"
            min="0"
            max="40"
            :value="subject['count']"
            name="break"
          />
        </td>
        <td class="">
          <!-- <a href="#"
                        class="w-7 h-7 inline-flex justify-center items-center bg-blue-300 text-white bold rounded-full"
                        title="Add New Subject" @click.prevent="routineStore.addSubject(section.uuid, { ...subject })">+</a> -->
          <a
            href="#"
            title="Remove Subject"
            class="ml-2 w-7 h-7 inline-flex justify-center items-center bg-red-300 text-white bold rounded-full"
            @click.prevent="(e) => routineStore.removeSubject(section.uuid, subject?.uuid)"
            >-</a
          >
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <select class="select-xs" @change="onAvailableSubjectChangeHandler">
            <option value="">Select Subject</option>
            <option
              v-for="(subject, sIndex) of availableSubjects"
              :key="'available_' + sIndex"
              :value="subject.uuid"
            >
              {{ `${subject.subject}-${subject.teacher}` }}
            </option>
          </select>
          <span class="block font-bold">OR Add New</span>
          <div></div>
        </td>
      </tr>
      <tr>
        <td class="flex items-center">
          <input
            type="text"
            class="input-xs w-[120px]"
            v-model="form.subject"
            placeholder="Subject"
          />
          <span>-</span>
          <input
            type="text"
            class="input-xs w-[80px]"
            v-model="form.teacher"
            placeholder="Teacher"
          />
        </td>
        <td class="">
          <input
            type="number"
            class="input-xs"
            style="width: 50px"
            min="0"
            max="40"
            v-model="form.count"
          />
        </td>
        <td class="">
          <a
            href="#"
            class="w-7 h-7 inline-flex justify-center items-center bg-blue-300 text-white bold rounded-full"
            title="Add New Subject"
            @click.prevent="addSubjectHandler"
            >+</a
          >
        </td>
      </tr>
    </table>
    <!-- <button @click.prevent="(e) => addSectionSubject(e, section.uuid)" title="Add New Subject"
            class="mt-2 px-2 bg-blue-300 rounded">Add Subject</button> -->
  </div>
</template>
<script lang="ts">
import { useRoutineStore } from '@/app/stores/routine'
import { computed, defineComponent, PropType, reactive } from 'vue'
// import { Section } from "@/app/stores/routine";
import { Subject, useSubjectStore } from '@/app/stores/subject'
import store from '@/app/stores'

export default defineComponent({
  setup(
    props /* : {
        section: Section,
        sectionIndex: number
    } */
  ) {
    const initialFormState = {
      subject: '',
      teacher: '',
      count: 5
    }
    const routineStore = useRoutineStore(store)
    const subjectStore = useSubjectStore(store)
    let form = reactive({ ...initialFormState })

    function resetForm() {
      Object.assign(form, initialFormState)
    }

    const subjects = computed(() => routineStore.sectionSubjects(props.section.uuid))

    return {
      routineStore,
      form,
      resetForm,
      subjects,
      availableSubjects: computed(() => {
        return subjectStore.items.filter(
          (item: Subject) => subjects.value.findIndex((s: Subject) => s.uuid == item.uuid) == -1
        )
      })
    }
  },
  props: {
    section: { required: true, type: Object /* as PropType<Section> */ },
    sectionIndex: { default: 0 }
  },
  mounted() {
    // console.log(this.routineStore);
  },
  methods: {
    addSubjectHandler(e: any) {
      if (this.form.subject && this.form.teacher) {
        this.routineStore.addSubject(this.section.uuid, this.form)
        this.resetForm()
      }
    },
    onAvailableSubjectChangeHandler(e: any) {
      if (e.target.value) {
        this.routineStore.attachSubject(this.section.uuid, e.target.value);
        e.target.selectedIndex = -1;
      }
    },
    addSectionSubject(e: any, uuid: string) {
      // const name = prompt('From : To');
      // if (name) {
      // }
      this.routineStore.addSubject(uuid, {
        subject: 'Maths',
        teacher: 'KPP',
        count: 6
      })
    }
  }
})
</script>
