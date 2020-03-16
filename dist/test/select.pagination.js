"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
ava_1.default('page 1', async (t) => {
    const menu = new source_1.default('foo');
    menu.select('c', ['a', 'b', 'c'], {
        setFunc: () => t.fail(),
        setPage: () => { },
        getCurrentPage: () => 1,
        columns: 2,
        maxRows: 1
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [
            [
                {
                    text: 'a',
                    callback_data: 'a:c-a'
                }, {
                    text: 'b',
                    callback_data: 'a:c-b'
                }
            ], [
                {
                    text: '1',
                    callback_data: 'a:cPage-1'
                },
                {
                    text: '▶️ 2',
                    callback_data: 'a:cPage-2'
                }
            ]
        ]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('page 2', async (t) => {
    const menu = new source_1.default('foo');
    menu.select('c', ['a', 'b', 'c'], {
        setFunc: () => t.fail(),
        setPage: () => { },
        getCurrentPage: () => 2,
        columns: 2,
        maxRows: 1
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.context.answerCbQuery = async () => true;
    bot.context.editMessageText = async (_text, extra) => {
        t.deepEqual(extra.reply_markup.inline_keyboard, [
            [
                {
                    text: 'c',
                    callback_data: 'a:c-c'
                }
            ], [
                {
                    text: '1 ◀️',
                    callback_data: 'a:cPage-1'
                },
                {
                    text: '2',
                    callback_data: 'a:cPage-2'
                }
            ]
        ]);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('require setPage and getCurrentPage', t => {
    const menu = new source_1.default('foo');
    t.throws(() => {
        menu.select('c', ['a', 'b'], {
            setFunc: () => { },
            setPage: () => { }
        });
    }, /pagination/);
});
//# sourceMappingURL=select.pagination.js.map