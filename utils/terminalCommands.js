/**
 * Система команд терминала
 * Централизованное управление всеми командами
 */

/**
 * Базовый класс для команд
 */
class TerminalCommand {
  constructor(name, description, handler) {
    this.name = name;
    this.description = description;
    this.handler = handler;
  }
  
  execute(params, context) {
    return this.handler(params, context);
  }
}

/**
 * Менеджер команд терминала
 */
export class CommandManager {
  constructor() {
    this.commands = new Map();
    this.aliases = new Map();
  }
  
  /**
   * Регистрация команды
   * @param {TerminalCommand} command - Команда для регистрации
   * @param {Array} aliases - Псевдонимы команды
   */
  register(command, aliases = []) {
    this.commands.set(command.name.toUpperCase(), command);
    
    aliases.forEach(alias => {
      this.aliases.set(alias.toUpperCase(), command.name.toUpperCase());
    });
  }
  
  /**
   * Выполнение команды
   * @param {string} commandName - Название команды
   * @param {Object} params - Параметры команды
   * @param {Object} context - Контекст выполнения
   */
  execute(commandName, params = {}, context = {}) {
    const normalizedName = commandName.toUpperCase();
    const actualCommandName = this.aliases.get(normalizedName) || normalizedName;
    const command = this.commands.get(actualCommandName);
    
    if (!command) {
      return {
        success: false,
        message: `>>> ОШИБКА: НЕИЗВЕСТНАЯ КОМАНДА "${commandName}"`,
        type: 'error'
      };
    }
    
    try {
      const result = command.execute(params, context);
      return {
        success: true,
        result,
        type: 'success'
      };
    } catch (error) {
      return {
        success: false,
        message: `>>> ОШИБКА ВЫПОЛНЕНИЯ: ${error.message}`,
        type: 'error'
      };
    }
  }
  
  /**
   * Получение списка всех команд
   */
  getCommandsList() {
    return Array.from(this.commands.values()).map(cmd => ({
      name: cmd.name,
      description: cmd.description
    }));
  }
  
  /**
   * Поиск команды по частичному совпадению
   * @param {string} partial - Часть названия команды
   */
  findCommands(partial) {
    const normalized = partial.toUpperCase();
    return Array.from(this.commands.keys())
      .filter(name => name.includes(normalized))
      .map(name => this.commands.get(name));
  }
}

/**
 * Фабрика для создания команд
 */
export class CommandFactory {
  /**
   * Создание команды HELP
   */
  static createHelpCommand(terminalData) {
    return new TerminalCommand(
      'HELP',
      'Показать справку по командам',
      (params, context) => {
        return {
          type: 'text',
          content: terminalData.helpText.join('\n')
        };
      }
    );
  }
  
  /**
   * Создание команды SKILLS
   */
  static createSkillsCommand(terminalData) {
    return new TerminalCommand(
      'SKILLS',
      'Показать навыки',
      (params, context) => {
        return {
          type: 'text',
          content: terminalData.skills.join('\n')
        };
      }
    );
  }
  
  /**
   * Создание команды PROJECTS
   */
  static createProjectsCommand(terminalData) {
    return new TerminalCommand(
      'PROJECTS',
      'Показать проекты',
      (params, context) => {
        return {
          type: 'text',
          content: terminalData.projects.join('\n')
        };
      }
    );
  }
  
  /**
   * Создание команды ABOUT
   */
  static createAboutCommand(terminalData) {
    return new TerminalCommand(
      'ABOUT',
      'Информация обо мне',
      (params, context) => {
        return {
          type: 'text',
          content: terminalData.aboutMe.join('\n')
        };
      }
    );
  }
  
  /**
   * Создание команды BLOG
   */
  static createBlogCommand(terminalData) {
    return new TerminalCommand(
      'BLOG',
      'Показать блог',
      (params, context) => {
        if (params.full && params.articleNumber) {
          const articleNumber = parseInt(params.articleNumber);
          if (terminalData.blogFull[articleNumber]) {
            return {
              type: 'text',
              content: terminalData.blogFull[articleNumber].join('\n')
            };
          } else {
            return {
              type: 'error',
              content: [
                '>>> ОШИБКА: СТАТЬЯ НЕ НАЙДЕНА',
                '>>> ИСПОЛЬЗОВАНИЕ: BLOG -FULL [номер]',
                '>>> ДОСТУПНЫЕ СТАТЬИ: 1, 2, 3',
                ''
              ].join('\n')
            };
          }
        }
        
        return {
          type: 'text',
          content: terminalData.blog.join('\n')
        };
      }
    );
  }
  
  /**
   * Создание команды THEME
   */
  static createThemeCommand() {
    return new TerminalCommand(
      'THEME',
      'Сменить цветовую схему',
      (params, context) => {
        const { theme, onThemeChange, triggerGlitch } = context;
        
        if (!params.theme) {
          return {
            type: 'error',
            content: [
              '>>> ОШИБКА: НЕ УКАЗАНА ТЕМА',
              '>>> ИСПОЛЬЗОВАНИЕ: THEME [GREEN|AMBER|BLUE]',
              ''
            ].join('\n')
          };
        }
        
        const validThemes = ['GREEN', 'AMBER', 'BLUE'];
        const themeName = params.theme.toUpperCase();
        
        if (!validThemes.includes(themeName)) {
          return {
            type: 'error',
            content: [
              `>>> ОШИБКА: НЕДОПУСТИМАЯ ТЕМА "${params.theme}"`,
              '>>> ДОСТУПНЫЕ ТЕМЫ: GREEN, AMBER, BLUE',
              ''
            ].join('\n')
          };
        }
        
        // Активируем эффект глитча при смене темы
        triggerGlitch?.(1000);
        
        // Устанавливаем новую тему
        onThemeChange?.(themeName.toLowerCase());
        
        return {
          type: 'text',
          content: [
            `>>> ЦВЕТОВАЯ СХЕМА ТЕРМИНАЛА ИЗМЕНЕНА НА: ${themeName}`,
            '>>> СИСТЕМА ПЕРЕКАЛИБРОВЫВАЕТ ПАРАМЕТРЫ ДИСПЛЕЯ...',
            '>>> ПЕРЕКАЛИБРОВКА ДИСПЛЕЯ ЗАВЕРШЕНА',
            ''
          ].join('\n')
        };
      }
    );
  }
  
  /**
   * Создание команды CLEAR
   */
  static createClearCommand() {
    return new TerminalCommand(
      'CLEAR',
      'Очистить экран',
      (params, context) => {
        const { clearHistory } = context;
        clearHistory?.();
        return {
          type: 'clear',
          content: ''
        };
      }
    );
  }
  
  /**
   * Создание команды OFF
   */
  static createOffCommand() {
    return new TerminalCommand(
      'OFF',
      'Выключить терминал',
      (params, context) => {
        const { shutdown } = context;
        shutdown?.();
        return {
          type: 'shutdown',
          content: '>>> ВЫКЛЮЧЕНИЕ СИСТЕМЫ...'
        };
      }
    );
  }
}

/**
 * Парсер команд для извлечения параметров
 */
export class CommandParser {
  /**
   * Парсинг команды с параметрами
   * @param {string} commandString - Строка команды
   */
  static parse(commandString) {
    const parts = commandString.trim().split(/\s+/);
    const commandName = parts[0];
    const params = {};
    
    // Парсим параметры
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      
      if (part.startsWith('-')) {
        // Флаг или параметр с значением
        const flag = part.substring(1);
        const nextPart = parts[i + 1];
        
        if (nextPart && !nextPart.startsWith('-')) {
          params[flag] = nextPart;
          i++; // Пропускаем следующую часть
        } else {
          params[flag] = true;
        }
      } else {
        // Позиционный параметр
        if (!params.positional) {
          params.positional = [];
        }
        params.positional.push(part);
      }
    }
    
    return {
      command: commandName,
      params
    };
  }
} 