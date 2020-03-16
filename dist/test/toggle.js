"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
const prefix_1 = require("../source/prefix");
ava_1.default('menu correct', async (t) => {
    const menu = new source_1.default('yaay');
    menu.toggle('toggle me', 'c', {
        setFunc: async () => Promise.reject(new Error('Nothing has to be set when only showing the menu')),
        isSetFunc: () => true
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[{
                    text: prefix_1.emojiTrue + ' toggle me',
                    callback_data: 'a:c-false'
                }]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('isSetFunc falsy is like false', async (t) => {
    const menu = new source_1.default('yaay');
    menu.toggle('toggle me', 'c', {
        setFunc: async () => Promise.reject(new Error('Nothing has to be set when only showing the menu')),
        // Returning undefined is not possible from TypeScript but from JavaScript
        isSetFunc: () => undefined
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[{
                    text: prefix_1.emojiFalse + ' toggle me',
                    callback_data: 'a:c-true'
                }]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('hidden', async (t) => {
    const menu = new source_1.default('yaay');
    menu.toggle('toggle me', 'c', {
        hide: () => true,
        setFunc: async () => Promise.reject(new Error('When hidden other funcs shouldn\'t be called.')),
        isSetFunc: async () => Promise.reject(new Error('When hidden other funcs shouldn\'t be called.'))
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, []);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('toggles to true', async (t) => {
    const menu = new source_1.default('yaay');
    menu.toggle('toggle me', 'c', {
        setFunc: (_ctx, newState) => t.true(newState),
        isSetFunc: () => false
    });
    const bot = new telegraf_1.default('');
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => true;
    bot.use(menu.init({ actionCode: 'a' }));
    await bot.handleUpdate({ callback_query: { data: 'a:c-true' } });
});
ava_1.default('toggles to false', async (t) => {
    const menu = new source_1.default('yaay');
    menu.toggle('toggle me', 'c', {
        setFunc: (_ctx, newState) => t.false(newState),
        isSetFunc: () => true
    });
    const bot = new telegraf_1.default('');
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => true;
    bot.use(menu.init({ actionCode: 'a' }));
    await bot.handleUpdate({ callback_query: { data: 'a:c-false' } });
});
async function ownPrefixTest(t, currentState, prefix) {
    const menu = new source_1.default('yaay');
    menu.toggle('toggle me', 'c', {
        setFunc: () => t.fail(),
        isSetFunc: () => currentState,
        prefixTrue: '42',
        prefixFalse: '666'
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[{
                    text: `${prefix} toggle me`,
                    callback_data: `a:c-${!currentState}`
                }]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
}
ava_1.default('own true prefix', ownPrefixTest, true, '42');
ava_1.default('own false prefix', ownPrefixTest, false, '666');
//# sourceMappingURL=toggle.js.map