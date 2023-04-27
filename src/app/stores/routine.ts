import { defineStore } from 'pinia'
import { Subject, useSubjectStore } from './subject'
import { Grade, useGradeStore } from './grade'
import { v4 as uuidv4 } from 'uuid'
import { ObjectUtils } from '@/app/utils'
import { nTimesItemTemplate } from '@/app/utils/helpers'
import store from '@/app/stores'

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useRoutineStore = defineStore('routine', {
  state: () => ({
    sections: [
      // {
      //     name: "A",
      //     periods: [
      //         {
      //             start_hour: 8,
      //             start_minute: 0,
      //             end_hour: 9,
      //             end_minute: 0,
      //         },
      //         {
      //             start_hour: 9,
      //             start_minute: 0,
      //             end_hour: 10,
      //             end_minute: 0,
      //         },
      //         {
      //             start_hour: 10,
      //             start_minute: 0,
      //             end_hour: 10,
      //             end_minute: 30,
      //             break: true,
      //         },
      //     ] as Period[],
      //     subjects: [
      //         {
      //             uuid: "39589b83-11c5-4a1d-9677-b927636f54d1",
      //             count: 5,
      //         },
      //     ] as SectionSubject[],
      //     schedules: {
      //         "00": "39589b83-11c5-4a1d-9677-b927636f54d1",
      //         // "01": "39589b83-11c5-4a1d-9677-b927636f54d1",
      //         // "11": "39589b83-11c5-4a1d-9677-b927636f54d1",
      //     },
      //     grade: "79589b83-11c5-4a1d-9677-b927636f54d1",
      //     uuid: "79589b83-11c5-4a1d-9677-b927636f54b1",
      // },
      // {
      //     name: "B",
      //     periods: [
      //         {
      //             start_hour: 8,
      //             start_minute: 0,
      //             end_hour: 9,
      //             end_minute: 0,
      //         },
      //         {
      //             start_hour: 9,
      //             start_minute: 0,
      //             end_hour: 10,
      //             end_minute: 0,
      //         },
      //         {
      //             start_hour: 10,
      //             start_minute: 0,
      //             end_hour: 10,
      //             end_minute: 30,
      //             break: true,
      //         },
      //     ] as Period[],
      //     subjects: [
      //         {
      //             uuid: "39589b83-11c5-4a1d-9677-b927636f54d1",
      //             count: 5,
      //         },
      //     ] as SectionSubject[],
      //     schedules: {
      //         // "00": "39589b83-11c5-4a1d-9677-b927636f54d1",
      //         // "01": "39589b83-11c5-4a1d-9677-b927636f54d1",
      //         // "11": "39589b83-11c5-4a1d-9677-b927636f54d1",
      //     },
      //     grade: "79589b83-11c5-4a1d-9677-b927636f54d1",
      //     uuid: "79589b83-11c5-4a1d-9677-b927636f54b3",
      // },
    ] as Section[]
  }),
  getters: {
    // doubleCount: (state) => state.count * 2,

    mappedSections: (state): { [key: string]: Section } =>
      state.sections.reduce((old: any, val: Section) => {
        if (val && val.uuid) {
          old[val.uuid] = val
        }
        return old
      }, {} as object),

    classPeriods: (state: any) => {
      const subjectStore = useSubjectStore(store)
      const subjectMap = subjectStore.mapped
      return (uid: string) => {
        const section = state.mappedSections[uid] as Section
        const periods = section.periods
        let items = []
        for (let weekday = 0; weekday <= 6; weekday++) {
          items.push(
            periods.map((period: Period, pIndex: number) => {
              let key = weekday.toString() + pIndex.toString()
              // console.log(section.subjects[section.schedules[key]]);

              return section.schedules[key] ? subjectMap[section.schedules[key]] : null
            })
          )
        }

        // console.log(items);

        return items
      }
    },
    remainingPeriods: (state: any) => {
      const subjectStore = useSubjectStore(store)
      const mappedSubjects = subjectStore.mapped
      const mappedSections = state.mappedSections

      return (sectionId: string) => {
        const section = mappedSections[sectionId]
        const filledPeriodSubjects = Object.values(section.schedules)
        // console.log(filledPeriodSubjects);
        return section.subjects
          .map((subject: SectionSubject) => {
            let item = { ...subject } as any
            item['remaining'] =
              Number(item['count'] ?? 0) - filledPeriodSubjects.filter((s) => s == item.uuid).length
            // console.log(item);
            return item
          })
          .reduce((old: any, val: any) => {
            // console.log(val);
            old[val.uuid] = val.remaining
            // console.log(old);
            return old
          }, {})
      }
    },
    sectionSubjects: (state: any) => {
      const subjectStore = useSubjectStore(store)
      const mappedSections = state.mappedSections
      const mappedSubjects = subjectStore.mapped

      return (sectionId: string) => {
        const section = mappedSections[sectionId]
        return section.subjects.length
          ? section.subjects.map((item: Subject) => {
              return {
                ...mappedSubjects[item.uuid],
                count: item.count
              }
            })
          : []
      }
    },
    sectionSubjectSchedules: (state) => {
      const sections = state.sections
      const mappedSubjectsByTime: { [key: string]: SubjectSchedules[] } = {}
      sections.forEach((section: Section) => {
        // console.log(Object.keys(section.schedules));
        for (let key of Object.keys(section.schedules)) {
          const subjectId = section.schedules[key] as string
          if (subjectId) {
            if (!mappedSubjectsByTime[subjectId]) {
              mappedSubjectsByTime[subjectId] =
                /* [
                                {
                                    hours: [],
                                    // slots: [],
                                    periods: [],
                                    secondsGroup: [],
                                    dayPeriods: [],
                                } as SubjectSchedules,
                                {
                                    hours: [],
                                    // slots: [],
                                    periods: [],
                                    secondsGroup: [],
                                    dayPeriods: [],
                                } as SubjectSchedules,
                                {
                                    hours: [],
                                    // slots: [],
                                    periods: [],
                                    secondsGroup: [],
                                    dayPeriods: [],
                                } as SubjectSchedules,
                                {
                                    hours: [],
                                    // slots: [],
                                    periods: [],
                                    secondsGroup: [],
                                    dayPeriods: [],
                                } as SubjectSchedules,
                                {
                                    hours: [],
                                    // slots: [],
                                    periods: [],
                                    secondsGroup: [],
                                    dayPeriods: [],
                                } as SubjectSchedules,
                                {
                                    hours: [],
                                    // slots: [],
                                    periods: [],
                                    secondsGroup: [],
                                    dayPeriods: [],
                                } as SubjectSchedules,
                                {
                                    hours: [],
                                    // slots: [],
                                    periods: [],
                                    secondsGroup: [],
                                    dayPeriods: [],
                                } as SubjectSchedules,
                            ]; */
                nTimesItemTemplate(
                  {
                    // hours: [],
                    // // slots: [],
                    // periods: [],
                    // secondsGroup: [],
                    dayPeriods: []
                  } as SubjectSchedules,
                  7
                ) as SubjectSchedules[]
            }

            const info = ObjectUtils.extractPeriodInfo(key, section.periods)
            // console.log(
            //     mappedSubjectsByTime[subjectId][info.rowIndex]
            // );
            if (info) {
              // mappedSubjectsByTime[subjectId][
              //     info.rowIndex
              // ].periods.push(info.index);
              // mappedSubjectsByTime[subjectId][
              //     info.rowIndex
              // ].hours.push(...info.hours);
              // mappedSubjectsByTime[subjectId][
              //     info.rowIndex
              // ].secondsGroup.push(info.seconds);
              mappedSubjectsByTime[subjectId][info.rowIndex].dayPeriods.push({
                grade: section.grade,
                section: section.uuid,
                index: info.index,
                secondsGroup: info.seconds,
                ...section.periods[info.index]
              })
            }
          }
        }
      })

      return mappedSubjectsByTime
    }
  },
  actions: {
    renameSection(sectionId: string, name: string) {
      const section = this.mappedSections[sectionId]
      if (
        this.sections.filter((item) => {
          return item.name == name && item.grade == section.grade
        }).length
      ) {
        alert('Section already exists')
        return
      }

      section['name'] = name
    },
    addSection(section: Section) {
      if (
        this.sections.filter((item) => {
          return item.name == section.name && item.grade == section.grade
        }).length
      ) {
        alert('Section already exists')
        return
      }
      const item = { ...section, uuid: uuidv4() }
      this.sections.push(item)
      return item
    },
    removeSection(sectionId: string) {
      const index = this.sections.findIndex((item) => item.uuid == sectionId)

      if (index >= 0) {
        this.sections.splice(index, 1)
      }
    },
    copySection(name: string, sectionIndex: number) {},
    addPeriod(sectionId: string, period: object) {
      const section = this.mappedSections[sectionId]

      section.periods.push(period as Period)
    },
    removePeriod(sectionId: string, periodIndex: number) {
      if (
        this.mappedSections[sectionId] &&
        this.mappedSections[sectionId].periods &&
        this.mappedSections[sectionId].periods.length
      ) {
        this.mappedSections[sectionId].periods.splice(periodIndex, 1)
      }
    },
    attachSubject(sectionId: string, subjectId: string) {
      const section = this.mappedSections[sectionId]
      if (section) {
        section.subjects.push({
          uuid: subjectId,
          count: 6
        })
      }
    },
    addSubject(sectionId: string, data: any) {
      const subjectStore = useSubjectStore(store)
      const subject = subjectStore.add(data)
      if (!subject) {
        return
      }
      const section = this.mappedSections[sectionId]

      // if(subject.items.filter(item => item.subject))
      if (section) {
        section.subjects.push({
          uuid: subject.uuid,
          count: data['count']
        })
      }
    },
    removeSubject(sectionId: string, subjectId: string) {
      this.$patch((state) => {
        const section = this.mappedSections[sectionId]
        if (section.subjects && section.subjects.length) {
          const index = section.subjects.findIndex((item: SectionSubject) => item.uuid == subjectId)
          if (index >= 0) {
            for (let key in section.schedules) {
              if (section.schedules.hasOwnProperty(key)) {
                if (section.schedules[key] == subjectId) {
                  delete section.schedules[key]
                }
              }
            }
            section.subjects.splice(index, 1)
          }
        }
      })
    },
    moveSubjectPeriod(
      sectionId: string,
      fromRow: number,
      fromCol: number,
      toRow: number,
      toCol: number
    ) {
      const section = this.mappedSections[sectionId]
      // console.log(fromRow, fromCol, toRow, toCol);
      const fromKey = fromRow.toString() + fromCol.toString()
      const toKey = toRow.toString() + toCol.toString()

      let toVal = section.schedules[toKey]
      section.schedules[toKey] = section.schedules[fromKey]
      section.schedules[fromKey] = toVal
      // console.log(section.schedules);
    },
    addSubjectToPeriod(sectionId: string, subjectId: string, toRow: number, toCol: number) {
      const section = this.mappedSections[sectionId]
      const toKey = toRow.toString() + toCol.toString()
      section.schedules[toKey] = subjectId
    },
    removeSubjectPeriod(sectionId: string, row: number, col: number) {
      const section = this.mappedSections[sectionId]
      const key = row.toString() + col.toString()
      delete section.schedules[key]
    }
  }
})

interface GradeSection {
  [key: string]: Section[]
}

export interface SectionSubject {
  uuid: string
  count?: number
}
export interface Section {
  name: string
  periods: Period[]
  // subjects: Subject[];
  subjects: SectionSubject[]
  schedules: {
    [key: string]: string
  }
  uuid: string
  grade: string
}

export interface Period {
  start_hour: number
  start_minute: number
  end_hour: number
  end_minute: number
  break?: boolean
}

export interface SubjectSchedules {
  // hours: number[];
  // slots: number[];
  // periods: number[];
  dayPeriods: {
    secondsGroup: number[]
    grade: string
    section: string
    start_hour: number
    start_minute: number
    end_hour: number
    end_minute: number
    break?: boolean
    index: number
  }[]
}
