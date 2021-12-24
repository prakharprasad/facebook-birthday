from random import *


async def generate_birthday_message():
    emoji = ""
    messages = ["Happy Birthday!"]
    emojis = ["🎉", "🍰", "🎂", "✨", "🥳", "🎊"]
    # select 2 to 4 emojis per message
    emoji_count = randint(2, 4)
    for i in range(0, emoji_count):
        emoji += emojis.pop(randint(0, len(emojis) - 1))

    message = messages[randint(0, len(messages) - 1)]
    return f"{message} {emoji}"
