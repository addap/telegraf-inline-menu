"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
const _telegraf_typing_overrides_1 = require("./_telegraf-typing-overrides");
const menuKeyboard = [[{
            text: 'Question',
            callback_data: 'a:c'
        }]];
ava_1.default('menu correct', async (t) => {
    const menu = new source_1.default('yaay');
    menu.question('Question', 'c', {
        uniqueIdentifier: '666',
        questionText: 'what do you want?',
        setFunc: () => t.fail()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, menuKeyboard);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('sends question text', async (t) => {
    t.plan(4);
    const menu = new source_1.default('yaay');
    menu.question('Question', 'c', {
        uniqueIdentifier: '666',
        questionText: 'what do you want?',
        setFunc: () => t.fail()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => {
        t.pass();
        return true;
    };
    bot.context.editMessageText = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.deleteMessage = async () => {
        t.pass();
        return true;
    };
    bot.context.reply = async (text, extra) => {
        t.is(text, 'what do you want?[\u200C](http://t.me/#666)');
        t.deepEqual(extra.reply_markup, {
            force_reply: true
        });
        return _telegraf_typing_overrides_1.DUMMY_MESSAGE;
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c' } });
});
ava_1.default('setFunc on answer', async (t) => {
    t.plan(2);
    const menu = new source_1.default('yaay');
    menu.question('Question', 'c', {
        uniqueIdentifier: '666',
        questionText: 'what do you want?',
        setFunc: (_ctx, answer) => t.is(answer, 'more money')
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.editMessageText = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.reply = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, menuKeyboard);
        return _telegraf_typing_overrides_1.DUMMY_MESSAGE;
    };
    bot.use(ctx => {
        t.log('update not handled', ctx.update);
        t.fail('something not handled');
    });
    await bot.handleUpdate({ message: {
            reply_to_message: {
                text: 'what do you want?',
                entities: [{
                        type: 'text_link',
                        url: 'http://t.me/#666'
                    }]
            },
            text: 'more money'
        } });
});
ava_1.default('dont setFunc on wrong input text', async (t) => {
    t.plan(1);
    const menu = new source_1.default('yaay');
    menu.question('Question', 'c', {
        uniqueIdentifier: '666',
        questionText: 'what do you want?',
        setFunc: (_ctx, answer) => t.is(answer, 'more money')
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.editMessageText = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.reply = async () => Promise.reject(new Error('dont reply on wrong text'));
    bot.use(() => t.pass());
    await bot.handleUpdate({ message: {
            reply_to_message: {
                text: 'what do you do?'
            },
            text: 'more money'
        } });
});
ava_1.default('dont setFunc on hide', async (t) => {
    t.plan(1);
    const menu = new source_1.default('yaay');
    menu.question('Question', 'c', {
        uniqueIdentifier: '666',
        questionText: 'what do you want?',
        hide: () => true,
        setFunc: (_ctx, answer) => t.is(answer, 'more money')
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.editMessageText = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.reply = async () => Promise.reject(new Error('on hide nothing has to be replied'));
    bot.use(() => t.pass());
    await bot.handleUpdate({ message: {
            reply_to_message: {
                text: 'what do you want?'
            },
            text: 'more money'
        } });
});
ava_1.default('accepts other stuff than text', async (t) => {
    t.plan(2);
    const menu = new source_1.default('yaay');
    menu.question('Question', 'c', {
        uniqueIdentifier: '666',
        questionText: 'what do you want?',
        setFunc: (_ctx, answer) => t.is(answer, undefined)
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.editMessageText = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.reply = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, menuKeyboard);
        return _telegraf_typing_overrides_1.DUMMY_MESSAGE;
    };
    bot.use(ctx => {
        t.log('update not handled', ctx.update);
        t.fail('something not handled');
    });
    await bot.handleUpdate({ message: {
            reply_to_message: {
                text: 'what do you want?',
                entities: [{
                        type: 'text_link',
                        url: 'http://t.me/#666'
                    }]
            },
            photo: {},
            caption: '42'
        } });
});
ava_1.default('multiple question setFuncs do not interfere', async (t) => {
    t.plan(2);
    const menu = new source_1.default('yaay');
    menu.question('Question', 'c', {
        uniqueIdentifier: '21',
        questionText: 'what do you want to have?',
        setFunc: (_ctx, answer) => t.is(answer, 'more money')
    });
    menu.question('Question', 'd', {
        uniqueIdentifier: '42',
        questionText: 'what do you want to eat?',
        setFunc: (_ctx, answer) => t.is(answer, 'less meat')
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.editMessageText = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.reply = async () => _telegraf_typing_overrides_1.DUMMY_MESSAGE;
    bot.use(ctx => {
        t.log('update not handled', ctx.update);
        t.fail('something not handled');
    });
    await bot.handleUpdate({ message: {
            reply_to_message: {
                text: 'what do you want to have?',
                entities: [{
                        type: 'text_link',
                        url: 'http://t.me/#21'
                    }]
            },
            text: 'more money'
        } });
    await bot.handleUpdate({ message: {
            reply_to_message: {
                text: 'what do you want to eat?',
                entities: [{
                        type: 'text_link',
                        url: 'http://t.me/#42'
                    }]
            },
            text: 'less meat'
        } });
});
ava_1.default('does not trigger on unrelated message with formatting', async (t) => {
    t.plan(1);
    const menu = new source_1.default('yaay');
    menu.question('Question', 'c', {
        uniqueIdentifier: '666',
        questionText: 'what do you want to have?',
        setFunc: () => t.fail()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.editMessageText = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.reply = async () => _telegraf_typing_overrides_1.DUMMY_MESSAGE;
    bot.use(() => {
        t.pass();
    });
    await bot.handleUpdate({ message: {
            reply_to_message: {
                text: 'what do you want to have?',
                entities: [{
                        type: 'bold'
                    }]
            },
            text: 'more money'
        } });
});
ava_1.default('question button works on old menu', async (t) => {
    t.plan(2);
    const menu = new source_1.default('yaay');
    menu.question('Question', 'c', {
        uniqueIdentifier: '666',
        questionText: 'what do you want?',
        setFunc: () => t.fail()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.reply = async () => {
        t.pass();
        return _telegraf_typing_overrides_1.DUMMY_MESSAGE;
    };
    bot.context.deleteMessage = async () => {
        // Method is triggered but fails as the message is to old
        t.pass();
        throw new Error('Bad Request: message can\'t be deleted');
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c' } });
});
ava_1.default.serial('question button deleteMessage fail does not kill question', async (t) => {
    t.plan(3);
    const menu = new source_1.default('yaay');
    menu.question('Question', 'c', {
        uniqueIdentifier: '666',
        questionText: 'what do you want?',
        setFunc: () => t.fail()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.reply = async () => {
        t.pass();
        return _telegraf_typing_overrides_1.DUMMY_MESSAGE;
    };
    bot.context.deleteMessage = async () => {
        // Method is triggered but fails as the message is to old
        t.pass();
        throw new Error('something');
    };
    const normalErrorFunc = console.error;
    console.error = t.pass;
    await bot.handleUpdate({ callback_query: { data: 'a:c' } });
    console.error = normalErrorFunc;
});
//# sourceMappingURL=question.js.map