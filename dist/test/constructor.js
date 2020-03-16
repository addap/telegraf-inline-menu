"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
ava_1.default('simple text without buttons', async (t) => {
    const menu = new source_1.default('yaay');
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (text, extra) => {
        t.is(text, 'yaay');
        t.deepEqual(extra.reply_markup.inline_keyboard, []);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('main menu', async (t) => {
    const menu = new source_1.default('yaay');
    const bot = new telegraf_1.default('');
    bot.use(menu.init());
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (text, extra) => {
        t.is(text, 'yaay');
        t.deepEqual(extra.reply_markup.inline_keyboard, []);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'main' } });
});
ava_1.default('markdown text', async (t) => {
    const menu = new source_1.default('yaay');
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (text, extra) => {
        t.is(text, 'yaay');
        t.is(extra.parse_mode, 'Markdown');
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('async text func', async (t) => {
    const menu = new source_1.default(async () => 'yaay');
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (text) => {
        t.is(text, 'yaay');
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('menu.init requires action code to be at the base level', t => {
    const menu = new source_1.default('yaay');
    const bot = new telegraf_1.default('');
    t.throws(() => {
        bot.use(menu.init({ actionCode: 'a:b' }));
    }, /actioncode/i);
});
//# sourceMappingURL=constructor.js.map