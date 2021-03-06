"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const pagination_1 = require("./pagination");
function keysCorrectMacro(t, totalPages, currentPage, expectedArr) {
    const result = pagination_1.paginationOptions(totalPages, currentPage);
    const keys = Object.keys(result).map(o => Number(o));
    t.deepEqual(keys, expectedArr);
}
ava_1.default('two pages on first page', keysCorrectMacro, 2, 1, [1, 2]);
ava_1.default('two pages on second page', keysCorrectMacro, 2, 1, [1, 2]);
ava_1.default('five pages on first page', keysCorrectMacro, 5, 1, [1, 2, 5]);
ava_1.default('five pages on second page', keysCorrectMacro, 5, 2, [1, 2, 3, 5]);
ava_1.default('five pages on third page', keysCorrectMacro, 5, 3, [1, 2, 3, 4, 5]);
ava_1.default('five pages on fourth page', keysCorrectMacro, 5, 4, [1, 3, 4, 5]);
ava_1.default('five pages on fifth page', keysCorrectMacro, 5, 5, [1, 4, 5]);
ava_1.default('go big', keysCorrectMacro, 200, 100, [1, 99, 100, 101, 200]);
ava_1.default('one page is ommited', keysCorrectMacro, 1, 1, []);
ava_1.default('NaN pages is ommited', keysCorrectMacro, NaN, 1, []);
ava_1.default('currentPage NaN is assumed 1', keysCorrectMacro, 2, NaN, [1, 2]);
ava_1.default('currentPage greater than totalPages is max page', keysCorrectMacro, 10, 15, [1, 9, 10]);
// When there are 19 items / 2 per page there are... 9.5 pages -> 10
ava_1.default('when totalPages is float use ceil', keysCorrectMacro, 9.5, 10, [1, 9, 10]);
ava_1.default('five pages all buttons', t => {
    const result = pagination_1.paginationOptions(5, 3);
    t.deepEqual(result, {
        1: '1 ⏪',
        2: '2 ◀️',
        3: '3',
        4: '▶️ 4',
        5: '⏩ 5'
    });
});
ava_1.default('three pages are with +/-1 buttons and not first/last buttons', t => {
    const result = pagination_1.paginationOptions(3, 2);
    t.deepEqual(result, {
        1: '1 ◀️',
        2: '2',
        3: '▶️ 3'
    });
});
//# sourceMappingURL=pagination.test.js.map