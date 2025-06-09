import 'katex/dist/katex.min.css';
import { useEffect, useState } from 'react';
import useGetToDoList from '../../api/Dashboard/ToDoList/useGetToDoList';
import usePostAddToDoList from '../../api/Dashboard/ToDoList/usePostAddToDoList';
import usePostDeleteToDoList from '../../api/Dashboard/ToDoList/usePostDeleteToDoList';
import usePostEditToDoList from '../../api/Dashboard/ToDoList/usePostEditToDoList';

type todoItem = {
    itemId: string;
    text: string;
    completed: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<todoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const userId = localStorage.getItem("user") ?? "";

  const {data: detail, refetch} = useGetToDoList(userId);
  const addToDo = usePostAddToDoList();
  const editToDo = usePostEditToDoList();
  const deleteTodo = usePostDeleteToDoList();

  useEffect(() => {
    setTodos(detail?.data?.todoItems ?? []);
  }, [detail]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo = {
      itemId: detail?.data.todoItems.length ? (detail?.data.todoItems.length + 1).toString() : "1",
      text: newTodo,
      completed: false,
    };

    const payload = {
      userId: userId,
      toDoItem: todo
    }
    addToDo.mutate(payload, {
      onSuccess: () => {
        refetch();
        console.log("sukses");
        setNewTodo("");
      }
    })
  };

  const updateTodo = (updated: todoItem) => {
    const payload = {
      userId,
      toDoItem: updated, // assuming API expects an array
    };
  
    editToDo.mutate(payload, {
      onSuccess: () => {
        refetch(); // refresh the list
      }
    });
  };

  const removeTodo = (itemId: string) => {
    deleteTodo.mutate({userId, itemId}, {
        onSuccess: () => {
          refetch();
        }
    })
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5 border border-gray-200 mx-auto w-full">
        <div className="mb-4 flex gap-2 w-full">
            <input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="border px-2 py-1 w-full"
              placeholder="Add a new task"
            />
            <button onClick={addTodo} className="bg-blue-500 text-white px-3">Add</button>
        </div>
        <ul className="space-y-2 h-[200px] overflow-y-auto scrollbar-thin">
          {todos.map((todo) => (
            <li key={todo.itemId} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
              />
              <span
                className={`flex-1 ${todo.completed ? "line-through text-gray-500" : "text-black"}`}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const updatedText = e.currentTarget.textContent || '';
                  if (updatedText !== todo.text) {
                    updateTodo({ ...todo, text: updatedText });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevent new line
                    const updatedText = e.currentTarget.textContent || '';
                    if (updatedText !== todo.text) {
                      updateTodo({ ...todo, text: updatedText });
                    }
                    e.currentTarget.blur(); // Optional: blur after saving
                  }
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.itemId)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default TodoList;
