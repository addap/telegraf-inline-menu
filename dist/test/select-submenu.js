"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
function generateTestBasics() {
    const menu = new source_1.default('foo');
    const submenu = new source_1.default((ctx) => ctx.match[1])
        .simpleButton((ctx) => `Hit ${ctx.match[1]}!`, 'd', {
        doFunc: async (ctx) => ctx.answerCbQuery(`${ctx.match[1]} was hit!`)
    });
    menu.selectSubmenu('c', ['a', 'b'], submenu);
    const bot = new telegraf_1.default('');
    bot.use(menu.init({
        backButtonText: 'back',
        actionCode: 'a'
    }));
    return bot;
}
ava_1.default('upper menu correct', async (t) => {
    const bot = generateTestBasics();
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
ava_1.default('submenu correct', async (t) => {
    const bot = generateTestBasics();
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: 'Hit a!',
                    callback_data: 'a:c-a:d'
                }
            ], [
                {
                    text: 'back',
                    callback_data: 'a'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c-a' } });
});
ava_1.default('submenu button works', async (t) => {
    const bot = generateTestBasics();
    bot.context.editMessageText = async () => Promise.reject(new Error('This method should not be called here!'));
    bot.context.answerCbQuery = async (text) => {
        t.is(text, 'a was hit!');
        return true;
    };
    bot.use(() => t.fail());
    await bot.handleUpdate({ callback_query: { data: 'a:c-a:d' } });
});
ava_1.default('hide submenu ends up in parent menu', async (t) => {
    t.plan(2);
    const menu = new source_1.default('foo')
        .manual('foo', 'bar');
    const submenu = new source_1.default((ctx) => ctx.match[1])
        .simpleButton((ctx) => `Hit ${ctx.match[1]}!`, 'd', {
        doFunc: async (ctx) => ctx.answerCbQuery(`${ctx.match[1]} was hit!`)
    });
    menu.selectSubmenu('c', ['a', 'b'], submenu, {
        hide: () => true
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({
        backButtonText: 'back',
        actionCode: 'a'
    }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: 'foo',
                    callback_data: 'a:bar'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c-a' } });
    await bot.handleUpdate({ callback_query: { data: 'a:c-a:d' } });
});
ava_1.default('something that is not an action in dynamic menu throws error', t => {
    const menu = new source_1.default('foo');
    const submenu = new source_1.default('bar')
        .question('Question', 'q', {
        uniqueIdentifier: '666',
        questionText: '42',
        setFunc: () => { }
    });
    menu.selectSubmenu('a', ['a', 'b'], submenu);
    const bot = new telegraf_1.default('');
    t.throws(() => {
        bot.use(menu.init());
    }, /dynamic.+question.+menu.+a/);
});
ava_1.default('function as backButtonText is possible', async (t) => {
    const menu = new source_1.default('foo');
    const submenu = new source_1.default((ctx) => ctx.match[1]);
    menu.selectSubmenu('c', ['a', 'b'], submenu);
    const bot = new telegraf_1.default('');
    bot.use(menu.init({
        backButtonText: () => 'back',
        mainMenuButtonText: () => 'main menu',
        actionCode: 'a'
    }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: 'back',
                    callback_data: 'a'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c-a' } });
});
ava_1.default('button in submenu results in correct menu', async (t) => {
    t.plan(2);
    const menu = new source_1.default('foo');
    const submenu = new source_1.default((ctx) => ctx.match[1]);
    menu.selectSubmenu('c', ['a', 'b'], submenu);
    submenu.button('Hit a!', 'd', {
        doFunc: () => t.pass()
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({
        backButtonText: () => 'back',
        mainMenuButtonText: () => 'main menu',
        actionCode: 'a'
    }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[
                {
                    text: 'Hit a!',
                    callback_data: 'a:c-a:d'
                }
            ], [
                {
                    text: 'back',
                    callback_data: 'a'
                }
            ]]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a:c-a:d' } });
});
//# sourceMappingURL=select-submenu.js.map