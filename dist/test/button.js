"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
const menuKeyboard = [[{
            text: 'hit me',
            callback_data: 'a:c'
        }]];
ava_1.default('manual menu correct', async (t) => {
    const menu = new source_1.default('yaay');
    menu.manual('hit me', 'c');
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, menuKeyboard);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('simpleButton works', async (t) => {
    const menu = new source_1.default('yaay');
    menu.simpleButton('hit me', 'c', {
        doFunc: () => t.pass()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    // This could also be argumented to be a pass as the button was pressed.
    // But as there is nothing for the menu to do, the user should send the answer on its own.
    bot.context.answerCbQuery = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.editMessageText = async () => Promise.reject(new Error('This method should not be called here!'));
    await bot.handleUpdate({ callback_query: { data: 'a:c' } });
});
ava_1.default('button updates menu', async (t) => {
    t.plan(2);
    const menu = new source_1.default('yaay');
    menu.button('hit me', 'c', {
        doFunc: () => t.pass()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, menuKeyboard);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c' } });
});
ava_1.default('hidden button does not run doFunc', async (t) => {
    t.plan(1);
    const menu = new source_1.default('yaay');
    menu.simpleButton('hit me', 'c', {
        doFunc: () => t.fail(),
        hide: async () => {
            t.pass();
            return true;
        }
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.editMessageText = async () => Promise.reject(new Error('This method should not be called here!'));
    await bot.handleUpdate({ callback_query: { data: 'a:c' } });
});
ava_1.default('hidden button updates the menu', async (t) => {
    t.plan(1);
    const menu = new source_1.default('yaay');
    menu.button('hit me', 'c', {
        doFunc: () => t.fail(),
        hide: () => true
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (text) => {
        t.is(text, 'yaay');
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c' } });
});
//# sourceMappingURL=button.js.map