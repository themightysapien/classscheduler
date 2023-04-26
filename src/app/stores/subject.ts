import { randomColor } from "@/app/utils/helpers";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const useSubjectStore = defineStore("subject", {
    state: () => ({
        items: [
            // {
            //     uuid: "39589b83-11c5-4a1d-9677-b927636f54d1",
            //     subject: "Science",
            //     teacher: "KPP",
            //     color: 'rgb(160,32,240)'
            // },
        ] as Subject[],
        active: "" as string,
    }),
    getters: {
        // doubleCount: (state) => state.count * 2,
        mapped: (state) =>
            state.items.reduce((old: any, val: Subject) => {
                if (val && val.uuid) {
                    old[val.uuid] = val;
                }
                return old;
            }, {} as object),
    },
    actions: {
        add(subject: any) {
            if (
                this.items.filter(
                    (item) =>
                        item.subject.toLowerCase() == subject["subject"].toString().toLowerCase() &&
                        item.teacher.toLocaleLowerCase() == subject["teacher"].toString().toLowerCase()
                ).length
            ) {
                alert("Subject already exists");
                return;
            }
            const item = { ...subject, uuid: uuidv4(), color: '#' + randomColor(), zoom: 1 };
            this.items.push(item as Subject);
            return item;
        },
        remove(subjectIndex: number) {
            this.items.splice(subjectIndex, 1);
        },
        activate(uuid: string) {
            this.active = uuid;
        },
    },
});

export interface Subject {
    subject: string;
    teacher: string;
    count?: number;
    uuid: string;
    color?: string;
    zoom?: number;
}
