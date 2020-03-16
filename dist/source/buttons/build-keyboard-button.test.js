"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const build_keyboard_button_1 = require("./build-keyboard-button");
ava_1.default('hide is questioned first and does not trigger other func', async (t) => {
    const result = await build_keyboard_button_1.buildKeyboardButton({
        text: () => {
            t.fail();
            return '';
        },
        action: 'a',
        hide: () => true
    }, '', {});
    t.is(result, undefined);
});
ava_1.default('async func possible', async (t) => {
    const result = await build_keyboard_button_1.buildKeyboardButton({
        text: async () => '42',
        action: 'a',
        hide: async () => false
    }, '', {});
    t.deepEqual(result, {
        text: '42',
        callback_data: 'a'
    });
});
ava_1.default('action', async (t) => {
    const result = await build_keyboard_button_1.buildKeyboardButton({
        text: '42',
        action: 'a'
    }, 'c', {});
    t.deepEqual(result, {
        text: '42',
        callback_data: 'c:a'
    });
});
ava_1.default('action method', async (t) => {
    const result = await build_keyboard_button_1.buildKeyboardButton({
        text: '42',
        action: () => 'a'
    }, 'c', {});
    t.deepEqual(result, {
        text: '42',
        callback_data: 'c:a'
    });
});
ava_1.default('action root', async (t) => {
    const result = await build_keyboard_button_1.buildKeyboardButton({
        text: '42',
        root: true,
        action: 'a'
    }, 'c', {});
    t.deepEqual(result, {
        text: '42',
        callback_data: 'a'
    });
});
ava_1.default('url', async (t) => {
    const result = await build_keyboard_button_1.buildKeyboardButton({
        text: '42',
        url: 'https://edjopato.de'
    }, 'main', {});
    t.deepEqual(result, {
        text: '42',
        url: 'https://edjopato.de'
    });
});
ava_1.default('url method', async (t) => {
    const result = await build_keyboard_button_1.buildKeyboardButton({
        text: '42',
        url: () => 'https://edjopato.de'
    }, 'main', {});
    t.deepEqual(result, {
        text: '42',
        url: 'https://edjopato.de'
    });
});
ava_1.default('switchToChat', async (t) => {
    const result = await build_keyboard_button_1.buildKeyboardButton({
        text: '42',
        switchToChat: '42'
    }, 'main', {});
    t.deepEqual(result, {
        text: '42',
        switch_inline_query: '42'
    });
});
ava_1.default('switchToChat method', async (t) => {
    const result = await build_keyboard_button_1.buildKeyboardButton({
        text: '42',
        switchToChat: () => '42'
    }, 'main', {});
    t.deepEqual(result, {
        text: '42',
        switch_inline_query: '42'
    });
});
ava_1.default('switchToCurrentChat', async (t) => {
    const result = await build_keyboard_button_1.buildKeyboardButton({
        text: '42',
        switchToCurrentChat: '42'
    }, 'main', {});
    t.deepEqual(result, {
        text: '42',
        switch_inline_query_current_chat: '42'
    });
});
ava_1.default('switchToCurrentChat method', async (t) => {
    const result = await build_keyboard_button_1.buildKeyboardButton({
        text: '42',
        switchToCurrentChat: () => '42'
    }, 'main', {});
    t.deepEqual(result, {
        text: '42',
        switch_inline_query_current_chat: '42'
    });
});
ava_1.default('unfinished button', async (t) => {
    await t.throwsAsync(async () => build_keyboard_button_1.buildKeyboardButton({
        text: '42'
    }, 'main', {}));
});
//# sourceMappingURL=build-keyboard-button.test.js.map