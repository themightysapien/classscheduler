import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { Period, useRoutineStore, SectionSubject } from "./routine";
import { useSubjectStore } from "./subject";
import { randomColor } from "@/app/utils/helpers";
import store from '@/app/stores';

export const useGradeStore = defineStore("grade", {
    state: () => ({
        items: [
            // {
            //     uuid: "79589b83-11c5-4a1d-9677-b927636f54d1",
            //     name: "Grade 7",
            // },
        ] as Grade[],
        active: "" as string,
    }),
    getters: {
        // doubleCount: (state) => state.count * 2,
        mapped: (state) =>
            state.items.reduce((old: any, val: Grade) => {
                if (val && val.uuid) {
                    old[val.uuid] = val;
                }
                return old;
            }, {} as object),
        currentSections: (state) => {
            const routineStore = useRoutineStore(store);

            return routineStore.sections.filter(
                (item) => item.grade == state.active
            );
        },
    },
    actions: {
        add(grade: object) {
            const item = { ...grade, uuid: uuidv4() };
            this.items.push(item as Grade);
            return item;
        },
        remove(gradeIndex: number) {
            this.items.splice(gradeIndex, 1);
        },
        activate(uuid: string) {
            this.active = uuid;
        },
        generateTemplate() {
            this.$patch((state) => {
                for (let i = 8; i <= 10; i++) {
                    state.items.push({
                        name: "Grade " + i,
                        uuid: uuidv4(),
                    });
                }
            });

            const subjectStore = useSubjectStore(store);
            subjectStore.$patch((state) => {
                const teachers = [
                    "APP",
                    "KPP",
                    "SN",
                    "LPS",
                    "RA",
                    "MS",
                    "AS",
                    "BKT",
                ];
                const subjects = [
                    "Maths",
                    "Nepali",
                    "Social",
                    "Science",
                    "English",
                    "Grammer",
                    "OPT. MAths",
                    "Drawing",
                ];
                for (let i = 0; i < 8; i++) {
                    if (!teachers[i] || !subjects[i]) {
                        continue;
                    }
                    state.items.push({
                        uuid: uuidv4(),
                        subject: subjects[i],
                        teacher: teachers[i],
                        color: randomColor(),
                        zoom: 1
                    });
                }

                // console.log(state.items);
            });
            const routineStore = useRoutineStore(store);

            const grades = this.items;
            const subjects = subjectStore.items.map((item) => item.uuid);
            routineStore.$patch((state) => {
                grades.forEach((grade, gIndex) => {
                    ["A", "B", "C"].forEach((s, index) => {
                        let section = {
                            name: s,
                            periods: [] as Period[],
                            subjects: [] as SectionSubject[],
                            schedules: {} as any,
                            grade: grade.uuid,
                            uuid: uuidv4(),
                        };

                        for (let i = 8; i <= 17; i++) {
                            section.periods.push({
                                start_hour: i,
                                start_minute: 0,
                                end_hour: i + 1,
                                end_minute: 0,
                                break: (i - 1) % 3 == 0,
                            } as Period);
                        }

                        for (let i = 0; i < 6; i++) {
                            let subuuid =
                                subjects[
                                   i
                                ];
                            if (subuuid) {
                                section.subjects.push({
                                    uuid: subuuid,
                                    count: 7,
                                });
                            }

                            if(gIndex == 0){
                                for(let j = 0; j<=5; j++){
                                    if(section.periods[i + index].break){
                                        continue;
                                    }
                                    section.schedules[j.toString() + (i + index).toString()] = subuuid;
                                }
                            }
                        }

                        state.sections.push(section);
                    });
                });
            });

            this.active = this.items[0].uuid;

            // console.log(this.items);
        },
    },
});

export interface Grade {
    name: string;
    uuid: string;
}

export const PERIOD_WIDTH = 60;
export const PERIOD_HEIGHT = 35;
