'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
  let maxLevelStr = arguments[2]
  let maxLevel = 0
  if (maxLevelStr === undefined){
    maxLevel = Infinity
  } else {
    maxLevel = parseInt(arguments[2])
  }
  let curLevelList = friends.filter(curPerson => curPerson.best)
  curLevelList.sort((firstPerson, secondPerson) => firstPerson.name.localeCompare(secondPerson.name))
  let inviteList = []
  let counter = maxLevel
  let was = new Set();
  while (counter > 0){
    if  (curLevelList.length === 0){
      break;
    }
    counter--;
    curLevelList.forEach(curPerson => was.add(curPerson.name))
    for (let i = 0; i < curLevelList.length; i++){
      inviteList.push(curLevelList[i])
    }
    let nextLevel = []
    for (let i = 0; i < curLevelList.length; i++){
      let temp = curLevelList[i].friends;
      for (let j = 0; j < temp.length; j++){
        if (!was.has(temp[j])){
          nextLevel.push(temp[j])
        }
      }
    }
    curLevelList = friends.filter(curPerson => nextLevel.includes(curPerson.name))
    curLevelList.sort((firstPerson, secondPerson) => firstPerson.name.localeCompare(secondPerson.name))
  }
  this.invList = inviteList.filter(filter.filter) //sorry for naming
}

Iterator.prototype.done = function() {
  if (!(this.invList.length === 0)){
    return false
  } else {
    return true
  }
}

Iterator.prototype.next = function() {
  if (!this.done()){
    return this.invList.shift();
  } else {
    return null
  }
}

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
  Iterator.call(this, friends, filter, maxLevel)
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype)

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
  if (this.filter === undefined){
    this.filter = () => true
  }
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
  this.filter = curPerson => curPerson.gender === 'male'
  Filter.call(this)
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype)

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
  this.filter = curPerson => curPerson.gender === 'female'
  Filter.call(this)
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype)

/*const friends = [
  {
    name: 'Sam',
    friends: ['Mat', 'Sharon'],
    gender: 'male',
    best: true
  },
  {
    name: 'Sally',
    friends: ['Brad', 'Emily'],
    gender: 'female',
    best: true
  },
  {
    name: 'Mat',
    friends: ['Sam', 'Sharon'],
    gender: 'male'
  },
  {
    name: 'Sharon',
    friends: ['Sam', 'Itan', 'Mat'],
    gender: 'female'
  },
  {
    name: 'Brad',
    friends: ['Sally', 'Emily', 'Julia'],
    gender: 'male'
  },
  {
    name: 'Emily',
    friends: ['Sally', 'Brad'],
    gender: 'female'
  },
  {
    name: 'Itan',
    friends: ['Sharon', 'Julia'],
    gender: 'male'
  },
  {
    name: 'Julia',
    friends: ['Brad', 'Itan'],
    gender: 'female'
  }
];

function friend(name) {
  let len = friends.length;

  while (len--) {
    if (friends[len].name === name) {
      return friends[len];
    }
  }
}

const maleFilter = new MaleFilter();
const femaleFilter = new FemaleFilter();
const maleIterator = new LimitedIterator(friends, maleFilter, 2);
const femaleIterator = new Iterator(friends, femaleFilter);

const invitedFriends = [];

while (!maleIterator.done() && !femaleIterator.done()) {
  invitedFriends.push([
    maleIterator.next(),
    femaleIterator.next()
  ]);
}

while (!femaleIterator.done()) {
  invitedFriends.push(femaleIterator.next());
}

console.log(invitedFriends)*/

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
