"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prefix_1 = require("../prefix");
const align_1 = require("./align");
function generateSelectButtons(actionBase, options, selectOptions) {
    const { textFunc, hide, columns, maxRows, currentPage } = selectOptions;
    const buttons = options
        .map(o => String(o))
        .map((key, i, arr) => {
        const action = `${actionBase}-${key}`;
        return {
            text: async (ctx) => textFunc(ctx, key, i, arr),
            action,
            hide: async (ctx) => hide ? hide(ctx, key) : false
        };
    });
    return align_1.getRowsOfButtons(buttons, columns, maxRows, currentPage);
}
exports.generateSelectButtons = generateSelectButtons;
function selectButtonCreator(action, optionsFunc, additionalArgs) {
    const { getCurrentPage, textFunc, prefixFunc, isSetFunc, multiselect } = additionalArgs;
    return async (ctx) => {
        const optionsResult = await optionsFunc(ctx);
        const keys = Array.isArray(optionsResult) ? optionsResult : Object.keys(optionsResult);
        const currentPage = getCurrentPage && await getCurrentPage(ctx);
        const fallbackKeyTextFunc = Array.isArray(optionsResult) ?
            (_ctx, key) => key :
            (_ctx, key) => optionsResult[key];
        const textOnlyFunc = textFunc || fallbackKeyTextFunc;
        const keyTextFunc = async (...args) => prefix_1.prefixEmoji(textOnlyFunc, prefixFunc || isSetFunc, Object.assign({ hideFalseEmoji: !multiselect }, additionalArgs), ...args);
        return generateSelectButtons(action, keys, Object.assign(Object.assign({}, additionalArgs), { textFunc: keyTextFunc, currentPage }));
    };
}
exports.selectButtonCreator = selectButtonCreator;
function selectHideFunc(keyFromCtx, optionsFunc, userHideFunc) {
    return async (ctx) => {
        const key = keyFromCtx(ctx);
        const optionsResult = await optionsFunc(ctx);
        const keys = Array.isArray(optionsResult) ? optionsResult : Object.keys(optionsResult);
        if (!keys.map(o => String(o)).includes(key)) {
            return true;
        }
        if (userHideFunc && await userHideFunc(ctx, key)) {
            return true;
        }
        return false;
    };
}
exports.selectHideFunc = selectHideFunc;
//# sourceMappingURL=select.js.map