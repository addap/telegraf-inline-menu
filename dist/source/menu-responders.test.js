"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const action_code_1 = require("./action-code");
const menu_responders_1 = require("./menu-responders");
ava_1.default('no responders', t => {
    const responders = new menu_responders_1.default();
    t.false(responders.hasSomeNonActionResponders());
});
ava_1.default('only action responder', t => {
    const responders = new menu_responders_1.default();
    responders.add({
        middleware: async () => { },
        action: new action_code_1.default('main')
    });
    t.false(responders.hasSomeNonActionResponders());
});
ava_1.default('only non action responder', t => {
    const responders = new menu_responders_1.default();
    responders.add({
        middleware: async () => { }
    });
    t.true(responders.hasSomeNonActionResponders());
});
//# sourceMappingURL=menu-responders.test.js.map