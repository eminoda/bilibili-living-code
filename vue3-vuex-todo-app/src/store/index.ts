import { createStore } from "vuex";

import todo from "./modules/todo";
import type { TodoState } from "./modules/todo";

export interface RootState {
  todo: TodoState;
}

export default createStore<RootState>({
  modules: {
    todo,
  },
});
