import React, { useState, useEffect } from "react";
import "./todo.css";

const TodoList = () => {
  const [query, setQuery] = useState("");
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  // Load data from localStorage when the component mounts (on page load)
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      console.log("Stored Todos:", storedTodos);
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save data to localStorage whenever the todos state changes
  useEffect(() => {
    console.log("Todos Updated:", todos);
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Save completed tasks to localStorage whenever the completedTodos state changes
  useEffect(() => {
    console.log("Completed Todos Updated:", completedTodos);
    localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
  }, [completedTodos]);

  const handleChange = () => {
    if (query.trim() !== "") {
      const newTodo = {
        task: query,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        completed: false,
        isEditing: false,
      };
      setTodos((e) => [...e, newTodo]);
      setQuery("");
    }
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleRemove = (index) => {
    if (window.confirm("Do you want to delete this task?")) {
      const updatedTodos = todos.filter((todo, i) => i !== index);
      setTodos(updatedTodos);
    }
  };

  const toggleCompleted = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;

    if (updatedTodos[index].completed) {
      setCompletedTodos((prevCompleted) => [
        ...prevCompleted,
        updatedTodos[index],
      ]);
    } else {
      setCompletedTodos((prevCompleted) =>
        prevCompleted.filter((todo) => todo !== updatedTodos[index])
      );
    }

    setTodos(updatedTodos);
  };

  const handleEdit = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].isEditing = true;
    setTodos(updatedTodos);
  };

  const handleSave = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].isEditing = false;
    updatedTodos[index].updatedAt = new Date().toISOString();
    setTodos(updatedTodos);
  };

  const handleComplete = () => {
    setShowCompleted(true);
  };

  const handleShowAll = () => {
    setShowCompleted(false);
  };

  return (
    <div className="container">
      <h2 className="header">Todo App</h2>
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleChange} className="btn-add">
          Add
        </button>
      </div>
      <div className="btn-all">
        <button onClick={handleShowAll}>All</button>
        <button onClick={handleComplete}>Completed</button>
      </div>
      <div className="task-info">
        {todos.map((todo, index) => (
          <div
            key={index}
            style={{
              display: showCompleted
                ? todo.completed
                  ? "block"
                  : "none"
                : "block",
            }}
          >
            {todo.isEditing ? (
              <div>
                <input
                  type="text"
                  value={todo.task}
                  onChange={(e) => {
                    const updatedTodos = [...todos];
                    updatedTodos[index].task = e.target.value;
                    setTodos(updatedTodos);
                  }}
                />
                <button className="btn-save" onClick={() => handleSave(index)}>
                  Save
                </button>
              </div>
            ) : (
              <span
                className={`task-data ${todo.completed ? "completed" : ""}`}
                onClick={() => toggleCompleted(index)}
              >
                {todo.completed ? (
                  <i className="fas fa-check-circle"></i>
                ) : null}
                {todo.task}
              </span>
            )}
            <button className="btn" onClick={() => handleRemove(index)}>
              x
            </button>
            {!todo.isEditing && (
              <button className="btn-edit" onClick={() => handleEdit(index)}>
                Edit
              </button>
            )}
            <p className="date">Created At: {formatTime(todo.createdAt)}</p>
            {todo.updatedAt && (
              <p className="date">Updated At: {formatTime(todo.updatedAt)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
