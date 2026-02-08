import { createBot } from "./bot";

async function bootstarp() {
  try {
    const bot = await createBot();
    bot.launch();
    console.log("Бот успешно запущен!");
  } catch (error) {
    console.log("Не удалось запустить бота");
    process.exit(1);
  }
}

bootstarp();
