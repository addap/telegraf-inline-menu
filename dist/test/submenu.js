"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
const menuKeyboard = [[{
            text: 'Submenu',
            callback_data: 'a:c'
        }]];
const baseInitOptions = {
    backButtonText: 'back…',
    mainMenuButtonText: 'main…'
};
ava_1.default('root menu correct', async (t) => {
    const menu = new source_1.default('foo');
    menu.submenu('Submenu', 'c', new source_1.default('bar'));
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, menuKeyboard);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('hidden submenu goes to the parent menu', async (t) => {
    const menu = new source_1.default('foo');
    menu.submenu('Submenu', 'c', new source_1.default('bar'), {
        hide: () => true
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (text, extra) => {
        t.is(text, 'foo');
        // As the submenu is hidden there are no buttons
        t.deepEqual(extra.reply_markup.inline_keyboard, []);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c' } });
});
ava_1.default('hidden submenu goes to the parent menu from the sub sub menu call', async (t) => {
    const menu = new source_1.default('foo');
    menu.submenu('Submenu', 'c', new source_1.default('bar'), {
        hide: () => true
    })
        .submenu('Subsubmenu', 'd', new source_1.default('42'));
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (text, extra) => {
        t.is(text, 'foo');
        // As the submenu is hidden there are no buttons
        t.deepEqual(extra.reply_markup.inline_keyboard, []);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c:d' } });
});
ava_1.default('hidden submenu before does not cancel not hidden button', async (t) => {
    t.plan(1);
    const menu = new source_1.default('foo');
    menu.submenu('foo', 'foo', new source_1.default('foo'))
        .submenu('bar', 'bar', new source_1.default('bar'), {
        hide: () => true
    });
    menu.simpleButton('test', 'test', {
        doFunc: () => {
            t.pass();
        }
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.editMessageText = async () => Promise.reject(new Error('simpleButton does not update the menu. The hidden submenu had'));
    await bot.handleUpdate({ callback_query: { data: 'a:test' } });
});
ava_1.default('hidden submenu question is lost', async (t) => {
    // It is not possible to know the parent menu of that hidden submenu as the question has no callbackQuery that would indicate that
    t.plan(1);
    const menu = new source_1.default('foo');
    menu.submenu('foo', 'foo', new source_1.default('foo'), {
        hide: () => true
    })
        .question('Question', 'q', {
        uniqueIdentifier: '666',
        questionText: 'bar',
        setFunc: () => t.fail()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.editMessageText = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.reply = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.use(() => {
        t.pass();
    });
    await bot.handleUpdate({ message: {
            reply_to_message: {
                text: 'bar'
            },
            text: 'fancy'
        } });
});
ava_1.default('submenu without back button', async (t) => {
    const menu = new source_1.default('foo');
    menu.submenu('Submenu', 'c', new source_1.default('bar'));
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, []);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c' } });
});
ava_1.default('submenu with back button', async (t) => {
    const menu = new source_1.default('foo');
    menu.submenu('Submenu', 'c', new source_1.default('bar'));
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ backButtonText: baseInitOptions.backButtonText, actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[{
                    text: 'back…',
                    callback_data: 'a'
                }]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c' } });
});
ava_1.default('submenu with main button', async (t) => {
    const menu = new source_1.default('foo');
    menu.submenu('Submenu', 'c', new source_1.default('bar'));
    const bot = new telegraf_1.default('');
    bot.use(menu.init(Object.assign({}, baseInitOptions)));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[{
                    text: 'main…',
                    callback_data: 'main'
                }]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'c' } });
});
ava_1.default('default init is main', async (t) => {
    t.plan(1);
    const menu = new source_1.default('foo');
    const bot = new telegraf_1.default('');
    bot.use(menu.init(Object.assign({}, baseInitOptions)));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async () => {
        t.pass();
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'main' } });
});
ava_1.default('setParentMenuAfter', async (t) => {
    t.plan(5);
    const menu = new source_1.default('foo');
    menu.submenu('submenu', 's', new source_1.default('bar'))
        .simpleButton('button', 'b', {
        setParentMenuAfter: true,
        doFunc: () => t.pass()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (text, extra) => {
        t.is(text, 'foo');
        t.deepEqual(extra.reply_markup.inline_keyboard, [[{
                    text: 'submenu',
                    callback_data: 'a:s'
                }]]);
        return true;
    };
    bot.use(ctx => {
        t.log(ctx.update);
        t.fail('update missed');
    });
    // +2
    await bot.handleUpdate({ callback_query: { data: 'a' } });
    // +2
    await bot.handleUpdate({ callback_query: { data: 'a:s:b' } });
});
ava_1.default('setParentMenuAfter when there is no parent fails', t => {
    const menu = new source_1.default('foo')
        .simpleButton('button', 'b', {
        setParentMenuAfter: true,
        doFunc: () => t.fail()
    });
    const bot = new telegraf_1.default('');
    t.throws(() => {
        bot.use(menu.init());
    }, /parent menu.+main/);
});
//# sourceMappingURL=submenu.js.map