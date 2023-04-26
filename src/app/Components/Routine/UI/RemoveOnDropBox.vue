<script setup>
import { useRoutineStore } from '@/app/stores/routine'
import { useUIStore } from '@/app/stores/ui'
import store from '@/app/stores'

const routineStore = useRoutineStore(store)
const operationStore = useUIStore(store)

const onDragOver = (e) => {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
}

const onDrop = (e) => {
  let fromData = JSON.parse(e.dataTransfer.getData('text/plain'))
//   console.log(fromData);
  if (Number(fromData['rowindex']) >= 0 && Number(fromData['index']) >= 0) {
    routineStore.removeSubjectPeriod(fromData['section'], fromData['rowindex'], fromData['index'])
  }
}
</script>
<template>
  <div
    class="p-3 bg-red-300 flex justify-center items-center"
    @drop="onDrop"
    @dragover="onDragOver"
  >
    DROP TO REMOVE
  </div>
</template>
