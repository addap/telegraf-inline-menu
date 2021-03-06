import { ContextMessageUpdate } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegram-typings';
import { InternalMenuOptions } from './menu-options';
import { ButtonInfo, ButtonRow, KeyboardPartCreator } from './buttons/types';
export default class MenuButtons {
    readonly buttons: (ButtonRow | KeyboardPartCreator)[];
    generateKeyboardMarkup(ctx: ContextMessageUpdate, actionCodePrefix: string, options: InternalMenuOptions): Promise<InlineKeyboardMarkup>;
    add(button: ButtonInfo, ownRow?: boolean): void;
    addCreator(creator: KeyboardPartCreator): void;
}
