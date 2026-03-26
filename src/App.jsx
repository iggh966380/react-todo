import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import "./App.css";

function App() {
  const [todoList, setTodoList] = useState([
    {
      todoContent: "",
      index: 1,
      id: 1,
      isAddMode: false,
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const todoTemplate = todoList.map((todo) => (
    <li className="d-flex bottom-l" key={todo.index}>
      {todo.isAddMode ? (
        <input
          type="text"
          onInput={(e) => {
            setUserInput(e.target.value);
          }}
        ></input>
      ) : (
        <div>
          {todo.todoContent ? todo.index : undefined}. {todo.todoContent}
        </div>
      )}
      <div>
        {todo.todoContent.length === 0 && !todo.isAddMode && (
          <button
            onClick={() => {
              setTodoList(
                todoList.map((t) =>
                  t.index === todo.index ? { ...t, isAddMode: true } : t,
                ),
              );
            }}
          >
            +新增
          </button>
        )}
        {todo.todoContent.length !== 0 ? (
          <div>
            <button
              onClick={() => {
                setTodoList(todoList.filter((t) => t.id !== todo.id));
              }}
            >
              編輯
            </button>
            <button
              onClick={() => {
                setTodoList(
                  todoList
                    .filter((t) => t.id !== todo.id)
                    .map((t, index) => ({ ...t, index: index + 1 })),
                );
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
                setTodoList([
                  ...todoList.map((t) =>
                    t.id === todo.id
                      ? { ...t, todoContent: userInput, isAddMode: false }
                      : t,
                  ),
                  {
                    todoContent: "",
                    id: Date.now(),
                    isAddMode: false,
                    index: todoList.length + 1,
                  },
                ]);
              }}
            >
              儲存
            </button>
            <button
              onClick={() => {
                setTodoList(
                  todoList.map((t) =>
                    t.id === todo.id ? { ...t, isAddMode: false } : t,
                  ),
                );
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
