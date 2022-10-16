import StateModule from "@src/store/module";

/**
 * Состояние корзины
 */
class CanvasState extends StateModule {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      delta: { x: 0, y: 0 },
      scale: 0,
      rectangles: [],
      triangles: [],
      circles: [],
      animationLifeTime: 0,
    };
  }

  addCoordinates(type, coordinates, index, timeDifference) {
    this.setState({
      ...this.getState(),
      [type]: [
        ...this.getState()[type],
        [...coordinates, { index, timeDifference }],
      ],
    });
  }

  changeDelta(x, y) {
    this.setState({
      ...this.getState(),
      delta: { x: this.getState().delta.x + x, y: this.getState().delta.y + y },
    });
  }

  changeScale(value) {
    this.setState({
      ...this.getState(),
      scale: this.getState().scale + value,
    });
  }
  changeTime(value) {
    this.setState({
      ...this.getState(),
      animationLifeTime: value,
    });
  }
}

export default CanvasState;
