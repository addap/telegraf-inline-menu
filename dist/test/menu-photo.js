"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const telegraf_1 = require("telegraf");
const source_1 = require("../source");
const prefix_1 = require("../source/prefix");
function createBasicBot(t, menu) {
    menu.toggle('toggle me', 'c', {
        setFunc: async () => Promise.reject(new Error('Nothing has to be set when only showing the menu')),
        isSetFunc: () => true
    });
    const bot = new telegraf_1.default('');
    bot.use(menu.init({ actionCode: 'a' }));
    bot.catch((error) => {
        t.log(error);
        t.fail(error.message);
    });
    bot.context.answerCbQuery = async () => true;
    return bot;
}
const EXPECTED_KEYBOARD = [[{
            text: prefix_1.emojiTrue + ' toggle me',
            callback_data: 'a:c-false'
        }]];
const PHOTO_MEDIA = { source: 'cat.png' };
ava_1.default('menu from callback on photo edits photo', async (t) => {
    const bot = createBasicBot(t, new source_1.default('yaay', {
        photo: PHOTO_MEDIA
    }));
    const errorMsg = 'only editMessageMedia should be called';
    bot.context.deleteMessage = async () => Promise.reject(new Error(errorMsg));
    bot.context.editMessageText = async () => Promise.reject(new Error(errorMsg));
    bot.context.reply = async () => Promise.reject(new Error(errorMsg));
    bot.context.replyWithPhoto = async () => Promise.reject(new Error(errorMsg));
    bot.context.editMessageMedia = async (media, extra) => {
        t.deepEqual(media, {
            type: 'photo',
            media: PHOTO_MEDIA,
            caption: 'yaay'
        });
        t.deepEqual(extra.reply_markup.inline_keyboard, EXPECTED_KEYBOARD);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a', message: { photo: [{}, {}] } } });
});
ava_1.default('menu from command replies photo', async (t) => {
    const bot = createBasicBot(t, new source_1.default('yaay', {
        photo: PHOTO_MEDIA
    }).setCommand('test'));
    const errorMsg = 'only replyWithPhoto should be called';
    bot.context.deleteMessage = async () => Promise.reject(new Error(errorMsg));
    bot.context.editMessageMedia = async () => Promise.reject(new Error(errorMsg));
    bot.context.editMessageText = async () => Promise.reject(new Error(errorMsg));
    bot.context.reply = async () => Promise.reject(new Error(errorMsg));
    bot.context.replyWithPhoto = async (photo, extra) => {
        t.is(photo, PHOTO_MEDIA);
        t.is(extra.caption, 'yaay');
        t.deepEqual(extra.reply_markup.inline_keyboard, EXPECTED_KEYBOARD);
        return true;
    };
    await bot.handleUpdate({ message: {
            text: '/test',
            entities: [{ type: 'bot_command', offset: 0, length: 5 }]
        } });
});
ava_1.default('replace message without photo to add photo to menu', async (t) => {
    t.plan(4);
    const bot = createBasicBot(t, new source_1.default('yaay', {
        photo: PHOTO_MEDIA
    }));
    const errorMsg = 'replyWithPhoto should be called';
    bot.context.editMessageMedia = async () => Promise.reject(new Error(errorMsg));
    bot.context.editMessageText = async () => Promise.reject(new Error(errorMsg));
    bot.context.reply = async () => Promise.reject(new Error(errorMsg));
    bot.context.deleteMessage = async () => t.pass();
    bot.context.replyWithPhoto = async (photo, extra) => {
        t.deepEqual(photo, PHOTO_MEDIA);
        t.is(extra.caption, 'yaay');
        t.deepEqual(extra.reply_markup.inline_keyboard, EXPECTED_KEYBOARD);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a' } });
});
ava_1.default('replace message with photo to remove photo from menu', async (t) => {
    t.plan(3);
    const bot = createBasicBot(t, new source_1.default('yaay', {
        photo: undefined
    }));
    const errorMsg = 'reply should be called';
    bot.context.editMessageMedia = async () => Promise.reject(new Error(errorMsg));
    bot.context.editMessageText = async () => Promise.reject(new Error(errorMsg));
    bot.context.reply = async () => Promise.reject(new Error(errorMsg));
    bot.context.replyWithPhoto = async () => Promise.reject(new Error(errorMsg));
    bot.context.deleteMessage = async () => t.pass();
    bot.context.reply = async (text, extra) => {
        t.deepEqual(text, 'yaay');
        t.deepEqual(extra.reply_markup.inline_keyboard, EXPECTED_KEYBOARD);
        return true;
    };
    await bot.handleUpdate({ callback_query: { data: 'a', message: { photo: [] } } });
});
//# sourceMappingURL=menu-photo.js.map