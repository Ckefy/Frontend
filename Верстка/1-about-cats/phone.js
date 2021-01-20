'use strict';

/**
 * Телефонная книга
 */
const phoneBook = new Map();

/**
 * Вызывайте эту функцию, если есть синтаксическая ошибка в запросе
 * @param {number} lineNumber – номер строки с ошибкой
 * @param {number} charNumber – номер символа, с которого запрос стал ошибочным
 */
function syntaxError(lineNumber, charNumber) {
  throw new Error(`SyntaxError: Unexpected token at ${lineNumber}:${charNumber}`);
}

function validateName(name) {
  const reg = /^[^;]*$/;
  return reg.test(name);
}

function validatePhone(phone) {
  const reg = /^[0-9]{10}$/;
  return reg.test(phone);
}

/**
 * Выполнение запроса на языке pbQL
 * @param {string} query
 * @returns {string[]} - строки с результатами запроса
 */
function run(query) {
  let queries = query.split(';');
  let answer = [];
  for (let i = 0; i < queries.length; i++) {
    let curQuery = queries[i];
    let parsed = curQuery.split(' ');
    if (i === queries.length - 1) {
      if (!(parsed[0] === '')) {
        syntaxError(i + 1, curQuery.length + 1);
      }
    }
    //add
    if (parsed[0] === 'Создай') {
      if (parsed[1] === 'контакт') {
        let curName = curQuery.substr(15);
        if (!validateName(curName)) {
          syntaxError(i + 1, 16);
        }
        add(curName);
        continue;
      } else {
        syntaxError(i + 1, 8);
      }
    }
    //delete block
    if (parsed[0] === 'Удали') {
      //del
      if (parsed[1] === 'контакт') {
        let curName = curQuery.substr(14); //c 14 символа
        /*if (curName === "" && parsed.length === 3){
          while (true) {

          }
        }*/
        if (!validateName(curName)) {
          syntaxError(i + 1, 15);
        }
        del(curName);
        continue;
        //lookupAndDel
      } else if (parsed[1] === 'контакты,') {
        let jj = 1;
        if (parsed[2] === 'где') {
          if (parsed[3] === 'есть') {
            let curSub = '';
            let before = 0;
            for (let z = 0; z < 4; z++) {
              before = before + parsed[z].length + 1;
            }
            curSub = curQuery.substr(before);
            lookupAndDel(curSub);
            continue;
          } else {
            jj = jj + 2;
          }
        } else {
          jj = jj + 1;
        }
        let before = 0;
        for (let z = 0; z < jj; z++) {
          before = before + parsed[z].length + 1;
        }
        syntaxError(i + 1, before + 1);
        //delConts
      } else if (parsed[1] === 'почту' || parsed[1] === 'телефон') {
        let delPhones = [];
        let delMails = [];
        let curName = '';
        for (let j = 1; j < parsed.length; j++) {
          if (parsed[j] === 'телефон') {
            if (!validatePhone(parsed[j + 1])) {
              let before = 0;
              for (let z = 0; z < j + 1; z++) {
                before = before + parsed[z].length + 1;
              }
              syntaxError(i + 1, before + 1);
            }
            delPhones.push(parsed[j + 1]);
            j++;
          } else if (parsed[j] === 'почту') {
            delMails.push(parsed[j + 1]);
            j++;
          } else if (parsed[j] === 'для') {
            if (parsed[j + 1] === 'контакта') {
              j = j + 1;
              let before = 0;
              for (let z = 0; z < j + 1; z++) {
                before = before + parsed[z].length + 1;
              }
              curName = curQuery.substr(before);
              break;
            } else {
              j = j + 1;
              let before = 0;
              for (let z = 0; z < j; z++) {
                before = before + parsed[z].length + 1;
              }
              syntaxError(i + 1, before + 1);
            }
          } else if (parsed[j] === 'и') {
            continue;
          } else {
            let before = 0;
            for (let z = 0; z < j; z++) {
              before = before + parsed[z].length + 1;
            }
            syntaxError(i + 1, before + 1);
          }
        }
        delConts(curName, delPhones, delMails);
        continue;
      } else {
        syntaxError(i + 1, 7);
      }
    }
    //lookup
    if (parsed[0] === 'Покажи') {
      let attrs = [];
      let sub = '';
      for (let j = 1; j < parsed.length; j++) {
        if (parsed[j] === '') {
          let before = 0;
          for (let z = 0; z < j; z++) {
            before = before + parsed[z].length + 1;
          }
          syntaxError(i + 1, before + 1);
        }
        if (parsed[j] === 'телефоны') {
          attrs.push(parsed[j]);
        } else if (parsed[j] === 'почты') {
          attrs.push(parsed[j]);
        } else if (parsed[j] === 'имя') {
          attrs.push(parsed[j]);
        } else if (parsed[j] === 'для') {
          //move j to Est`
          if (parsed[j + 1] === 'контактов,') {
            if (parsed[j + 2] === 'где') {
              if (parsed[j + 3] === 'есть') {
                j = j + 3;
                let before = 0;
                for (let z = 0; z < j + 1; z++) {
                  before = before + parsed[z].length + 1;
                }
                sub = curQuery.substr(before);
                break;
              } else {
                j = j + 3;
              }
            } else {
              j = j + 2;
            }
          } else {
            j = j + 1;
          }
          let before = 0;
          for (let z = 0; z < j; z++) {
            before = before + parsed[z].length + 1;
          }
          syntaxError(i + 1, before + 1);
        } else if (parsed[j] === 'и') {
          continue;
        } else {
          let before = 0;
          for (let z = 0; z < j; z++) {
            before = before + parsed[z].length + 1;
          }
          syntaxError(i + 1, before + 1);
        }
      }
      answer = answer.concat(lookup(attrs, sub));
      continue;
    }
    //addConts
    if (parsed[0] === 'Добавь') {
      let addPhones = [];
      let addMails = [];
      let curName = '';
      for (let j = 1; j < parsed.length; j++) {
        if (parsed[j] === '') {
          let before = 0;
          for (let z = 0; z < j; z++) {
            before = before + parsed[z].length + 1;
          }
          syntaxError(i + 1, before + 1);
        }
        if (parsed[j] === 'телефон') {
          if (!validatePhone(parsed[j + 1])) {
            let before = 0;
            for (let z = 0; z < j + 1; z++) {
              before = before + parsed[z].length + 1;
            }
            syntaxError(i + 1, before + 1);
          }
          addPhones.push(parsed[j + 1]);
          j++;
        } else if (parsed[j] === 'почту') {
          addMails.push(parsed[j + 1]);
          j++;
        } else if (parsed[j] === 'для') {
          if (parsed[j + 1] === 'контакта') {
            j++;
            let before = 0;
            for (let z = 0; z < j + 1; z++) {
              before = before + parsed[z].length + 1;
            }
            curName = curQuery.substr(before);
            break;
          } else {
            let before = 0;
            for (let z = 0; z < j + 1; z++) {
              before = before + parsed[z].length + 1;
            }
            syntaxError(i + 1, before + 1);
          }
        } else if (parsed[j] === 'и') {
          continue;
        } else {
          let before = 0;
          for (let z = 0; z < j; z++) {
            before = before + parsed[z].length + 1;
          }
          syntaxError(i + 1, before + 1);
        }
      }
      addConts(curName, addPhones, addMails);
      continue;
    }
    if (!(parsed[0] === '' && i === queries.length - 1)) {
      syntaxError(i + 1, 1);
    }
  }
  return answer;
}

console.log(run('Создай контакт Григорий;;' +
  'Удали контакт Григорий;' +
  'Покажи имя для контактов, где есть ий;'));
//console.log(phoneBook.entries());

/**
 * Создай контакт <имя>
 Создает новый контакт с именем <имя> с пустыми списками телефонов и почт
 Принимает <имя> содержащее любые символы, кроме ;
 Не создает ничего, если контакт уже существует
 Пример: Создай контакт Григорий;
 */

function add(name) {
  if (!phoneBook.has(name)) {
    phoneBook.set(name, { phones: [], mails: [] });
  }
}

/**
 * Удали контакт <имя>
 Удаляет контакт с именем <имя>
 Принимает <имя> содержащее любые символы, кроме ;
 Не удаляет ничего, если контакт не существует
 */

function del(name) {
  if (phoneBook.has(name)) {
    phoneBook.delete(name);
  }
}

/**
 * Добавь телефон <телефон> и почту <почта> для контакта <имя>
 Добавляет <телефон> в спискок телефонов и <почту> в список почт для контакта <имя>
 Принимает телефоны только в формате 5556667788 (без кода), иначе это считается ошибкой синтаксиса
 Принимает почты без пробелов, поэтому через пробел ожидается следующее слово
 Принимает произвольное количество почт и телефонов, перечисленных через и
 Не добавляет ничего, если контакт не существует
 Не добавляет почту/телефон, если такая почта/телефон уже есть у контакта
 */

function addConts(name, addPhones, addMails) {
  if (!phoneBook.has(name)) {
    return;
  }
  const newPhones = new Set(phoneBook.get(name).phones);
  for (let i = 0; i < addPhones.length; i++) {
    newPhones.add(addPhones[i]);
  }
  const newMails = new Set(phoneBook.get(name).mails);
  for (let i = 0; i < addMails.length; i++) {
    newMails.add(addMails[i]);
  }
  let arr1 = Array.from(newPhones);
  let arr2 = Array.from(newMails);
  phoneBook.set(name, { phones: arr1, mails: arr2 });
}

/**
 * Удали телефон <телефон> и почту <почта> для контакта <имя>
 Удаляет <телефон> из списка телефонов и <почту> из списка почт контакта <имя>
 Принимает телефоны только в формате 5556667788 (без кода), иначе это считается ошибкой синтаксиса
 Принимает почты без пробелов, иначе это считается ошибкой синтаксиса
 Принимает произвольное количество почт и телефонов, перечисленных через и
 Не удаляет ничего, если контакт не существует
 Не удаляет почту/телефон, если такая почта/телефон отсутствует у контакта
 */
function delConts(name, delPhones, delMails) {
  if (!phoneBook.has(name)) {
    return;
  }
  const newPhones = new Set(phoneBook.get(name).phones);
  for (let i = 0; i < delPhones.length; i++) {
    newPhones.delete(delPhones[i]);
  }
  const newMails = new Set(phoneBook.get(name).mails);
  for (let i = 0; i < delMails.length; i++) {
    newMails.delete(delMails[i]);
  }
  let arr1 = Array.from(newPhones);
  let arr2 = Array.from(newMails);
  phoneBook.set(name, { phones: arr1, mails: arr2 });
}

/**
 * Покажи почты и телефоны для контактов, где есть <запрос>
 Ищет вхождение <запрос> хотя бы в один из телефонов, либо в одну из почт, либо в имя контакта
 Принимает <запрос> содержащий любые символы, кроме ;
 Принимает для перечисления произвольное количество типов полей, перечисленных через и, среди которых могут быть имя, почты и телефоны
 Возвращает список строк в формате <почта 1>,<почта 2>;<телефон 1> в соответствии с запращиваемыми полями, для подходящих под запрос контактов
 Возвращает контакты в порядке создания, а их почты/телефоны в порядке добавления
 Возвращает имена и электронные почты как есть, а телефоны в виде +7 (555) 666-77-88
 Не возвращает ничего на пустой запрос (Покажи имя для контактов, где есть ;)
 */

//set make order via their order of adding - as we need
//map make it too
//attrs - array of attributes need to print
function lookup(attrs, sub) {
  //check tests and ;
  if (sub === '') {
    return [];
  }
  sub = escapeRegExp(sub);
  let reg = new RegExp('^.*' + sub + '.*$');
  let ansArr = [];
  for (let [key, conts] of phoneBook) {
    let ans = '';
    let curName = key;
    let curPhones = conts.phones;
    let curMails = conts.mails;
    let flag = false;
    if (reg.test(curName)) {
      flag = true;
    }
    for (let i = 0; i < curPhones.length; i++) {
      if (reg.test(curPhones[i])) {
        flag = true;
      }
    }
    for (let i = 0; i < curMails.length; i++) {
      if (reg.test(curMails[i])) {
        flag = true;
      }
    }
    if (!flag) {
      continue;
    }
    for (let i = 0; i < attrs.length; i++) {
      let curAttr = attrs[i];
      if (curAttr === 'почты') {
        for (let j = 0; j < curMails.length; j++) {
          ans = ans.concat(curMails[j]);
          if (j !== curMails.length - 1) {
            ans = ans.concat(',');
          }
        }
        if (i !== attrs.length - 1) {
          ans = ans.concat(';');
        }
      }

      if (curAttr === 'телефоны') {
        for (let j = 0; j < curPhones.length; j++) {
          let formatted = '+7 (' + curPhones[j][0] + curPhones[j][1] + curPhones[j][2] + ') ' +
            +curPhones[j][3] + curPhones[j][4] + curPhones[j][5] + '-' + curPhones[j][6] + curPhones[j][7] +
            '-' + curPhones[j][8] + curPhones[j][9];
          ans = ans.concat(formatted);
          if (j !== curPhones.length - 1) {
            ans = ans.concat(',');
          }
        }
        if (i !== attrs.length - 1) {
          ans = ans.concat(';');
        }
      }

      if (curAttr === 'имя') {
        ans = ans.concat(curName);
        if (i !== attrs.length - 1) {
          ans = ans.concat(';');
        }
      }
    }
    /*if (ans[ans.length - 1] === ';') {
      ans = ans.substr(0, ans.length - 1);
    }*/
    ansArr.push(ans);
  }
  return ansArr;
}

/**
 * Удали контакты, где есть <запрос>
 Ищет вхождение <запрос> хотя бы в один из телефонов, либо в одну из почт, либо в имя контакта
 Принимает <запрос> содержащий любые символы, кроме ;
 Удаляет все подходящие контакты
 Не удаляет ничего на пустой запрос (Удали контакты, где есть ;)
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function lookupAndDel(sub) {
  if (sub === '') {
    return;
  }
  sub = escapeRegExp(sub);
  let reg = new RegExp('^.*' + sub + '.*$');
  for (let [key, conts] of phoneBook) {
    let curName = key;
    let curPhones = conts.phones;
    let curMails = conts.mails;
    let flag = false;
    if (reg.test(curName)) {
      flag = true;
    }
    for (let i = 0; i < curPhones.length; i++) {
      if (reg.test(curPhones[i])) {
        flag = true;
      }
    }
    for (let i = 0; i < curMails.length; i++) {
      if (reg.test(curMails[i])) {
        flag = true;
      }
    }
    if (!flag) {
      continue;
    }
    del(curName);
  }
}

module.exports = { phoneBook, run };
