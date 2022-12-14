import StateModule from "@src/store/module";
import { IBasket } from "./type";

/**
 * Состояние корзины
 */
class BasketState extends StateModule {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): IBasket {
    return {
      selected: undefined,
      items: [],
      sum: 0,
      amount: 0,
    };
  }

  /**
   * Добавление товара в корзину
   * @param _id Код товара
   */
  async addToBasket(_id: string, amount = 1) {
    let sum = 0;
    // Ищем товар в корзие, чтобы увеличить его количество. Заодно получаем новый массив items
    let exists = false;

    const items = this.getState().items.map((item) => {
      let result = item;
      // Искомый товар для увеличения его количества
      if (item._id === _id) {
        exists = true;
        result = { ...item, amount: item.amount + amount };
      }
      // Добавляея в общую сумму
      sum += result.price * result.amount;
      return result;
    });

    // Если товар не был найден в корзине, то добавляем его из каталога
    if (!exists) {
      // Поиск товара в каталоге, чтобы его в корзину добавить
      const json = await this.services.api.request({
        url: `/api/v1/articles/${_id}`,
      });

      const item = json.result;
      items.push({ ...item, amount: amount });

      // Досчитываем сумму
      sum += item.price * amount;
    }

    // Установка состояние, basket тоже нужно сделать новым
    this.setState(
      {
        items,
        sum,
        amount: items.length,
      },
      "Добавление в корзину"
    );
  }

  /**
   * Добавление товара в корзину
   * @param _id Код товара
   */
  removeFromBasket(_id: string) {
    let sum = 0;
    const items = this.getState().items.filter((item) => {
      // Удаляемый товар
      if (item._id === _id) return false;
      // Подсчёт суммы если твоар не удаляем.
      sum += item.price * item.amount;
      return true;
    });
    this.setState(
      {
        items,
        sum,
        amount: items.length,
      },
      "Удаление из корзины"
    );
  }

  addSelected(id) {
    this.setState({
      ...this.getState(),
      selected: id,
    });
  }
}

export default BasketState;
