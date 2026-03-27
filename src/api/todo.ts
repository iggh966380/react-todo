import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const getTodos = () => api.get("/todos");
export const createTodo = (content: string) => api.post("/todos", { content });
/**
 * @param id - todo的id
 * @param data.content - 新的todo content
 * @param data.isCompleted - todo 是否完成
 */
export const updateTodo = (
  id: number,
  data: { content?: string; isCompleted?: boolean },
) => api.put(`/todos/${id}`, data);
export const deleteTodo = (id: number) => api.delete(`/todos/${id}`);
