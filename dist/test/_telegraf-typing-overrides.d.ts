import { InlineKeyboardMarkup, ForceReply } from 'telegram-typings';
export interface InlineExtra {
    caption?: string;
    parse_mode?: 'Markdown';
    reply_markup: InlineKeyboardMarkup;
}
export interface ForceReplyExtra {
    reply_markup: ForceReply;
}
export declare const DUMMY_MESSAGE: {
    message_id: number;
    date: number;
    chat: {
        id: number;
        type: string;
    };
};
