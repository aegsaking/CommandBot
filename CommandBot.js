const mineflayer = require('mineflayer');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const bot = mineflayer.createBot({
  host: 'TestBotsHub.aternos.me',
  port: 11670,
  username: 'TestBot',
  version: '1.16.5',
});

bot.on('login', () => {
  console.log('Бот подключился к серверу! Введите команды, которые нужно выполнить, и напишите "Все", чтобы закончить.');

  function startCommandInput() {
    const commands = [];

    function askForCommand() {
      rl.question('Введите команду (или "Все" для завершения ввода): ', (input) => {
        if (input.toLowerCase() === 'все') {
          if (commands.length === 0) {
            console.log('Вы не ввели ни одной команды. Попробуйте снова.');
            askForCommand();
          } else {
            askForDelay();
          }
        } else {
          commands.push(input);
          askForCommand();
        }
      });
    }

    function askForDelay() {
      rl.question('Хорошо, через какое время вы хотите, чтобы я активировал команды? (например, "100 секунд" или "1 минуту"): ', (input) => {
        const timeParts = input.split(' ');
        const value = parseFloat(timeParts[0]);
        const unit = timeParts[1]?.toLowerCase();

        let delay = 0;
        if (isNaN(value) || (unit !== 'секунд' && unit !== 'минута' && unit !== 'минуты')) {
          console.log('Неверный формат времени. Попробуйте снова.');
          askForDelay();
          return;
        }

        if (unit.startsWith('секунд')) {
          delay = value * 1000;
        } else if (unit.startsWith('минута')) {
          delay = value * 60 * 1000;
        }

        executeCommands(commands, delay);
      });
    }

    function executeCommands(commands, delay) {
      console.log(`Ожидание ${delay / 1000} секунд перед выполнением следующих команд:`);
      console.log(commands);

      setTimeout(() => {
        commands.forEach((command) => bot.chat(command));
        console.log('Команды выполнены.');
        startCommandInput();
      }, delay);
    }

    askForCommand();
  }

  startCommandInput();
});

bot.on('error', (err) => {
  console.error(`Ошибка: ${err}`);
});

bot.on('end', () => {
  console.log('Бот отключился от сервера.');
});
