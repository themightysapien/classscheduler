import type { Section, SubjectSchedules } from '../stores/routine'
import type { Subject } from '../stores/subject'
import { diff, intersection } from '../utils/helpers'

export default function useShuffle(section: Section) {
  // const lastAvailableSlot: {
  //   [key: number]: number
  // } = {
  //   0: 0,
  //   1: 0,
  //   2: 0,
  //   3: 0,
  //   4: 0,
  //   5: 0,
  //   6: 0
  // }

  const periods: number[] = []

  const init = () => {
    section.periods.forEach((item, index) => {
      if (item.break) {
        return
      }

      periods.push(index)
    })

    ready()
  }

  const ready = () => {
    section.schedules = {}
  }

  const process = (
    allSchedules: {
      [key: string]: SubjectSchedules[]
    },
    subjectId: string
  ) => {
    const schedules = allSchedules[subjectId]
    // console.log(schedules);
    if (!schedules || !schedules.length) {
      return processNewSubject(subjectId)
    }
    // console.log(periods);
    schedules.forEach((schedule: SubjectSchedules, day: number) => {
      if (day >= 6) {
        return
      }
      //   console.log(schedule.dayPeriods);
      if (
        schedule.dayPeriods.filter((item) => {
          return item.section == section.uuid
        }).length
      ) {
        return
      }
      const occupied = schedule.dayPeriods.map((item) => item.index)
      //   console.log(occupied);

      //   console.log(schedule.dayPeriods, occupied, periods);
      const available = diff(periods, occupied)

      let found = false

      available.some((slot: number) => {
        const key = day + '' + slot
        // console.log(Object.keys(section.schedules))
        //  && Object.keys(section.schedules).filter(dayslot => dayslot.toString().indexOf(day.toString()) == -1 ).length == 0
        // console.log(section.schedules[key]);
        if (!section.schedules[key]) {
          found = true
          section.schedules[key] = subjectId
          return true
        }
      })

      if (!found) {
        // console.log(available);
        processNotFound(allSchedules, subjectId, available, day)
      }
      // console.log(section);
    })
  }

  const processNotFound = (
    allSchedules: {
      [key: string]: SubjectSchedules[]
    },
    subjectId: string,
    available: number[],
    day: number
  ) => {
    const openSlotsInDay: number[] = []
    periods.forEach((item) => {
      if (!section.schedules[day + '' + item]) {
        openSlotsInDay.push(item)
      }
    })

    if (openSlotsInDay.length && available.length > 0) {
      available.reverse().some((slot) => {
        const key = day + '' + slot

        /* get current subject in last slot */
        const currentSubject: string = section.schedules[key]
        if (currentSubject) {
          /* now check if current subject can be swapped */
          const dayPeriods = allSchedules[currentSubject][day]
            ? allSchedules[currentSubject][day].dayPeriods
            : null

          if (dayPeriods && dayPeriods.length) {
            const currentSubjectFilledSlots = dayPeriods?.map((item) => item.index)
            const availableForCurrentSubject = diff(openSlotsInDay, currentSubjectFilledSlots);
            /* if there is atleast one new slot for current than swap */
            if(availableForCurrentSubject.length){
              section.schedules[day + '' + availableForCurrentSubject[0]] = currentSubject;
              section.schedules[key] = subjectId;
              return true;
            }
            // section.schedules[]
          }
        }
      })
    }
  }

  const processNewSubject = (subjectId: string) => {
    // console.log('new te4acher');
    for (let day = 0; day <= 5; day++) {
      // console.log(periods);
      periods.some((slot) => {
        const key = day + '' + slot
        // console.log(section.schedules[key]);

        if (!section.schedules[key]) {
          section.schedules[key] = subjectId
          return true
        }
      })
    }
  }

  return {
    init,
    ready,
    process,
    processNewSubject
  }
}
