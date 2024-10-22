import { useState, useEffect } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    // 模擬從伺服器獲取 TodoList
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
                setTodos(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTodos();
    }, []);

    // 新增任務並串接 API (async/await)
    const addTodo = async () => {
        if (newTodo.trim() === '') return;

        const todo = {
            title: newTodo,
            completed: false
        };

        try {
            const response = await axios.post('https://jsonplaceholder.typicode.com/todos', todo);
            setTodos([...todos, { ...response.data, id: todos.length + 1 }]); // 更新本地的 todos
            setNewTodo(''); // 清空輸入框
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    // 刪除任務並串接 API (async/await)
    const deleteTodo = async (id) => {
        try {
            await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
            const updatedTodos = todos.filter(todo => todo.id !== id); // 過濾出要刪除的項目
            setTodos(updatedTodos);
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <div className="App">
            <h1>Todo List</h1>

            <div className="p-inputgroup" style={{ marginBottom: '10px' }}>
                <InputText
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task"
                />
                <Button label="Add" icon="pi pi-plus" onClick={addTodo} />
            </div>

            <ListBox
                value={todos}
                options={todos}
                optionLabel="title"
                itemTemplate={(todo) => (
                    <div className="p-d-flex p-ai-center p-jc-between">
                        <span>{todo.title}</span>
                        <Button
                            icon="pi pi-trash"
                            className="p-button-danger p-button-sm"
                            onClick={() => deleteTodo(todo.id)}
                        />
                    </div>
                )}
                style={{ width: '100%' }}
            />
        </div>
    );
}

export default App;
