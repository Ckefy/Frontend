/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {

  let all = {};

  return {

    /**
     * Подписаться на событие
     * @param {String} event
     * @param {Object} student
     * @param {Function} func
     */
    on: function (event, student, func) {
      let pair = {student: student, func: func}
      //can be bug with last example - hasOwnProperty as property
      //https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
      if (!(Object.prototype.hasOwnProperty.call(all, event))) {
        all[event] = [];
      }
      all[event].push(pair);
      return this;
    },

    /**
     * Отписаться от события
     * @param {String} event
     * @param {Object} student
     */
    off: function (event, student) {
      Object.keys(all).forEach(curEvent => {
        if (curEvent === event || curEvent.startsWith(event + '.')){
          let newSublist = [];
          for (let i = 0; i < all[curEvent].length; i++){
            if (all[curEvent][i].student === student){
              continue;
            }
            newSublist.push(all[curEvent][i]);
          }
          all[curEvent] = newSublist;
        }
      })
      return this;
    },

    /**
     * Уведомить о событии
     * @param {String} event
     */
    emit: function (event) {
      //we need to parse something.1.2.3 to something.1.2.3, something.1.2, something.1, something
      let splitted = event.split('.');
      let parsed = [];
      for (let i = 0; i < splitted.length; i++){
        let curPiece = splitted[i];
        if (i === 0){
          parsed.push(curPiece);
        } else {
          parsed.push(parsed[i - 1] + '.' + curPiece);
        }
      }
      parsed = parsed.reverse();
      parsed.forEach(curEvent => {
        if (!(Object.prototype.hasOwnProperty.call(all, curEvent))) {
          return;
        }
        all[curEvent].forEach(pair => {
          pair.func.call(pair.student);
        })
      })
      return this;
    },

    /**
     * Подписаться на событие с ограничением по количеству полученных уведомлений
     * @star
     * @param {String} event
     * @param {Object} student
     * @param {Function} preFunc
     * @param {Number} times – сколько раз получить уведомление
     */
    several: function (event, student, preFunc, times) {
      if (times <= 0) {
        this.on(event, student, preFunc);
        return this;
      }
      let counter = 0;
      this.on(event, student, function() {
        counter++;
        if (counter <= times) {
          preFunc.call(student);
        }
      })
      return this
    },

    /**
     * Подписаться на событие с ограничением по частоте получения уведомлений
     * @star
     * @param {String} event
     * @param {Object} student
     * @param {Function} preFunc
     * @param {Number} times – как часто уведомлять
     */
    through: function (event, student, preFunc, times) {
      if (times <= 0) {
        this.on(event, student, preFunc);
        return this;
      }
      let counter = 0;
      this.on(event, student, function() {
        if (counter % times === 0) {
          preFunc.call(student);
        }
        counter++;
      })
      return this
    }
  };
}


module.exports = {
  getEmitter
};
