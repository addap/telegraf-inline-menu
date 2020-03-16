"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
const _telegraf_typing_overrides_1 = require("./_telegraf-typing-overrides");
ava_1.default('middleware works', async (t) => {
    t.plan(2);
    const menu = new source_1.default('42');
    const bot = new telegraf_1.default('');
    bot.on('message', menu.replyMenuMiddleware().middleware());
    bot.use(menu.init({ actionCode: 'a' }));
    bot.use(ctx => {
        t.log('update missed', ctx.update);
        t.fail('update missed');
    });
    bot.context.editMessageText = async () => Promise.reject(new Error('There shouldn\t be any message edited'));
    bot.context.reply = async (text, extra) => {
        t.is(text, '42');
        t.deepEqual(extra.reply_markup.inline_keyboard, []);
        return _telegraf_typing_overrides_1.DUMMY_MESSAGE;
    };
    await bot.handleUpdate({ message: { text: 'yaay' } });
});
ava_1.default('correct actionCode in menu buttons', async (t) => {
    const menu = new source_1.default('42')
        .manual('foo', 'bar');
    const bot = new telegraf_1.default('');
    bot.on('message', menu.replyMenuMiddleware().middleware());
    bot.use(menu.init({ actionCode: 'a' }));
    bot.use(ctx => {
        t.log('update missed', ctx.update);
        t.fail('update missed');
    });
    bot.context.editMessageText = async () => Promise.reject(new Error('There shouldn\t be any message edited'));
    bot.context.reply = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [[{
                    text: 'foo',
                    callback_data: 'a:bar'
                }]]);
        return _telegraf_typing_overrides_1.DUMMY_MESSAGE;
    };
    await bot.handleUpdate({ message: { text: 'yaay' } });
});
ava_1.default('works with specific ActionCode', async (t) => {
    t.plan(2);
    const menu = new source_1.default('foo');
    const submenu = new source_1.default((ctx) => `bar ${ctx.match[1]}`);
    menu.selectSubmenu('b', ['y', 'z'], submenu);
    const replyMenuMiddleware = submenu.replyMenuMiddleware();
    const bot = new telegraf_1.default('');
    bot.on('message', async (ctx) => replyMenuMiddleware.setSpecific(ctx, 'a:b-z'));
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.reply = async (text, extra) => {
        t.is(text, 'bar z');
        t.deepEqual(extra.reply_markup.inline_keyboard, []);
        return _telegraf_typing_overrides_1.DUMMY_MESSAGE;
    };
    await bot.handleUpdate({ message: { text: '42' } });
});
ava_1.default('fails with different ActionCode than menu expects', async (t) => {
    const menu = new source_1.default('foo');
    const submenu = new source_1.default((ctx) => `bar ${ctx.match[1]}`);
    menu.selectSubmenu('b', ['y', 'z'], submenu);
    const replyMenuMiddleware = submenu.replyMenuMiddleware();
    const bot = new telegraf_1.default('');
    bot.on('message', async (ctx) => replyMenuMiddleware.setSpecific(ctx, 'b:c'));
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.reply = async (text, extra) => {
        t.is(text, 'bar z');
        t.deepEqual(extra.reply_markup.inline_keyboard, []);
        return _telegraf_typing_overrides_1.DUMMY_MESSAGE;
    };
    bot.catch((error) => t.regex(error.message, /actionCode.+b:c/));
    await bot.handleUpdate({ message: { text: '42' } });
});
ava_1.default('fails in dynamic menu without specific ActionCode', async (t) => {
    const menu = new source_1.default('foo');
    const submenu = new source_1.default('bar');
    menu.selectSubmenu('b', ['y', 'z'], submenu);
    const replyMenuMiddleware = submenu.replyMenuMiddleware();
    const bot = new telegraf_1.default('');
    bot.on('message', replyMenuMiddleware.middleware());
    bot.use(menu.init({ actionCode: 'a' }));
    bot.catch((error) => {
        t.regex(error.message, /dynamic.+action/);
    });
    await bot.handleUpdate({ message: { text: '42' } });
});
ava_1.default('fails before init', async (t) => {
    const menu = new source_1.default('foo');
    const submenu = new source_1.default('bar');
    menu.selectSubmenu('b', ['y', 'z'], submenu);
    const replyMenuMiddleware = submenu.replyMenuMiddleware();
    const handler = replyMenuMiddleware.middleware();
    await t.throwsAsync(async () => handler({}, () => null), /menu.init/);
});
ava_1.default('does not work with menu on multiple positions', t => {
    const menu = new source_1.default('foo');
    const submenu = new source_1.default('bar');
    menu.submenu('x', 'x', submenu);
    menu.submenu('y', 'y', submenu);
    const bot = new telegraf_1.default('');
    bot.on('message', submenu.replyMenuMiddleware().middleware());
    t.throws(() => {
        bot.use(menu.init({ actionCode: 'a' }));
    }, /replyMenuMiddleware does not work on a menu that is reachable on multiple different ways/);
});
//# sourceMappingURL=reply-menu-middleware.js.map