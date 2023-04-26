import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useSubjectStore } from "./subject";
import { randomColor } from "@/app/utils/helpers";

export const useUIStore = defineStore("ui", {
    state: () => ({
        dragData: null,
        dragging: false,
    }),
   
    actions: {
        dragStarted(data: any) {
            this.dragData = data;
        },
        toggleDragging(bool: boolean) {
            this.dragging = bool;
        },
        dropped() {
            this.$patch((state) => {
                state.dragging = false;
                state.dragData = null;
            });
        },
    },
});

export interface Grade {
    name: string;
    uuid: string;
}
