import { Middleware, ContextMessageUpdate } from 'telegraf';
import { ContextFunc, ContextNextFunc } from './generic-types';
import ActionCode from './action-code';
declare type MenuFunc = (ctx: ContextMessageUpdate, reason: string) => Promise<void>;
export interface Responder {
    middleware: ContextNextFunc;
    action?: ActionCode;
    only?: ContextFunc<boolean>;
    hide?: ContextFunc<boolean>;
    setMenuAfter?: boolean;
    setParentMenuAfter?: boolean;
}
interface ResponderEnvironment {
    actionCode: ActionCode;
    setMenuFunc: MenuFunc;
    setParentMenuFunc?: MenuFunc;
}
export default class MenuResponders {
    readonly responders: Responder[];
    add(responder: Responder): void;
    hasSomeNonActionResponders(): boolean;
    createMiddleware(environment: ResponderEnvironment): Middleware<ContextMessageUpdate>;
}
export declare function createMiddlewareFromResponder(responder: Responder, environment: ResponderEnvironment): ContextNextFunc;
export {};
