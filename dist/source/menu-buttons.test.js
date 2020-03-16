"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const menu_buttons_1 = require("./menu-buttons");
function generateBasicOptions(logger, overrides = {}) {
    return Object.assign({ hasMainMenu: false, depth: 1, log: logger }, overrides);
}
const EXAMPLE_BUTTON = {
    text: '42',
    action: '42'
};
const EXAMPLE_BUTTON_RESULT = {
    text: '42',
    callback_data: '42'
};
ava_1.default('nothing added', async (t) => {
    const menu = new menu_buttons_1.default();
    const result = await menu.generateKeyboardMarkup({}, 'main', generateBasicOptions(t.log));
    t.deepEqual(result.inline_keyboard, []);
});
ava_1.default('one Button added', async (t) => {
    const menu = new menu_buttons_1.default();
    menu.add(EXAMPLE_BUTTON);
    const result = await menu.generateKeyboardMarkup({}, 'main', generateBasicOptions(t.log));
    t.deepEqual(result.inline_keyboard, [
        [
            EXAMPLE_BUTTON_RESULT
        ]
    ]);
});
ava_1.default('add first Button to not existing last row', async (t) => {
    const menu = new menu_buttons_1.default();
    menu.add(EXAMPLE_BUTTON, false);
    const result = await menu.generateKeyboardMarkup({}, 'main', generateBasicOptions(t.log));
    t.deepEqual(result.inline_keyboard, [
        [
            EXAMPLE_BUTTON_RESULT
        ]
    ]);
});
ava_1.default('one creator added', async (t) => {
    const menu = new menu_buttons_1.default();
    menu.addCreator(() => [[EXAMPLE_BUTTON]]);
    const result = await menu.generateKeyboardMarkup({}, 'main', generateBasicOptions(t.log));
    t.deepEqual(result.inline_keyboard, [
        [
            EXAMPLE_BUTTON_RESULT
        ]
    ]);
});
ava_1.default('button in same row as creator ends up as two rows', async (t) => {
    const menu = new menu_buttons_1.default();
    menu.addCreator(() => [[EXAMPLE_BUTTON]]);
    menu.add(EXAMPLE_BUTTON, false);
    const result = await menu.generateKeyboardMarkup({}, 'main', generateBasicOptions(t.log));
    t.deepEqual(result.inline_keyboard, [
        [
            EXAMPLE_BUTTON_RESULT
        ],
        [
            EXAMPLE_BUTTON_RESULT
        ]
    ]);
});
//# sourceMappingURL=menu-buttons.test.js.map