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
    const dayEmojis = {
        pzt: "😺",
        sal: "😸",
        car: "😹",
        per: "😻",
        cum: "😽",
        cts: "😼",
        paz: "🐱"
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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="todo-card">
                <div className="card-header">
                    😺 KEDY'S TODO LIST 🌸
                </div>
                
                <div className="p-6">
                    {/* Gün butonları */}
                    <div className="flex justify-between mb-6 space-x-1">
                        {days.map(day => (
                            <button
                                key={day}
                                onClick={() => fetchDayTodos(day)}
                                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                                    selectedDay === day 
                                    ? 'bg-pink-500 text-white transform scale-110' 
                                    : 'bg-pink-100 hover:bg-pink-200'
                                }`}
                            >
                                <span className="text-xl mb-1">{dayEmojis[day]}</span>
                                <span className="text-xs">{day.toUpperCase()}</span>
                            </button>
                        ))}
                    </div>

                    {/* Todo ekleme formu */}
                    <form onSubmit={addTodo} className="mb-6">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="✨ Yeni görev..."
                                className="flex-1 px-4 py-2 rounded-lg border-2 border-pink-200 focus:outline-none focus:border-pink-500"
                            />
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                            >
                                Ekle ✨
                            </button>
                        </div>
                    </form>

                    {/* Todo listesi */}
                    {loading ? (
                        <div className="text-center text-pink-500 py-4">
                            😺 Yükleniyor...
                        </div>
                    ) : todos.length === 0 ? (
                        <div className="text-center text-pink-400 py-4 bg-pink-50 rounded-lg">
                            😿 Henüz görev yok...
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {todos.map(todo => (
                                <li 
                                    key={todo._id}
                                    className="flex items-center p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => toggleTodo(todo._id, todo.completed)}
                                        className="w-4 h-4 mr-3 accent-pink-500"
                                    />
                                    <span className={`flex-1 ${todo.completed ? 'line-through text-pink-300' : ''}`}>
                                        {todo.text}
                                    </span>
                                    <button
                                        onClick={() => deleteTodo(todo._id)}
                                        className="ml-2 text-pink-400 hover:text-pink-600"
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
