"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const menu_options_1 = require("./menu-options");
const prefix_1 = require("./prefix");
const action_code_1 = require("./action-code");
const combined_middleware_1 = require("./combined-middleware");
const duplicate_action_guardian_1 = require("./duplicate-action-guardian");
const menu_buttons_1 = require("./menu-buttons");
const menu_responders_1 = require("./menu-responders");
const select_1 = require("./buttons/select");
const question_1 = require("./buttons/question");
const align_1 = require("./buttons/align");
const pagination_1 = require("./buttons/pagination");
class TelegrafInlineMenu {
    constructor(menuText, additionals = {}) {
        this.menuText = menuText;
        this.actions = new duplicate_action_guardian_1.default();
        this.buttons = new menu_buttons_1.default();
        this.responders = new menu_responders_1.default();
        this.commands = [];
        this.submenus = [];
        this.replyMenuMiddlewares = [];
        this.menuPhoto = additionals.photo;
    }
    // TODO: BREAKING CHANGE: use ...commands: string[]
    // There will be nothing else to do and it is a lot simpler to use
    setCommand(commands) {
        if (!Array.isArray(commands)) {
            commands = [commands];
        }
        for (const c of commands) {
            this.commands.push(c);
        }
        return this;
    }
    replyMenuMiddleware() {
        const obj = {
            middleware: () => async (ctx) => obj.setSpecific(ctx, ''),
            setSpecific: async (ctx, actionCode) => {
                if (!obj.setMenuFunc) {
                    throw new Error('This does only work when menu is initialized with bot.use(menu.init())');
                }
                return obj.setMenuFunc(ctx, actionCode);
            }
        };
        this.replyMenuMiddlewares.push(obj);
        return obj;
    }
    init(userOptions = {}) {
        // Debug
        // userOptions.log = (...args) => console.log(new Date(), ...args)
        const { actionCode, internalOptions } = menu_options_1.normalizeOptions(userOptions);
        internalOptions.log('init', internalOptions);
        const middleware = this.middleware(actionCode, internalOptions);
        internalOptions.log('init finished');
        return middleware;
    }
    urlButton(text, url, additionalArgs = {}) {
        this.buttons.add({
            text,
            url,
            hide: additionalArgs.hide
        }, !additionalArgs.joinLastRow);
        return this;
    }
    switchToChatButton(text, value, additionalArgs = {}) {
        this.buttons.add({
            text,
            switchToChat: value,
            hide: additionalArgs.hide
        }, !additionalArgs.joinLastRow);
        return this;
    }
    switchToCurrentChatButton(text, value, additionalArgs = {}) {
        this.buttons.add({
            text,
            switchToCurrentChat: value,
            hide: additionalArgs.hide
        }, !additionalArgs.joinLastRow);
        return this;
    }
    manual(text, action, additionalArgs = {}) {
        this.buttons.add({
            text,
            action,
            root: additionalArgs.root,
            hide: additionalArgs.hide
        }, !additionalArgs.joinLastRow);
        return this;
    }
    // This button does not update the menu after being pressed
    simpleButton(text, action, additionalArgs) {
        assert(additionalArgs.doFunc, 'doFunc is not set. set it or use menu.manual');
        this.responders.add({
            action: this.actions.addStatic(action),
            hide: additionalArgs.hide,
            middleware: additionalArgs.doFunc,
            setParentMenuAfter: additionalArgs.setParentMenuAfter,
            setMenuAfter: additionalArgs.setMenuAfter
        });
        return this.manual(text, action, additionalArgs);
    }
    button(text, action, additionalArgs) {
        additionalArgs.setMenuAfter = true;
        return this.simpleButton(text, action, additionalArgs);
    }
    pagination(action, additionalArgs) {
        const { setPage, getCurrentPage, getTotalPages, hide } = additionalArgs;
        const pageFromCtx = async (ctx) => {
            const number = Number(ctx.match[ctx.match.length - 1]);
            const totalPages = Math.ceil(await getTotalPages(ctx));
            return Math.max(1, Math.min(totalPages, number)) || 1;
        };
        this.responders.add({
            middleware: async (ctx) => setPage(ctx, await pageFromCtx(ctx)),
            action: this.actions.addDynamic(action),
            hide,
            setMenuAfter: true
        });
        const createPaginationButtons = async (ctx) => {
            if (hide && await hide(ctx)) {
                return {};
            }
            // Numbers are within
            // currentPage in [1..totalPages]
            const totalPages = await getTotalPages(ctx);
            const currentPage = await getCurrentPage(ctx);
            return pagination_1.paginationOptions(totalPages, currentPage);
        };
        this.buttons.addCreator(async (ctx) => {
            const buttonOptions = await createPaginationButtons(ctx);
            const optionsArr = Object.keys(buttonOptions);
            return select_1.generateSelectButtons(action, optionsArr, {
                textFunc: (_ctx, key) => buttonOptions[key]
            });
        });
        return this;
    }
    question(text, action, additionalArgs) {
        const { questionText, uniqueIdentifier, setFunc, hide, extraMarkup = telegraf_1.Markup.forceReply() } = additionalArgs;
        assert(questionText, 'questionText is not set. set it');
        assert(setFunc, 'setFunc is not set. set it');
        assert(uniqueIdentifier, 'uniqueIdentifier is not set. set it');
        const parseQuestionAnswer = async (ctx) => {
            const answer = ctx.message.text;
            await setFunc(ctx, answer);
        };
        this.responders.add({
            hide,
            setMenuAfter: true,
            only: ctx => question_1.isReplyToQuestion(ctx, uniqueIdentifier),
            middleware: parseQuestionAnswer
        });
        const hitQuestionButton = async (ctx) => {
            const questionTextString = typeof questionText === 'function' ? await questionText(ctx) : questionText;
            const qText = question_1.signQuestionText(questionTextString, uniqueIdentifier);
            const extra = telegraf_1.Extra.markdown().markup(extraMarkup.forceReply());
            await Promise.all([
                ctx.reply(qText, extra),
                ctx.answerCbQuery(),
                ctx.deleteMessage()
                    .catch((error) => {
                    if (error.message.includes('can\'t be deleted')) {
                        // Looks like message is to old to be deleted
                        return;
                    }
                    console.error('deleteMessage on question button failed', error);
                })
            ]);
        };
        return this.simpleButton(text, action, Object.assign(Object.assign({}, additionalArgs), { doFunc: hitQuestionButton }));
    }
    select(action, options, additionalArgs) {
        if ('submenu' in additionalArgs) {
            throw new Error('Use menu.selectSubmenu() instead!');
        }
        const { setFunc, hide } = additionalArgs;
        const keyFromCtx = (ctx) => ctx.match[ctx.match.length - 1];
        const optionsFunc = typeof options === 'function' ? options : () => options;
        this.responders.add({
            middleware: async (ctx) => setFunc(ctx, keyFromCtx(ctx)),
            action: this.actions.addDynamic(action),
            hide: select_1.selectHideFunc(keyFromCtx, optionsFunc, hide),
            setParentMenuAfter: additionalArgs.setParentMenuAfter,
            setMenuAfter: true
        });
        this.buttons.addCreator(select_1.selectButtonCreator(action, optionsFunc, additionalArgs));
        this._selectPagination(action, optionsFunc, additionalArgs);
        return this;
    }
    selectSubmenu(action, options, submenu, additionalArgs = {}) {
        const { hide } = additionalArgs;
        this.submenus.push({
            submenu,
            action: this.actions.addDynamic(action),
            hide
        });
        const optionsFunc = typeof options === 'function' ? options : () => options;
        this.buttons.addCreator(select_1.selectButtonCreator(action, optionsFunc, additionalArgs));
        this._selectPagination(action, optionsFunc, additionalArgs);
        return submenu;
    }
    toggle(text, action, additionalArgs) {
        const { setFunc, isSetFunc, hide } = additionalArgs;
        assert(setFunc, 'setFunc is not set. set it');
        assert(isSetFunc, 'isSetFunc is not set. set it');
        const hideFunc = async (ctx, state) => {
            if (hide && await hide(ctx)) {
                return true;
            }
            const isSet = Boolean(await isSetFunc(ctx));
            return isSet === state;
        };
        this.button(async (ctx) => prefix_1.prefixEmoji(text, false, additionalArgs, ctx), `${action}-true`, Object.assign(Object.assign({}, additionalArgs), { doFunc: async (ctx) => setFunc(ctx, true), hide: async (ctx) => hideFunc(ctx, true) }));
        this.button(async (ctx) => prefix_1.prefixEmoji(text, true, additionalArgs, ctx), `${action}-false`, Object.assign(Object.assign({}, additionalArgs), { doFunc: async (ctx) => setFunc(ctx, false), hide: async (ctx) => hideFunc(ctx, false) }));
        return this;
    }
    submenu(text, action, submenu, additionalArgs = {}) {
        this.manual(text, action, additionalArgs);
        this.submenus.push({
            action: this.actions.addStatic(action),
            hide: additionalArgs.hide,
            submenu
        });
        return submenu;
    }
    async generate(ctx, actionCode, options) {
        options.log('generate…', actionCode.get());
        const text = typeof this.menuText === 'function' ? await this.menuText(ctx) : this.menuText;
        let actualActionCode;
        if (actionCode.isDynamic()) {
            if (!ctx.callbackQuery || !ctx.callbackQuery.data) {
                throw new Error('requires a callbackQuery with data in an dynamic menu');
            }
            const expectedPartCount = options.depth;
            const actualParts = ctx.callbackQuery.data.split(':');
            // Go up to the menu that shall be opened
            while (actualParts.length > expectedPartCount) {
                actualParts.pop();
            }
            const menuAction = actualParts.join(':');
            actualActionCode = new action_code_1.default(menuAction).getString();
            options.log('generate with actualActionCode', actualActionCode, actionCode.get(), ctx.callbackQuery.data);
        }
        else {
            actualActionCode = actionCode.getString();
        }
        const keyboardMarkup = await this.buttons.generateKeyboardMarkup(ctx, actualActionCode, options);
        options.log('buttons', keyboardMarkup.inline_keyboard);
        const extra = telegraf_1.Extra.markdown().markup(keyboardMarkup);
        return { text, extra };
    }
    async setMenuNow(ctx, actionCode, options) {
        const { text, extra } = await this.generate(ctx, actionCode, options);
        const photo = typeof this.menuPhoto === 'function' ? await this.menuPhoto(ctx) : this.menuPhoto;
        const photoExtra = new telegraf_1.Extra(Object.assign({ caption: text }, extra));
        const isPhotoMessage = Boolean(ctx.callbackQuery && ctx.callbackQuery.message && ctx.callbackQuery.message.photo);
        if (ctx.updateType !== 'callback_query' || isPhotoMessage !== Boolean(photo)) {
            if (ctx.updateType === 'callback_query') {
                ctx.deleteMessage().catch(() => { });
            }
            if (photo) {
                await ctx.replyWithPhoto(photo, photoExtra);
            }
            else {
                await ctx.reply(text, extra);
            }
            return;
        }
        await ctx.answerCbQuery();
        try {
            // When photo is set it is a photo message
            // isPhotoMessage !== photo is ensured above
            if (photo) {
                const media = {
                    type: 'photo',
                    media: photo,
                    caption: text
                };
                await ctx.editMessageMedia(media, photoExtra);
            }
            else {
                await ctx.editMessageText(text, extra);
            }
        }
        catch (error) {
            if (error.message.startsWith('400: Bad Request: message is not modified')) {
                // This is kind of ok.
                // Not changed stuff should not be sended but sometimes it happens…
                console.warn('menu is not modified. Think about preventing this. Happened while setting menu', actionCode.get());
                return;
            }
            throw error;
        }
    }
    middleware(actionCode, options) {
        assert(actionCode, 'use this menu with .init(): bot.use(menu.init(args))');
        if (actionCode.isDynamic()) {
            assert(this.commands.length === 0, `commands can not point on dynamic submenus. Happened in menu ${actionCode.get()} with the following commands: ${this.commands.join(', ')}`);
            const hasResponderWithoutAction = this.responders.hasSomeNonActionResponders();
            assert(!hasResponderWithoutAction, `a dynamic submenu can only contain buttons. A question for example does not work. Happened in menu ${actionCode.get()}`);
        }
        options.log('middleware triggered', actionCode.get(), options, this);
        options.log('add action reaction', actionCode.get(), 'setMenu');
        const setMenuFunc = async (ctx, reason, actionOverride) => {
            if (actionOverride) {
                ctx.match = actionCode.exec(actionOverride.getString());
            }
            options.log('set menu', (actionOverride || actionCode).get(), reason, this);
            return this.setMenuNow(ctx, actionOverride || actionCode, options);
        };
        const functions = [];
        if (this.commands.length > 0) {
            const myComposer = telegraf_1.Composer;
            functions.push(myComposer.command(this.commands, async (ctx) => setMenuFunc(ctx, 'command')));
        }
        for (const replyMenuMiddleware of this.replyMenuMiddlewares) {
            assert(!replyMenuMiddleware.setMenuFunc, 'replyMenuMiddleware does not work on a menu that is reachable on multiple different ways. This could be implemented but there wasnt a need for this yet. Open an issue on GitHub.');
            replyMenuMiddleware.setMenuFunc = async (ctx, actionOverride) => {
                assert(!actionCode.isDynamic() || actionOverride, 'a dynamic menu can only be set when an actionCode is given');
                if (actionOverride) {
                    assert(actionCode.test(actionOverride), `The actionCode has to belong to the menu. ${actionOverride} does not work with the menu ${actionCode.get()}`);
                }
                return setMenuFunc(ctx, 'replyMenuMiddleware', actionOverride ? new action_code_1.default(actionOverride) : actionCode);
            };
        }
        const subOptions = Object.assign(Object.assign({}, options), { setParentMenuFunc: setMenuFunc, depth: Number(options.depth) + 1 });
        const handlerFuncs = this.submenus
            .map(({ action, submenu, hide }) => {
            const childActionCode = actionCode.concat(action);
            const hiddenFunc = async (ctx, next) => {
                if (!ctx.callbackQuery) {
                    // Only set menu when a hidden button below was used
                    // Without callbackData this can not be determined
                    return next(ctx);
                }
                return setMenuFunc(ctx, 'menu is hidden');
            };
            const mainFunc = submenu.middleware(childActionCode, subOptions);
            const m = new combined_middleware_1.default(mainFunc, hiddenFunc)
                .addOnly(ctx => !ctx.callbackQuery || !ctx.callbackQuery.data || childActionCode.testIsBelow(ctx.callbackQuery.data));
            if (hide) {
                m.addHide(hide);
            }
            return m.middleware();
        });
        const responderMiddleware = this.responders.createMiddleware({
            actionCode,
            setMenuFunc,
            setParentMenuFunc: options.setParentMenuFunc
        });
        return telegraf_1.Composer.compose([
            responderMiddleware,
            ...functions,
            ...handlerFuncs
        ]);
    }
    _selectPagination(baseAction, optionsFunc, additionalArgs) {
        const { setPage, getCurrentPage, columns, maxRows } = additionalArgs;
        const maxButtons = align_1.maximumButtonsPerPage(columns, maxRows);
        if (setPage && getCurrentPage) {
            this.pagination(`${baseAction}Page`, {
                setPage,
                getCurrentPage,
                getTotalPages: async (ctx) => {
                    const optionsResult = await optionsFunc(ctx);
                    const keys = Array.isArray(optionsResult) ? optionsResult : Object.keys(optionsResult);
                    return keys.length / maxButtons;
                }
            });
        }
        else if (!setPage && !getCurrentPage) {
            // No pagination
        }
        else {
            throw new Error('setPage and getCurrentPage have to be provided both in order to have a propper pagination.');
        }
    }
}
exports.default = TelegrafInlineMenu;
function assert(value, message) {
    if (value) {
        // Everything is ok
        return;
    }
    throw new Error(message);
}
// For CommonJS default export support
module.exports = TelegrafInlineMenu;
module.exports.default = TelegrafInlineMenu;
//# sourceMappingURL=index.js.map