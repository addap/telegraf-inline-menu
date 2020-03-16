"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const align_1 = require("./align");
function generateCharArray(charA, charZ) {
    // https://stackoverflow.com/questions/24597634/how-to-generate-an-array-of-alphabet-in-jquery/24597663#24597663
    const a = [];
    let i = charA.charCodeAt(0);
    const j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
}
const inputData = generateCharArray('A', 'E');
ava_1.default('without arg in one line', t => {
    const result = align_1.getRowsOfButtons(generateCharArray('A', 'E'));
    t.deepEqual(result, [
        inputData
    ]);
});
ava_1.default('without buttons', t => {
    const result = align_1.getRowsOfButtons([]);
    t.deepEqual(result, []);
});
ava_1.default('less columns that buttons', t => {
    const result = align_1.getRowsOfButtons(generateCharArray('A', 'E'), 3);
    t.deepEqual(result, [
        ['A', 'B', 'C'],
        ['D', 'E']
    ]);
});
ava_1.default('trim by maxRows', t => {
    const result = align_1.getRowsOfButtons(generateCharArray('A', 'Z'), 1, 5);
    t.deepEqual(result, [
        ['A'],
        ['B'],
        ['C'],
        ['D'],
        ['E']
    ]);
});
ava_1.default('second page', t => {
    const result = align_1.getRowsOfButtons(generateCharArray('A', 'Z'), 1, 3, 2);
    t.deepEqual(result, [
        ['D'],
        ['E'],
        ['F']
    ]);
});
ava_1.default('partial last page', t => {
    const result = align_1.getRowsOfButtons(generateCharArray('A', 'E'), 1, 3, 2);
    t.deepEqual(result, [
        ['D'],
        ['E']
    ]);
});
ava_1.default('last possible page instead of wanted', t => {
    const result = align_1.getRowsOfButtons(generateCharArray('A', 'F'), 1, 3, 3);
    t.deepEqual(result, [
        ['D'],
        ['E'],
        ['F']
    ]);
});
ava_1.default('maximumButtonsPerPage example', t => {
    t.is(align_1.maximumButtonsPerPage(2, 3), 6);
    t.is(align_1.maximumButtonsPerPage(4, 4), 16);
});
ava_1.default('maximumButtonsPerPage default', t => {
    t.is(align_1.maximumButtonsPerPage(), 60);
});
//# sourceMappingURL=align.test.js.map