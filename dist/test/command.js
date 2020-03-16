"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
const _telegraf_typing_overrides_1 = require("./_telegraf-typing-overrides");
function createTestBot(t, command) {
    const menu = new source_1.default('foo')
        .manual('bar', 'c');
    menu.setCommand(command);
    const bot = new telegraf_1.default('');
    bot.context.reply = async (text, extra) => {
        t.is(text, 'foo');
        t.deepEqual(extra.reply_markup.inline_keyboard, [[{
                    text: 'bar',
                    callback_data: 'a:c'
                }]]);
        return _telegraf_typing_overrides_1.DUMMY_MESSAGE;
    };
    bot.use(menu.init({ actionCode: 'a' }));
    return bot;
}
ava_1.default('one command', async (t) => {
    t.plan(2);
    const bot = createTestBot(t, 'test');
    bot.command('test', () => t.fail('command not handled'));
    bot.use(ctx => t.fail('update not handled: ' + JSON.stringify(ctx.update)));
    await bot.handleUpdate({ message: {
            text: '/test',
            entities: [{ type: 'bot_command', offset: 0, length: 5 }]
        } });
});
ava_1.default('multiple commands', async (t) => {
    t.plan(4);
    const bot = createTestBot(t, ['test1', 'test2']);
    bot.command(['test1', 'test2'], () => t.fail('command not handled'));
    bot.use(ctx => t.fail('update not handled: ' + JSON.stringify(ctx.update)));
    await bot.handleUpdate({ message: {
            text: '/test1',
            entities: [{ type: 'bot_command', offset: 0, length: 6 }]
        } });
    await bot.handleUpdate({ message: {
            text: '/test2',
            entities: [{ type: 'bot_command', offset: 0, length: 6 }]
        } });
});
ava_1.default('command can not be used on dynamic menu', t => {
    const menu = new source_1.default('foo');
    const submenu = menu.selectSubmenu('bar', [], new source_1.default('bar'));
    submenu.setCommand('test');
    const bot = new telegraf_1.default('');
    t.throws(() => {
        bot.use(menu.init());
    }, /command.+menu.+\/\^bar-.+\$\/.+test/);
});
//# sourceMappingURL=command.js.map