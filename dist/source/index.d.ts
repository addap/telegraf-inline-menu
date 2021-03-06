/// <reference types="node" />
import { Extra, ContextMessageUpdate } from 'telegraf';
import { ConstOrContextFunc, ContextFunc, ContextNextFunc, ContextKeyFunc } from './generic-types';
import { InternalMenuOptions, MenuOptions } from './menu-options';
import { PrefixOptions } from './prefix';
import ActionCode from './action-code';
import DuplicateActionGuardian from './duplicate-action-guardian';
import MenuButtons from './menu-buttons';
import MenuResponders from './menu-responders';
import { SelectButtonCreatorOptions, SelectOptions } from './buttons/select';
declare type Photo = string | {
    source: Buffer | string;
};
interface MenuAdditionals {
    photo?: ConstOrContextFunc<Photo | undefined>;
}
interface SubmenuEntry {
    action: ActionCode;
    submenu: TelegrafInlineMenu;
    hide?: ContextFunc<boolean>;
}
interface ReplyMenuMiddleware {
    middleware: () => ContextNextFunc;
    setSpecific: (ctx: ContextMessageUpdate, actionCodeOverride: string) => Promise<void>;
    setMenuFunc?: (ctx: ContextMessageUpdate, actionCodeOverride?: string) => Promise<void>;
}
interface ButtonOptions {
    hide?: ContextFunc<boolean>;
    joinLastRow?: boolean;
}
interface ActionButtonOptions extends ButtonOptions {
    root?: boolean;
}
interface SimpleButtonOptions extends ActionButtonOptions {
    doFunc: ContextFunc<any>;
    setMenuAfter?: boolean;
    setParentMenuAfter?: boolean;
}
interface PaginationOptions {
    setPage: (ctx: ContextMessageUpdate, page: number) => Promise<void> | void;
    getCurrentPage: ContextFunc<number | undefined>;
    getTotalPages: ContextFunc<number>;
    hide?: ContextFunc<boolean>;
}
interface QuestionOptions extends ButtonOptions {
    questionText: ConstOrContextFunc<string>;
    setFunc: (ctx: ContextMessageUpdate, answer: string | undefined) => Promise<void> | void;
    uniqueIdentifier: string;
    extraMarkup?: any;
}
interface SelectPaginationOptions {
    columns?: number;
    maxRows?: number;
    setPage?: (ctx: ContextMessageUpdate, page: number) => Promise<void> | void;
    getCurrentPage?: ContextFunc<number | undefined>;
}
interface SelectActionOptions extends SelectButtonCreatorOptions, SelectPaginationOptions {
    setFunc: ContextKeyFunc<void>;
    hide?: ContextKeyFunc<boolean>;
    setMenuAfter?: boolean;
    setParentMenuAfter?: boolean;
}
interface SelectSubmenuOptions extends SelectButtonCreatorOptions, SelectPaginationOptions {
    hide?: ContextFunc<boolean>;
}
interface ToggleOptions extends ButtonOptions, PrefixOptions {
    setFunc: (ctx: ContextMessageUpdate, newState: boolean) => Promise<void> | void;
    isSetFunc: ContextFunc<boolean>;
}
export default class TelegrafInlineMenu {
    protected menuText: ConstOrContextFunc<string>;
    protected readonly actions: DuplicateActionGuardian;
    protected readonly buttons: MenuButtons;
    protected readonly responders: MenuResponders;
    protected readonly commands: string[];
    protected readonly submenus: SubmenuEntry[];
    protected readonly replyMenuMiddlewares: ReplyMenuMiddleware[];
    protected readonly menuPhoto?: ConstOrContextFunc<Photo | undefined>;
    constructor(menuText: ConstOrContextFunc<string>, additionals?: MenuAdditionals);
    setCommand(commands: string | string[]): TelegrafInlineMenu;
    replyMenuMiddleware(): ReplyMenuMiddleware;
    init(userOptions?: MenuOptions): ContextNextFunc;
    urlButton(text: ConstOrContextFunc<string>, url: ConstOrContextFunc<string>, additionalArgs?: ButtonOptions): TelegrafInlineMenu;
    switchToChatButton(text: ConstOrContextFunc<string>, value: ConstOrContextFunc<string>, additionalArgs?: ButtonOptions): TelegrafInlineMenu;
    switchToCurrentChatButton(text: ConstOrContextFunc<string>, value: ConstOrContextFunc<string>, additionalArgs?: ButtonOptions): TelegrafInlineMenu;
    manual(text: ConstOrContextFunc<string>, action: string, additionalArgs?: ActionButtonOptions): TelegrafInlineMenu;
    simpleButton(text: ConstOrContextFunc<string>, action: string, additionalArgs: SimpleButtonOptions): TelegrafInlineMenu;
    button(text: ConstOrContextFunc<string>, action: string, additionalArgs: SimpleButtonOptions): TelegrafInlineMenu;
    pagination(action: string, additionalArgs: PaginationOptions): TelegrafInlineMenu;
    question(text: ConstOrContextFunc<string>, action: string, additionalArgs: QuestionOptions): TelegrafInlineMenu;
    select(action: string, options: ConstOrContextFunc<SelectOptions>, additionalArgs: SelectActionOptions): TelegrafInlineMenu;
    selectSubmenu(action: string, options: ConstOrContextFunc<SelectOptions>, submenu: TelegrafInlineMenu, additionalArgs?: SelectSubmenuOptions): TelegrafInlineMenu;
    toggle(text: ConstOrContextFunc<string>, action: string, additionalArgs: ToggleOptions): TelegrafInlineMenu;
    submenu(text: ConstOrContextFunc<string>, action: string, submenu: TelegrafInlineMenu, additionalArgs?: ButtonOptions): TelegrafInlineMenu;
    protected generate(ctx: ContextMessageUpdate, actionCode: ActionCode, options: InternalMenuOptions): Promise<{
        text: string;
        extra: Extra;
    }>;
    protected setMenuNow(ctx: any, actionCode: ActionCode, options: InternalMenuOptions): Promise<void>;
    protected middleware(actionCode: ActionCode, options: InternalMenuOptions): ContextNextFunc;
    private _selectPagination;
}
export {};
