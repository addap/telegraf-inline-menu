"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
ava_1.default.serial('setMenuNow menu is not modified', async (t) => {
    const menu = new source_1.default('yaay');
    menu.question('Question', 'c', {
        uniqueIdentifier: '666',
        questionText: 'what do you want?',
        setFunc: () => t.fail()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    const normalErrorFunc = console.error;
    const normalWarnFunc = console.warn;
    console.error = (error) => {
        t.log('maybe wrong error?', error);
        t.fail('should use console.warn');
    };
    console.warn = (arg1) => {
        t.regex(arg1, /menu is not modified/);
    };
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => {
        const error = new Error('400: Bad Request: message is not modified');
        error.description = 'Bad Request: message is not modified';
        throw error;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
    bot.context.editMessageText = async () => {
        const error = new Error('400: Bad Request: message is not modified: specified new message content and reply markup are exactly the same as a current content and reply_markup of the message');
        error.description = 'Bad Request: message is not modified: specified new message content and reply markup are exactly the same as a current content and reply_markup of the message';
        throw error;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
    console.warn = normalWarnFunc;
    console.error = normalErrorFunc;
});
ava_1.default.serial('setMenuNow other error', async (t) => {
    const menu = new source_1.default('yaay');
    menu.question('Question', 'c', {
        uniqueIdentifier: '666',
        questionText: 'what do you want?',
        setFunc: () => t.fail()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.catch((error) => {
        t.is(error.message, 'something different');
    });
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => {
        throw new Error('something different');
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
//# sourceMappingURL=internal.js.map