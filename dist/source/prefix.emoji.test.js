"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const prefix_1 = require("./prefix");
ava_1.default('no prefix', async (t) => {
    const result = await prefix_1.prefixEmoji('42', undefined);
    t.is(result, '42');
});
ava_1.default('value text & prefix truthy still passthrough', async (t) => {
    const result = await prefix_1.prefixEmoji('42', '6');
    t.is(result, '6 42');
});
ava_1.default('value text & prefix true', async (t) => {
    const result = await prefix_1.prefixEmoji('42', true);
    t.is(result, prefix_1.emojiTrue + ' 42');
});
ava_1.default('value text & prefix false', async (t) => {
    const result = await prefix_1.prefixEmoji('42', false);
    t.is(result, prefix_1.emojiFalse + ' 42');
});
ava_1.default('value text & prefix true hidden', async (t) => {
    const result = await prefix_1.prefixEmoji('42', true, { hideTrueEmoji: true });
    t.is(result, '42');
});
ava_1.default('value text & prefix false hidden', async (t) => {
    const result = await prefix_1.prefixEmoji('42', false, { hideFalseEmoji: true });
    t.is(result, '42');
});
ava_1.default('async prefix', async (t) => {
    const prefix = async () => true;
    const result = await prefix_1.prefixEmoji('42', prefix);
    t.is(result, prefix_1.emojiTrue + ' 42');
});
ava_1.default('async text and prefix', async (t) => {
    const text = async () => '42';
    const prefix = async () => true;
    const result = await prefix_1.prefixEmoji(text, prefix);
    t.is(result, prefix_1.emojiTrue + ' 42');
});
ava_1.default('own true prefix', async (t) => {
    const result = await prefix_1.prefixEmoji('42', true, {
        prefixTrue: 'foo'
    });
    t.is(result, 'foo 42');
});
ava_1.default('own false prefix', async (t) => {
    const result = await prefix_1.prefixEmoji('42', false, {
        prefixFalse: 'bar'
    });
    t.is(result, 'bar 42');
});
//# sourceMappingURL=prefix.emoji.test.js.map