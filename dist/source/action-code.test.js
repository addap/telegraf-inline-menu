"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const action_code_1 = require("./action-code");
ava_1.default('constructor', t => {
    t.is(new action_code_1.default('main').get(), 'main');
    t.is(new action_code_1.default('').get(), 'main');
    t.is(new action_code_1.default('a').get(), 'a');
    t.is(new action_code_1.default('a:b').get(), 'a:b');
});
ava_1.default('parent', t => {
    t.is(new action_code_1.default('a:b').parent().get(), 'a');
    t.is(new action_code_1.default('a:b:c:d').parent().get(), 'a:b:c');
    t.is(new action_code_1.default('a').parent().get(), 'main');
});
ava_1.default('concat string with string', t => {
    t.is(new action_code_1.default('main').concat('a').get(), 'a');
    t.is(new action_code_1.default('a').concat('b').get(), 'a:b');
    t.is(new action_code_1.default('a:b:c').concat('d').get(), 'a:b:c:d');
    t.is(new action_code_1.default('a:b').concat('c:d').get(), 'a:b:c:d');
});
ava_1.default('concat an ActionCode string', t => {
    t.is(new action_code_1.default('main').concat(new action_code_1.default('a')).get(), 'a');
});
ava_1.default('concat an ActionCode regex', t => {
    t.deepEqual(new action_code_1.default('b').concat(new action_code_1.default(/(.+)/)).get(), /^b:(.+)$/);
});
ava_1.default('regex', t => {
    t.deepEqual(new action_code_1.default(/(.+)/).get(), /^(.+)$/);
});
ava_1.default('regex parent', t => {
    t.deepEqual(new action_code_1.default(/b:(.+)/).parent().get(), /^b$/);
    t.is(new action_code_1.default(/b-(.+)/).parent().get(), 'main');
});
ava_1.default('regex parent with allowed :', t => {
    t.deepEqual(new action_code_1.default(/b:[^:]+/).parent().get(), /^b$/);
    t.deepEqual(new action_code_1.default(/b:([^:])/).parent().get(), /^b$/);
    t.deepEqual(new action_code_1.default(/b:(a[^:])/).parent().get(), /^b$/);
    t.deepEqual(new action_code_1.default(/b:(a[^:]a)/).parent().get(), /^b$/);
    t.deepEqual(new action_code_1.default(/b:(a[^a:]a)/).parent().get(), /^b$/);
    t.deepEqual(new action_code_1.default(/b:(a[^a:a]a)/).parent().get(), /^b$/);
});
ava_1.default('concat string with regex', t => {
    t.deepEqual(new action_code_1.default('b').concat(/(.+)/).get(), /^b:(.+)$/);
});
ava_1.default('concat regex with string', t => {
    t.deepEqual(new action_code_1.default(/foo/).concat('bar').get(), /^foo:bar$/);
});
ava_1.default('concat regex with regex', t => {
    t.deepEqual(new action_code_1.default(/foo/).concat(/bar/).get(), /^foo:bar$/);
});
ava_1.default('regex fail flags', t => {
    t.throws(() => new action_code_1.default(/42/g), /flags/);
    t.throws(() => new action_code_1.default(/42/gi), /flags/);
    t.throws(() => new action_code_1.default(/42/i), /flags/);
});
ava_1.default('regex fail anchors', t => {
    t.throws(() => new action_code_1.default(/^42$/), /anchor/);
    t.throws(() => new action_code_1.default(/^42/), /anchor/);
    t.throws(() => new action_code_1.default(/42$/), /anchor/);
});
ava_1.default('getRegex from regex', t => {
    t.deepEqual(new action_code_1.default(/b/).getRegex(), /^b$/);
});
ava_1.default('getRegex from string', t => {
    t.deepEqual(new action_code_1.default('b').getRegex(), /^b$/);
});
ava_1.default('getString from regex fails', t => {
    t.throws(() => new action_code_1.default(/b/).getString());
});
ava_1.default('getString from string', t => {
    t.is(new action_code_1.default('b').getString(), 'b');
});
ava_1.default('getString from long content fails', t => {
    // 'callback_data' is limited to 64 bytes
    // concat multiple length 10 actions will be longer than 64
    t.throws(() => new action_code_1.default('abcdf12345')
        .concat('abcdf12345')
        .concat('abcdf12345')
        .concat('abcdf12345')
        .concat('abcdf12345')
        .concat('abcdf12345')
        .concat('abcdf12345')
        .getString(), /(callback_data).+(\d+ > 64)/);
});
ava_1.default('regex exec', t => {
    t.is(new action_code_1.default('b').exec('c'), null);
    t.truthy(new action_code_1.default('b').exec('b'));
});
ava_1.default('regex test', t => {
    t.false(new action_code_1.default('b').test('c'));
    t.true(new action_code_1.default('b').test('b'));
});
ava_1.default('testIsBelow', t => {
    t.true(new action_code_1.default('a:b').testIsBelow('a:b'));
    t.true(new action_code_1.default('a:b').testIsBelow('a:b:c'));
    t.false(new action_code_1.default('a:b').testIsBelow('a:z'));
    t.true(new action_code_1.default(/a:b-\d+/).testIsBelow('a:b-42'));
});
ava_1.default('isDynamic', t => {
    t.false(new action_code_1.default('b').isDynamic());
    t.true(new action_code_1.default(/(.+)/).isDynamic());
    // This is not dynamic, but its a RegExp.
    // Just assume its dynamic is easier.
    t.true(new action_code_1.default(/b/).isDynamic());
});
//# sourceMappingURL=action-code.test.js.map