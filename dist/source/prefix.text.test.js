"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const prefix_1 = require("./prefix");
ava_1.default('no prefix', async (t) => {
    const result = await prefix_1.prefixText('42', undefined);
    t.is(result, '42');
});
ava_1.default('value text & prefix', async (t) => {
    const result = await prefix_1.prefixText('42', '6');
    t.is(result, '6 42');
});
ava_1.default('async text', async (t) => {
    const text = async () => '42';
    const result = await prefix_1.prefixText(text, undefined);
    t.is(result, '42');
});
ava_1.default('async prefix', async (t) => {
    const prefix = async () => '6';
    const result = await prefix_1.prefixText('42', prefix);
    t.is(result, '6 42');
});
ava_1.default('async text and prefix', async (t) => {
    const text = async () => '42';
    const prefix = async () => '6';
    const result = await prefix_1.prefixText(text, prefix);
    t.is(result, '6 42');
});
//# sourceMappingURL=prefix.text.test.js.map