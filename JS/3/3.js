'use strict';

function parseTime(time) {
  let res = /^([0-9]{2}):([0-9]{2})\+([0-9])$/.exec(time); //1 - 9
  if (res === null) {
    res = /^([0-9]{2}):([0-9]{2})\+([0-9]{2})$/.exec(time); //10 - 12
  }
  //[0] - al matches, [1] - H, [2] - M, [3] - TIMEZONE
  return res;
}

function transTime(time, zone) {
  let parsed = parseTime(time);
  let minutes = parseInt(parsed[1]) * 60 + parseInt(parsed[2]);
  return minutes + (zone - parseInt(parsed[3])) * 60;
}

function transBank(schedule) {
  let oldFrom = parseTime(schedule.from);
  let oldTo = parseTime(schedule.to);
  let newFrom = parseInt(oldFrom[1]) * 60 + parseInt(oldFrom[2]);
  let newTo = parseInt(oldTo[1]) * 60 + parseInt(oldTo[2]);
  return { from: newFrom, to: newTo };
}

function transSchedule(schedule, timezone) {
  let newSchedule = {};
  Object.keys(schedule).forEach(gang => {
    let curLst = schedule[gang];
    let newLst = [];
    for (let i = 0; i < curLst.length; i++) {
      //pair = { from: 'ПН 12:00+5', to: 'ПН 17:00+5' }
      let curPair = curLst[i];

      let oldFrom = curPair.from;
      let oldFromDay = oldFrom.split(' ')[0];
      let oldFromTime = oldFrom.split(' ')[1];

      let oldTo = curPair.to;
      let oldToDay = oldTo.split(' ')[0];
      let oldToTime = oldTo.split(' ')[1];

      let newFrom = { day: oldFromDay, time: transTime(oldFromTime, timezone) };
      let newTo = { day: oldToDay, time: transTime(oldToTime, timezone) };

      let newPair = { from: newFrom, to: newTo };
      newLst.push(newPair);
    }
    newSchedule[gang] = newLst;
  });
  return newSchedule;
}

/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
  //common timezone - timezone of bank
  const timezone = parseInt(parseTime(workingHours.from)[3]);

  //now let`s transform gangSchedule to minutes in bank Timezone
  const newSchedule = transSchedule(schedule, timezone);

  //transformed bank schedule
  const newWorkingHours = transBank(workingHours);

  //busy ranges of gangsters
  let busy = { 'ПН': [], 'ВТ': [], 'СР': [] };
  Object.keys(newSchedule).forEach(gang => {
    let curList = newSchedule[gang];
    for (let i = 0; i < curList.length; i++) {
      let curPair = curList[i];
      let curFrom = curPair.from;
      let curTo = curPair.to;
      if (curFrom.day !== curTo.day) {
        if (curFrom.day === 'ПН' || curFrom.day === 'ВТ' || curFrom.day === 'СР') {
          busy[curFrom.day].push({ from: curFrom.time, to: newWorkingHours.to });
        }
        if (curTo.day === 'ПН' || curTo.day === 'ВТ' || curTo.day === 'СР') {
          busy[curTo.day].push({ from: newWorkingHours.from, to: curTo.time });
        }
      } else {
        if (curFrom.day === 'ПН' || curFrom.day === 'ВТ' || curFrom.day === 'СР') {
          busy[curFrom.day].push({ from: curFrom.time, to: curTo.time });
        }
      }
    }
  });

  //now make ranges when bank can be robbered
  let free = { 'ПН': [], 'ВТ': [], 'СР': [] };
  let start = newWorkingHours.from;
  let finish = newWorkingHours.to - duration;
  for (let i = start; i <= finish; i++) {
    Object.keys(busy).forEach(curDay => {
      if (busy[curDay].length === 0) {
        free[curDay].push({ from: i, to: i + duration });
      } else {
        let busyDay = false;
        for (let j = 0; j < busy[curDay].length; j++) {
          let maybeFrom = busy[curDay][j].from;
          let maybeTo = busy[curDay][j].to;
          busyDay = busyDay || !((i + duration <= maybeFrom) || (i >= maybeTo));
        }
        if (!busyDay) {
          free[curDay].push({ from: i, to: i + duration });
        }
      }
    });
  }

  //now find the first one
  let answer = null;
  let flagChange = false;
  for (let i = 0; i < Object.keys(free).length; i++) {
    let curDay = Object.keys(free)[i];
    for (let j = 0; j < free[curDay].length; j++) {
      answer = { day: curDay, from: free[curDay][j].from, to: free[curDay][j].to };
      flagChange = true;
      break;
    }
    if (flagChange) {
      break;
    }
  }
  //plan contains in the Answer (or it`s empty, if there`s no plan)

  return {
    /**
     * Найдено ли время
     * @returns {boolean}
     */
    exists() {
      return !(answer === null);
    },

    /**
     * Возвращает отформатированную строку с часами
     * для ограбления во временной зоне банка
     *
     * @param {string} template
     * @returns {string}
     *
     * @example
     * ```js
     * getAppropriateMoment(...).format('Начинаем в %HH:%MM (%DD)') // => Начинаем в 14:59 (СР)
     * ```
     */
    format(template) {
      if (answer === null) {
        return '';
      }
      let hhStr = Math.floor(parseInt(answer.from) / 60).toString();
      let mmStr = Math.floor(parseInt(answer.from) % 60).toString();
      if (hhStr.length < 2) {
        hhStr = '0' + hhStr;
      }
      if (mmStr.length < 2) {
        mmStr = '0' + mmStr;
      }
      let ansDay = answer.day;
      let answerTemplate = template.replace('%HH', hhStr).replace('%MM', mmStr).replace('%DD', ansDay);
      return answerTemplate;
    },

    /**
     * Попробовать найти часы для ограбления позже [*]
     * @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
     * @returns {boolean}
     */
    tryLater() {
      if (answer !== null) {
        let nextAnswer = null;
        let order = { 'ПН': 1, 'ВТ': 2, 'СР': 3 };
        for (let i = 0; i < Object.keys(free).length; i++) {
          let curDay = Object.keys(free)[i];
          if (order[curDay] === order[answer.day]) {
            for (let j = 0; j < free[curDay].length; j++) {
              if (free[curDay][j].from >= answer.from + 30) {
                if (nextAnswer === null) {
                  nextAnswer = { day: curDay, from: free[curDay][j].from, to: free[curDay][j].to };
                }
              }
            }
          } else if (order[curDay] > order[answer.day] && free[curDay].length > 0) {
            if (nextAnswer === null) {
              nextAnswer = { day: curDay, from: free[curDay][0].from, to: free[curDay][0].to };
            }
          }
        }
        if (nextAnswer !== null) {
            answer = nextAnswer;
            return true;
        }
        return false;
      }
      return false;
    }
  };
}

let isExtraTaskSolved = true;

module.exports = {
  getAppropriateMoment,
  isExtraTaskSolved
};
