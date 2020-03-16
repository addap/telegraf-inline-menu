"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
async function macro(t, addButtonFunc, expectedKeyboard) {
    const menu = new source_1.default('yaay');
    addButtonFunc(menu);
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, expectedKeyboard);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
}
ava_1.default('urlButton', macro, (menu) => menu.urlButton('some url', 'https://edjopato.de'), [[{
            text: 'some url',
            url: 'https://edjopato.de'
        }]]);
ava_1.default('switchToChatButton', macro, (menu) => menu.switchToChatButton('do it', '42'), [[{
            text: 'do it',
            switch_inline_query: '42'
        }]]);
ava_1.default('switchToCurrentChatButton', macro, (menu) => menu.switchToCurrentChatButton('do it', '42'), [[{
            text: 'do it',
            switch_inline_query_current_chat: '42'
        }]]);
//# sourceMappingURL=passthrough-buttons.js.map