"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const build_keyboard_1 = require("./build-keyboard");
ava_1.default('one row one key', async (t) => {
    const buttons = [[{
                text: '42',
                action: 'a'
            }]];
    const result = await build_keyboard_1.buildKeyboard(buttons, '', {});
    t.deepEqual(result.inline_keyboard, [
        [
            {
                text: '42',
                callback_data: 'a'
            }
        ]
    ]);
});
ava_1.default('four buttons in two rows', async (t) => {
    const buttons = [
        [{
                text: '42',
                action: 'a'
            }, {
                text: '43',
                action: 'b'
            }], [{
                text: '666',
                action: 'd'
            }, {
                text: '667',
                action: 'e'
            }]
    ];
    const result = await build_keyboard_1.buildKeyboard(buttons, '', {});
    t.deepEqual(result.inline_keyboard, [
        [
            {
                text: '42',
                callback_data: 'a'
            }, {
                text: '43',
                callback_data: 'b'
            }
        ], [
            {
                text: '666',
                callback_data: 'd'
            }, {
                text: '667',
                callback_data: 'e'
            }
        ]
    ]);
});
ava_1.default('row is func that creates one row with one button', async (t) => {
    const keyboardCreator = () => [[{
                text: '42',
                action: 'a'
            }]];
    const buttons = [
        keyboardCreator
    ];
    const result = await build_keyboard_1.buildKeyboard(buttons, '', {});
    t.deepEqual(result.inline_keyboard, [
        [
            {
                text: '42',
                callback_data: 'a'
            }
        ]
    ]);
});
//# sourceMappingURL=build-keyboard.test.js.map