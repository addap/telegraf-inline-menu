"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const duplicate_action_guardian_1 = require("./duplicate-action-guardian");
ava_1.default('static ActionCode', t => {
    const actionCode = new duplicate_action_guardian_1.default().addStatic('bla');
    t.is(actionCode.get(), 'bla');
});
ava_1.default('dynamic ActionCode', t => {
    const actionCode = new duplicate_action_guardian_1.default().addDynamic('bla');
    t.deepEqual(actionCode.get(), /^bla-([^:]+)$/);
});
ava_1.default('different statics dont fail', t => {
    const g = new duplicate_action_guardian_1.default();
    g.addStatic('a');
    g.addStatic('b');
    t.pass();
});
ava_1.default('different dynamics dont fail', t => {
    const g = new duplicate_action_guardian_1.default();
    g.addDynamic('a');
    g.addDynamic('b');
    t.pass();
});
ava_1.default('can not end with -', t => {
    const g = new duplicate_action_guardian_1.default();
    t.throws(() => g.addStatic('a-'), 'action can not end with a -');
    t.throws(() => g.addDynamic('a-'), 'action can not end with a -');
});
ava_1.default('static already defined', t => {
    const g = new duplicate_action_guardian_1.default();
    g.addStatic('a');
    t.throws(() => g.addStatic('a'), /defined/);
});
ava_1.default('dynamic already defined', t => {
    const g = new duplicate_action_guardian_1.default();
    g.addDynamic('a');
    t.throws(() => g.addDynamic('a'), /defined/);
});
ava_1.default('new static could be matched by existing dynamic', t => {
    const g = new duplicate_action_guardian_1.default();
    g.addDynamic('a');
    t.throws(() => g.addStatic('a-b'), /: a$/);
});
ava_1.default('new dynamic would match existing static', t => {
    const g = new duplicate_action_guardian_1.default();
    g.addStatic('a-b');
    t.throws(() => g.addDynamic('a'), /: a-b$/);
});
ava_1.default('new dynamic would match existing dynamic', t => {
    const g = new duplicate_action_guardian_1.default();
    g.addDynamic('a-b');
    t.throws(() => g.addDynamic('a'), /: a-b$/);
});
ava_1.default('example longer static exists', t => {
    const g = new duplicate_action_guardian_1.default();
    g.addStatic('a-true');
    g.addStatic('a-false');
    g.addStatic('a');
    t.throws(() => g.addDynamic('a'), /: a-true; a-false$/);
});
ava_1.default('example longer dynamic exists', t => {
    const g = new duplicate_action_guardian_1.default();
    g.addDynamic('a-page');
    t.throws(() => g.addDynamic('a'), /: a-page$/);
});
//# sourceMappingURL=duplicate-action-guardian.test.js.map