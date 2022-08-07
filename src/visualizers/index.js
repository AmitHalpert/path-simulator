import { animatePath } from "./algorithms.visualizer";

export { animatePath };

export const setVisualizationState = (klass) => {
  klass.setState({ isVisualizing: false  });
}