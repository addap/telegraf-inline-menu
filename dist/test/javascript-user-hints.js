"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
// These errors are intended for JavaScript users to hint wrong usage on startup and not on runtime.
// TypeScript types are preventing these.
ava_1.default('menu.middleware fails with .init() hint', t => {
    const menu = new source_1.default('yaay');
    const bot = new telegraf_1.default('');
    // Normally user would use bot.use.
    // But telegraf will later use .middleware() on it. in order to check this faster, trigger this directly
    t.throws(() => bot.use(menu.middleware()), /bot\.use\(menu\.init/);
});
// Buttons
ava_1.default('simpleButton require additionalArgs', t => {
    const menu = new source_1.default('yaay');
    t.throws(() => {
        menu.simpleButton('toggle me', 'c');
    }, /Cannot.+undefined/);
});
ava_1.default('button require additionalArgs', t => {
    const menu = new source_1.default('yaay');
    t.throws(() => {
        menu.button('toggle me', 'c');
    }, /Cannot.+undefined/);
});
ava_1.default('simpleButton require doFunc', t => {
    const menu = new source_1.default('yaay');
    t.throws(() => {
        menu.simpleButton('toggle me', 'c', {});
    }, /doFunc/);
});
// Question
ava_1.default('question require setFunc', t => {
    const menu = new source_1.default('yaay');
    t.throws(() => {
        menu.question('Question', 'c', {
            uniqueIdentifier: '666',
            questionText: 'what do you want?'
        });
    }, /setFunc/);
});
ava_1.default('question require questionText', t => {
    const menu = new source_1.default('yaay');
    t.throws(() => {
        menu.question('Question', 'c', {
            setFunc: t.fail,
            uniqueIdentifier: '666'
        });
    }, /questionText/);
});
ava_1.default('question require uniqueIdentifier', t => {
    const menu = new source_1.default('yaay');
    t.throws(() => {
        menu.question('Question', 'c', {
            setFunc: t.fail,
            questionText: 'what do you want?'
        });
    }, /uniqueIdentifier/);
});
// Select
ava_1.default('select require additionalArgs', t => {
    const menu = new source_1.default('foo');
    t.throws(() => {
        menu.select('c', ['a', 'b']);
    }, /Cannot.+undefined/);
});
ava_1.default('select option submenu is no more', t => {
    const menu = new source_1.default('foo');
    t.throws(() => {
        menu.select('c', ['a', 'b'], {
            submenu: new source_1.default('bar')
        });
    }, /selectSubmenu/);
});
// Toggle
ava_1.default('toggle require setFunc', t => {
    const menu = new source_1.default('yaay');
    t.throws(() => {
        menu.toggle('toggle me', 'c', {
            isSetFunc: t.fail
        });
    }, /setFunc/);
});
ava_1.default('toggle require isSetFunc', t => {
    const menu = new source_1.default('yaay');
    t.throws(() => {
        menu.toggle('toggle me', 'c', {
            setFunc: t.fail
        });
    }, /isSetFunc/);
});
//# sourceMappingURL=javascript-user-hints.js.map