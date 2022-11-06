import { IConfigStore } from "@src/interfaces/interface-config";
import Services from "@src/services";
import * as modules from "@src/store/exports";

class Store {
  services: Services;
  config: IConfigStore;
  state: any;
  listeners: any[];
  modules: any;
  /**
   * @param services {Services}
   * @param config {Object}
   */
  constructor(services: Services, config: IConfigStore) {
    // Менеджер сервисов
    this.services = services;
    this.config = {
      ...config,
      log: false,
    };
    // Состояние приложения (данные)
    this.state = {};
    // Слушатели изменений state
    this.listeners = [];

    this.state.prop = 1;
    // Модули
    this.modules = {};
    for (const name of Object.keys(modules)) {
      // Экземпляр модуля. Передаём ему ссылку на store и навзание модуля.
      this.modules[name] = new modules[name](this, {
        name,
        ...(this.config.modules ? this.config.modules[name] : {}),
      });
      // По названию модля устанавливается свойство с анчальным состоянием от модуля
      this.state[name] = this.modules[name].initState();
    }
  }

  newState(name: string, newName: string): void {
    this.modules[newName] = new modules[name](this, {
      name: newName,
      ...(this.config.modules ? this.config.modules[name] : {}),
    });
    this.state[newName] = this.modules[newName].initState();
  }

  removeState(name: string): void {
    const keys = Object.keys(this.modules);

    if (keys.includes(name)) {
      delete this.modules[name];
    }
  }

  /**
   * Доступ к модулю состояния
   * @param name {String} Название модуля
   */
  get(name: string): object {
    return this.modules[name];
  }

  /**
   * Выбор state
   * @return {Object}
   */
  getState(): any {
    return this.state;
  }

  /**
   * Установка state
   * @param newState {Object}
   * @param [description] {String} Описание действия для логирования
   */
  setState(newState: object, description: string = "setState"): void {
    if (this.config.log) {
      console.group(
        `%c${"store.setState"} %c${description}`,
        `color: ${"#777"}; font-weight: normal`,
        `color: ${"#333"}; font-weight: bold`
      );
      console.log(`%c${"prev:"}`, `color: ${"#d77332"}`, this.state);
      console.log(`%c${"next:"}`, `color: ${"#2fa827"}`, newState);
      console.groupEnd();
    }
    this.state = newState;
    // Оповещаем всех подписчиков об изменении стейта
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Подписка на изменение state
   * @param callback {Function}
   * @return {Function} Функция для отписки
   */
  subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    // Возвращаем функцию для удаления слушателя
    return () => {
      this.listeners = this.listeners.filter((item) => item !== callback);
    };
  }
}

export default Store;