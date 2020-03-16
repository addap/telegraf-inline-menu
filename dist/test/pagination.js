"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
ava_1.default('creates menu', async (t) => {
    const menu = new source_1.default('foo');
    menu.pagination('c', {
        setPage: () => t.fail(),
        getCurrentPage: () => 1,
        getTotalPages: () => 2
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: '1',
                    callback_data: 'a:c-1'
                }, {
                    text: '▶️ 2',
                    callback_data: 'a:c-2'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('no pagination with 1 page', async (t) => {
    const menu = new source_1.default('foo');
    menu.pagination('c', {
        setPage: () => t.fail(),
        getCurrentPage: () => 1,
        getTotalPages: () => 1
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
ava_1.default('creates menu with async methods', async (t) => {
    const menu = new source_1.default('foo');
    menu.pagination('c', {
        setPage: () => t.fail(),
        getCurrentPage: async () => 1,
        getTotalPages: async () => 2
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: '1',
                    callback_data: 'a:c-1'
                }, {
                    text: '▶️ 2',
                    callback_data: 'a:c-2'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('creates menu with current page undefined', async (t) => {
    const menu = new source_1.default('foo');
    menu.pagination('c', {
        setPage: () => t.fail(),
        getCurrentPage: () => undefined,
        getTotalPages: () => 2
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: '1',
                    callback_data: 'a:c-1'
                }, {
                    text: '▶️ 2',
                    callback_data: 'a:c-2'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('sets page', async (t) => {
    t.plan(1);
    const menu = new source_1.default('foo');
    menu.pagination('c', {
        setPage: async (_ctx, page) => t.is(page, 2),
        getCurrentPage: () => 1,
        getTotalPages: () => 2
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => true;
    await bot.handleUpdate({ callback_query: { data: 'a:c-2' } });
});
ava_1.default('sets page not outside of range', async (t) => {
    t.plan(2);
    const menu = new source_1.default('foo');
    menu.pagination('c', {
        setPage: async (_ctx, page) => t.true(page >= 1 && page <= 2),
        getCurrentPage: () => 1,
        getTotalPages: () => 2
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => true;
    await bot.handleUpdate({ callback_query: { data: 'a:c-0' } });
    await bot.handleUpdate({ callback_query: { data: 'a:c-3' } });
});
ava_1.default('sets page 2 when maxPage is 1.5', async (t) => {
    const menu = new source_1.default('foo');
    menu.pagination('c', {
        setPage: async (_ctx, page) => t.is(page, 2),
        getCurrentPage: () => 1,
        getTotalPages: () => 1.5 // 3 elements with 2 per page -> 1.5 pages -> ceil 2 pages required
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => true;
    await bot.handleUpdate({ callback_query: { data: 'a:c-2' } });
});
ava_1.default('sets page 1 when input is bad', async (t) => {
    t.plan(1);
    const menu = new source_1.default('foo');
    menu.pagination('c', {
        setPage: async (_ctx, page) => t.is(page, 1),
        getCurrentPage: () => NaN,
        getTotalPages: () => NaN
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => true;
    await bot.handleUpdate({ callback_query: { data: 'a:c-5' } });
});
ava_1.default('hidden pagination', async (t) => {
    const menu = new source_1.default('foo');
    menu.pagination('c', {
        hide: () => true,
        setPage: () => t.fail(),
        getCurrentPage: async () => Promise.reject(new Error('dont call getCurrentPage when hidden')),
        getTotalPages: async () => Promise.reject(new Error('dont call getTotalPages when hidden'))
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
//# sourceMappingURL=pagination.js.map