'use strict';

/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
    let aType = typeof a;
    let bType = typeof b;
    if (aType === "number" && bType === "number") {
        return a + b;
    }
    throw new TypeError("Expected 2 numbers");
}

/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
    if (typeof year !== "number") {
        throw new TypeError("Exprected the number")
    } else if (Number.isInteger(year) && year > 0) {
        //if (year % 100 == 0) {
        //    return year / 100 + 1;
        //}
        return Math.ceil(year / 100);
    } else {
        throw new RangeError("The number is expected to be positive and integer");
    }
}

/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
    //short version - all dublicates, 4 symbols
    //otherwise - 7;
    if (typeof hexColor !== "string") {
        throw new TypeError("Exprected the string");
    } else if (!hexColor.match(/^#[\A-Fa-f\d]{6}$/) && !hexColor.match(/^#[\A-Fa-f\d]{3}$/)) {
        throw new RangeError("Expected hex-form of color, out of range");
    } else if (hexColor.length === 4) {
        const ans = new Array(3);
        ans[0] = parseInt(hexColor[1].concat(hexColor[1]), 16);
        ans[1] = parseInt(hexColor[2].concat(hexColor[2]), 16);
        ans[2] = parseInt(hexColor[3].concat(hexColor[3]), 16);
        return `(${ans[0]}, ${ans[1]}, ${ans[2]})`;
    }
    const ans = new Array(3);
    ans[0] = parseInt(hexColor[1].concat(hexColor[2]), 16);
    ans[1] = parseInt(hexColor[3].concat(hexColor[4]), 16);
    ans[2] = parseInt(hexColor[5].concat(hexColor[6]), 16);
    return `(${ans[0]}, ${ans[1]}, ${ans[2]})`;
}

/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
    if (typeof n === "number") {
        if (Number.isInteger(n) && n > 0) {
            let a = 0;
            let b = 1;
            let ab;
            for (let i = 1; i <= n; i++) {
                ab = a + b;
                a = b;
                b = ab;
            }
            return a;
        } else {
            throw new RangeError("The number is expected to be positive and integer");
        }
    } else {
        throw new TypeError("Expected the number");
    }
}

/**
 * Транспонирует матрицу;;
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
    if (!Array.isArray(matrix)){
        throw new TypeError("Expected the array");
    }
    const n = matrix.length;
    if (n === 0){
        throw new TypeError("Expected non-empty array");
    }
    const m = matrix[0].length;
    for (let i = 0; i < n; i++){
        if (!Array.isArray(matrix[i])){
            throw new TypeError("Expected the two-dim array");
        }
        if (m !== matrix[i].length){
            throw new TypeError("Expected the array with size NxM");
        }
    }
    const matrixT = [];
    for (let i = 0; i < m; i++){
        matrixT.push([]);
        for (let j = 0; j < n; j++){
            matrixT[i].push(matrix[j][i]);
        }
    }
    return matrixT;
}

/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, base) {
    if (typeof n === "number" &&  typeof  base === "number" && Number.isInteger(base)){
        if (base >= 2 && base <= 36){
            return n.toString(base);
        } else {
            throw new RangeError("Too low or too big base to convert")
        }
    } else {
        throw new TypeError("Expected two numbers, base must be integer")
    }
}

/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
    if (typeof phoneNumber !== "string") {
        throw new TypeError("Exprected the string");
    }
    return (/^8-800-\d\d\d-\d\d-\d\d$/).test(phoneNumber);
}

/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
    if (typeof text === "string"){
        let ans = text.match(/:-\)|\(-:/g)
        if (ans === null){
            return 0;
        } else {
            return ans.length;
        }
    } else {
        throw new TypeError("Exprected the string");
    }
}

/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
    let n = field.length;
    //lines
    if (field.some(line => line.every(elem => elem === "x"))){
        return "x"
    }
    if (field.some(line => line.every(elem => elem === "o"))){
        return "o"
    }
    //cols
    let fieldT = []
    for (let i = 0; i < n; i++){
        fieldT.push([]);
        for (let j = 0; j < n; j++){
            fieldT[i].push(field[j][i]);
        }
    }
    if (fieldT.some(line => line.every(elem => elem === "x"))){
        return "x";
    }
    if (fieldT.some(line => line.every(elem => elem === "o"))){
        return "o";
    }
    //diags
    let diag1 = [field[0][0], field[1][1], field[2][2]];
    let diag2 = [field[0][2], field[1][1], field[2][0]];
    if (diag1.every(elem => elem === "x")){
        return "x";
    }
    if (diag1.every(elem => elem === "o")){
        return "o";
    }
    if (diag2.every(elem => elem === "x")){
        return "x";
    }
    if (diag2.every(elem => elem === "o")){
        return "o";
    }
    return "draw"
}

module.exports = {
    abProblem, //done
    centuryByYearProblem, //done
    colorsProblem, //done
    fibonacciProblem, //done
    matrixProblem, //done
    numberSystemProblem, //done
    phoneProblem, //done
    smilesProblem, //done
    ticTacToeProblem //done
};