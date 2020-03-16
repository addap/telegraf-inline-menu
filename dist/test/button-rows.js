"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
const button1 = {
    text: 'hit me',
    callback_data: 'a:c'
};
const button2 = {
    text: 'hit me hard',
    callback_data: 'a:d'
};
ava_1.default('just create without flags', async (t) => {
    const menu = new source_1.default('yaay')
        .manual('hit me', 'c')
        .manual('hit me hard', 'd');
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[button1], [button2]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('joinLastRow', async (t) => {
    const menu = new source_1.default('yaay')
        .manual('hit me', 'c')
        .manual('hit me hard', 'd', { joinLastRow: true });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[button1, button2]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('joinLastRow as first button', async (t) => {
    const menu = new source_1.default('yaay')
        .manual('hit me', 'c', { joinLastRow: true })
        .manual('hit me hard', 'd', { joinLastRow: true });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[button1, button2]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
//# sourceMappingURL=button-rows.js.map