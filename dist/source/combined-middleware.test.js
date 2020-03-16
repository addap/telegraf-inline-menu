"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const combined_middleware_1 = require("./combined-middleware");
function pass(t) {
    return async () => t.pass();
}
function fail(t) {
    return async () => t.fail();
}
ava_1.default('just middleware runs', async (t) => {
    t.plan(1);
    const m = new combined_middleware_1.default(pass(t))
        .middleware();
    await m(666, t.fail);
});
ava_1.default('hide true passes through', async (t) => {
    t.plan(1);
    const m = new combined_middleware_1.default(fail(t))
        .addHide(() => true)
        .middleware();
    await m(666, t.pass);
});
ava_1.default('hide false middleware runs', async (t) => {
    t.plan(1);
    const m = new combined_middleware_1.default(pass(t))
        .addHide(() => false)
        .middleware();
    await m(666, t.fail);
});
ava_1.default('multiple hide passes through', async (t) => {
    t.plan(1);
    const m = new combined_middleware_1.default(fail(t))
        .addHide(() => false)
        .addHide(() => true)
        .middleware();
    await m(666, t.pass);
});
ava_1.default('hide true hiddenFunc runs', async (t) => {
    t.plan(1);
    const m = new combined_middleware_1.default(fail(t), pass(t))
        .addHide(() => true)
        .middleware();
    await m(666, t.fail);
});
ava_1.default('hide false hiddenFunc does not run', async (t) => {
    t.plan(1);
    const m = new combined_middleware_1.default(pass(t), fail(t))
        .addHide(() => false)
        .middleware();
    await m(666, t.pass);
});
ava_1.default('only true middleware runs', async (t) => {
    t.plan(1);
    const m = new combined_middleware_1.default(pass(t))
        .addOnly(() => true)
        .middleware();
    await m(666, t.fail);
});
ava_1.default('only false passes through', async (t) => {
    t.plan(1);
    const m = new combined_middleware_1.default(fail(t))
        .addOnly(() => false)
        .middleware();
    await m(666, t.pass);
});
ava_1.default('multiple only passes through', async (t) => {
    t.plan(1);
    const m = new combined_middleware_1.default(fail(t))
        .addOnly(() => false)
        .addOnly(() => true)
        .middleware();
    await m(666, t.pass);
});
ava_1.default('afterFunc runs', async (t) => {
    t.plan(2);
    const m = new combined_middleware_1.default(pass(t))
        .addAfterFunc(pass(t))
        .middleware();
    await m(666, t.fail);
});
ava_1.default('afterFunc does not run when hidden', async (t) => {
    t.plan(1);
    const m = new combined_middleware_1.default(fail(t))
        .addHide(() => true)
        .addAfterFunc(fail(t))
        .middleware();
    await m(666, t.pass);
});
ava_1.default('afterFunc runs when hidden', async (t) => {
    t.plan(2);
    const m = new combined_middleware_1.default(fail(t))
        .addHide(() => true)
        .addAfterFunc(pass(t), true)
        .middleware();
    await m(666, t.pass);
});
ava_1.default('multiple afterFunc run all', async (t) => {
    t.plan(3);
    const m = new combined_middleware_1.default(pass(t))
        .addAfterFunc(pass(t), true)
        .addAfterFunc(pass(t), false)
        .middleware();
    await m(666, t.fail);
});
ava_1.default('multiple afterFunc with hiding run each based on hide', async (t) => {
    t.plan(2);
    const m = new combined_middleware_1.default(fail(t))
        .addHide(() => true)
        .addAfterFunc(pass(t), true)
        .addAfterFunc(fail(t), false)
        .middleware();
    await m(666, t.pass);
});
//# sourceMappingURL=combined-middleware.test.js.map