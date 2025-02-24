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

    const days = ['pzt', 'sal', 'car', 'per', 'cum', 'cts', 'paz'];

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
            <div className="todo-app">
                <div className="day-buttons">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => fetchDayTodos(day)}
                            className={selectedDay === day ? 'active' : ''}
                        >
                            {day}
                        </button>
                    ))}
                </div>
                <form onSubmit={addTodo}>
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Yeni görev..."
                    />
                    <button type="submit">Ekle</button>
                </form>
                {loading ? (
                    <div>Yükleniyor...</div>
                ) : (
                    <ul>
                        {todos.map(todo => (
                            <li key={todo._id}>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo._id, todo.completed)}
                                />
                                <span className={todo.completed ? 'completed' : ''}>
                                    {todo.text}
                                </span>
                                <button onClick={() => deleteTodo(todo._id)}>Sil</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default App;
