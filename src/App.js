import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [selectedDay, setSelectedDay] = useState('pzt');
    const [loading, setLoading] = useState(false);

    const days = ['pazartesi', 'sali', 'carsamba', 'persembe', 'cuma', 'cumartesi', 'pazar'];
    const dayEmojis = {
        pazartesi: "😺",
        sali: "😸",
        carsamba: "😹",
        persembe: "😻",
        cuma: "😽",
        cumartesi: "😼",
        pazar: "🐱"
    };

    useEffect(() => {
        fetchDayTodos('pzt');
    }, []);

    const fetchDayTodos = async (day) => {
        setLoading(true);
        setSelectedDay(day);
        try {
            const response = await axios.get(`/todos/${day}`);
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
        setLoading(false);
    };

    const addTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.trim() || !selectedDay) return;

        try {
            const response = await axios.post('/todos', {
                text: newTodo,
                day: selectedDay
            });
            setTodos([...todos, response.data]);
            setNewTodo('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const toggleTodo = async (id, completed) => {
        try {
            await axios.put(`/todos/${id}`, {
                completed: !completed
            });
            setTodos(todos.map(todo => 
                todo._id === id ? { ...todo, completed: !completed } : todo
            ));
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`/todos/${id}`);
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <div className="container">
            <div className="todo-window">
                <div className="window-header">
                    <div className="window-title">😺 KEDY'S TODO LIST 🌸</div>
                    <div className="window-buttons">
                        <div className="window-button"></div>
                        <div className="window-button"></div>
                        <div className="window-button"></div>
                    </div>
                </div>

                <div className="todo-content">
                    <div className="window-icons">
                        {days.map(day => (
                            <button
                                key={day}
                                onClick={() => fetchDayTodos(day)}
                                className={`icon ${selectedDay === day ? 'active' : ''}`}
                            >
                                <span className="emoji-icon">
                                    {dayEmojis[day]}
                                </span>
                                <span className="icon-text">
                                    {day.slice(0,3).toUpperCase()}
                                </span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={addTodo} className="flex gap-2">
                        <input
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            placeholder="✨ Yeni görev ekle..."
                            className="todo-input"
                        />
                        <button type="submit" className="add-button">
                            ADD ✨
                        </button>
                    </form>

                    {loading ? (
                        <div className="error-window">😺 Loading...</div>
                    ) : todos.length === 0 ? (
                        <div className="error-window">
                            😿 NO TASKS YET...
                        </div>
                    ) : (
                        <ul className="mt-4">
                            {todos.map(todo => (
                                <li key={todo._id} className="todo-item">
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => toggleTodo(todo._id, todo.completed)}
                                        className="checkbox"
                                    />
                                    <span className={todo.completed ? 'line-through text-pink-300' : ''}>
                                        {todo.text}
                                    </span>
                                    <button
                                        onClick={() => deleteTodo(todo._id)}
                                        className="ml-auto text-pink-400"
                                    >
                                        🗑️
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
