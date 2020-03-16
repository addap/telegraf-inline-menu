"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const action_code_1 = require("./action-code");
const middleware_helper_1 = require("./middleware-helper");
ava_1.default('correct callbackQuery', async (t) => {
    const bot = new telegraf_1.default('');
    bot.use(async (ctx) => {
        const middleware = middleware_helper_1.isCallbackQueryActionFunc(new action_code_1.default('a:b'));
        t.true(await middleware(ctx));
    });
    await bot.handleUpdate({ callback_query: { data: 'a:b' } });
});
ava_1.default('wrong callbackQuery', async (t) => {
    const bot = new telegraf_1.default('');
    bot.use(async (ctx) => {
        const middleware = middleware_helper_1.isCallbackQueryActionFunc(new action_code_1.default('a:b'));
        t.false(await middleware(ctx));
    });
    await bot.handleUpdate({ callback_query: { data: 'a:c' } });
});
ava_1.default('no callbackQuery', async (t) => {
    const bot = new telegraf_1.default('');
    bot.use(async (ctx) => {
        const middleware = middleware_helper_1.isCallbackQueryActionFunc(new action_code_1.default('a:b'));
        t.false(await middleware(ctx));
    });
    await bot.handleUpdate({ message: {} });
});
//# sourceMappingURL=middleware-helper.is-action.test.js.map