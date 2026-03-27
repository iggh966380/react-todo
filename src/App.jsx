import { useEffect, useState } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api/todo.ts";
import "./App.css";

const createEmptyTodo = (length) => {
  return {
    todoContent: "",
    id: Date.now(),
    isAddMode: false,
    index: length,
    inputValue: "",
  };
};

const formatTodos = (todos) =>
  todos
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((t, i) => ({
      todoContent: t.content,
      id: t.id,
      isCompleted: t.isCompleted,
      isAddMode: false,
      inputValue: "",
      index: i + 1,
    }));

function App() {
  const [todoList, setTodoList] = useState([createEmptyTodo(1)]);
  useEffect(() => {
    getTodos().then((res) => {
      setTodoList([...formatTodos(res.data), createEmptyTodo(2)]);
    });
  }, []);
  const onDeleteTodo = async (id) => {
    await deleteTodo(id);
    const newTodo = await getTodos();
    setTodoList([
      ...formatTodos(newTodo.data).map((t, i) => ({ ...t, index: i + 1 })),
      createEmptyTodo(1),
    ]);
  };
  const saveTodo = async (todo) => {
    const isNew = todo.todoContent.length === 0;
    if (isNew) {
      todo.todoContent = todo.inputValue;
      await createTodo(todo.todoContent);
    } else {
      await updateTodo(todo.id, {
        content: todo.inputValue,
        isCompleted: todo.isCompleted,
      });
    }
    const res = await getTodos();
    setTodoList([
      ...formatTodos(res.data),
      createEmptyTodo(todoList.length + 1),
    ]);
    console.log(todoList);
  };

  const updateLocal = (id, changes) => {
    setTodoList(todoList.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  };

  const setToDoComplete = async (todo, completed) => {
    updateLocal(todo.id, { isCompleted: completed });

    try {
      await updateTodo(todo.id, {
        isCompleted: completed,
      });
    } catch {
      updateLocal(todo.id, { isCompleted: !completed });
      alert("更新失敗");
    }
  };
  const todoTemplate = todoList.map((todo) => (
    <li className="d-flex bottom-l" key={todo.id}>
      {todo.isAddMode ? (
        <input
          type="text"
          onInput={(e) => {
            updateLocal(todo.id, { inputValue: e.target.value });
          }}
          value={todo.inputValue ?? todo.todoContent}
        ></input>
      ) : (
        <div>
          {todo.todoContent.length > 0 ? (
            <input
              type="checkbox"
              onClick={(e) => {
                setToDoComplete(todo, e.target.checked);
              }}
            />
          ) : undefined}{" "}
          {todo.todoContent ? `${todo.index}.` : undefined}
          <span className={`todo-item ${todo.isCompleted ? "completed" : ""}`}>
            {todo.todoContent}
          </span>
        </div>
      )}
      <div>
        {todo.todoContent.length === 0 && !todo.isAddMode && (
          <button
            onClick={() => {
              updateLocal(todo.id, { isAddMode: true });
            }}
          >
            +新增
          </button>
        )}
        {todo.todoContent.length !== 0 && !todo.isAddMode ? (
          <div>
            <button
              onClick={() => {
                updateLocal(todo.id, {
                  isAddMode: true,
                  inputValue: todo.todoContent,
                });
              }}
            >
              編輯
            </button>
            <button
              onClick={() => {
                onDeleteTodo(todo.id);
              }}
            >
              刪除
            </button>
          </div>
        ) : undefined}
        {todo.isAddMode ? (
          <div>
            <button
              onClick={() => {
                saveTodo(todo);
              }}
            >
              儲存
            </button>
            <button
              onClick={() => {
                updateLocal(todo.id, { isAddMode: false });
              }}
            >
              取消
            </button>
          </div>
        ) : undefined}
      </div>
    </li>
  ));

  return (
    <>
      <h1>This is a Todo app</h1>
      {todoTemplate}
    </>
  );
}

export default App;
