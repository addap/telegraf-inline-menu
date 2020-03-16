"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
const prefix_1 = require("../source/prefix");
ava_1.default('option array menu', async (t) => {
    const menu = new source_1.default('foo');
    menu.select('c', ['a', 'b'], {
        setFunc: () => t.fail()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: 'a',
                    callback_data: 'a:c-a'
                }, {
                    text: 'b',
                    callback_data: 'a:c-b'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('option object menu', async (t) => {
    const menu = new source_1.default('foo');
    menu.select('c', { a: 'A', b: 'B' }, {
        setFunc: () => t.fail()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: 'A',
                    callback_data: 'a:c-a'
                }, {
                    text: 'B',
                    callback_data: 'a:c-b'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('option async array menu', async (t) => {
    const menu = new source_1.default('foo');
    menu.select('c', async () => ['a', 'b'], {
        setFunc: () => t.fail()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: 'a',
                    callback_data: 'a:c-a'
                }, {
                    text: 'b',
                    callback_data: 'a:c-b'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('option array with textFunc', async (t) => {
    const menu = new source_1.default('foo');
    menu.select('c', ['a', 'b'], {
        textFunc: (_ctx, key) => key.toUpperCase(),
        setFunc: () => t.fail()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: 'A',
                    callback_data: 'a:c-a'
                }, {
                    text: 'B',
                    callback_data: 'a:c-b'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('selects', async (t) => {
    t.plan(2);
    const menu = new source_1.default('foo');
    menu.select('c', ['a', 'b'], {
        setFunc: (_ctx, selected) => t.is(selected, 'b')
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => {
        t.pass();
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c-b' } });
});
ava_1.default('selects numeric options', async (t) => {
    t.plan(2);
    const menu = new source_1.default('foo');
    menu.select('c', [3, 4], {
        setFunc: (_ctx, selected) => t.is(selected, '3')
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => {
        t.pass();
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c-3' } });
});
ava_1.default('selects from object', async (t) => {
    t.plan(2);
    const menu = new source_1.default('foo');
    menu.select('c', { a: 'A', b: 'B' }, {
        setFunc: (_ctx, selected) => t.is(selected, 'b')
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => {
        t.pass();
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c-b' } });
});
ava_1.default('selected key has emoji prefix', async (t) => {
    const menu = new source_1.default('foo');
    menu.select('c', ['a', 'b'], {
        setFunc: () => t.fail(),
        isSetFunc: async (_ctx, key) => key === 'b'
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: 'a',
                    callback_data: 'a:c-a'
                }, {
                    text: prefix_1.emojiTrue + ' b',
                    callback_data: 'a:c-b'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('multiselect has prefixes', async (t) => {
    const menu = new source_1.default('foo');
    menu.select('c', ['a', 'b'], {
        multiselect: true,
        setFunc: () => t.fail(),
        isSetFunc: async (_ctx, key) => key === 'b'
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: prefix_1.emojiFalse + ' a',
                    callback_data: 'a:c-a'
                }, {
                    text: prefix_1.emojiTrue + ' b',
                    callback_data: 'a:c-b'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('custom prefixFunc', async (t) => {
    const menu = new source_1.default('foo');
    menu.select('c', ['a', 'b'], {
        setFunc: () => t.fail(),
        prefixFunc: async () => 'bar'
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: 'bar a',
                    callback_data: 'a:c-a'
                }, {
                    text: 'bar b',
                    callback_data: 'a:c-b'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('custom prefix true/false', async (t) => {
    const menu = new source_1.default('foo');
    menu.select('c', ['a', 'b'], {
        setFunc: () => t.fail(),
        multiselect: true,
        prefixTrue: '🔔',
        prefixFalse: '🔕',
        isSetFunc: (_ctx, key) => key === 'a'
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: '🔔 a',
                    callback_data: 'a:c-a'
                }, {
                    text: '🔕 b',
                    callback_data: 'a:c-b'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('custom prefix true/false with textFunc', async (t) => {
    const menu = new source_1.default('foo');
    menu.select('c', ['a', 'b'], {
        setFunc: () => t.fail(),
        multiselect: true,
        prefixTrue: '🔔',
        prefixFalse: '🔕',
        textFunc: (_ctx, key) => key.toUpperCase(),
        isSetFunc: (_ctx, key) => key === 'a'
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: '🔔 A',
                    callback_data: 'a:c-a'
                }, {
                    text: '🔕 B',
                    callback_data: 'a:c-b'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('hides key in keyboard', async (t) => {
    t.plan(1);
    const menu = new source_1.default('foo');
    menu.select('c', ['a', 'b'], {
        setFunc: () => t.fail(),
        hide: (_ctx, key) => key === 'a'
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: 'b',
                    callback_data: 'a:c-b'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('hidden key can not be set', async (t) => {
    t.plan(2);
    const menu = new source_1.default('foo');
    menu.select('c', ['a', 'b'], {
        setFunc: () => t.fail(),
        hide: (_ctx, key) => key === 'a'
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => {
        t.pass();
        return true;
    };
    bot.use(() => t.pass());
    await bot.handleUpdate({ callback_query: { data: 'a:c-a' } });
});
ava_1.default('not existing key will not be set', async (t) => {
    t.plan(2);
    const menu = new source_1.default('foo');
    menu.select('c', () => ['b'], {
        setFunc: () => t.fail()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => {
        t.pass();
        return true;
    };
    bot.use(() => t.pass());
    await bot.handleUpdate({ callback_query: { data: 'a:c-a' } });
});
//# sourceMappingURL=select.js.map