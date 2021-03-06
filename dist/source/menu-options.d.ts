import { ContextMessageUpdate } from 'telegraf';
import { ConstOrContextFunc } from './generic-types';
import ActionCode from './action-code';
export interface MenuOptions {
    actionCode?: string;
    backButtonText?: ConstOrContextFunc<string>;
    mainMenuButtonText?: ConstOrContextFunc<string>;
    log?: (...args: any[]) => void;
}
export interface InternalMenuOptions {
    hasMainMenu: boolean;
    depth: number;
    backButtonText?: ConstOrContextFunc<string>;
    mainMenuButtonText?: ConstOrContextFunc<string>;
    setParentMenuFunc?: (ctx: ContextMessageUpdate, reason: string) => Promise<void>;
    log: (...args: any[]) => void;
}
export declare function normalizeOptions(userOptions: MenuOptions): {
    actionCode: ActionCode;
    internalOptions: InternalMenuOptions;
};
