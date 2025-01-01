import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function App() {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const response = await axios.get('http://10.0.2.2:3000/todos');
        setTodos(response.data);
    };

    const addTodo = async () => {
        if (newTask.trim()) {
            try {
                const response = await axios.post('http://10.0.2.2:3000/todos', { task: newTask });
                setTodos([...todos, response.data]);
                setNewTask('');
            } catch (error) {
                console.error('Görev eklenirken hata oluştu:', error);
            }
        } else {
            alert('Görev adı boş olamaz.');
        }
    };
    

    const toggleComplete = async (id, completed) => {
        const response = await axios.put(`http://10.0.2.2:3000/todos/${id}`, { completed: !completed });
        setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
    };

    const deleteTodo = async id => {
        await axios.delete(`http://10.0.2.2:3000/todos/${id}`);
        setTodos(todos.filter(todo => todo._id !== id));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>To-Do List</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Yeni görev ekle"
                    value={newTask}
                    onChangeText={setNewTask}
                />
                <Button title="Ekle" onPress={addTodo} />
            </View>
            <FlatList
                data={todos}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View style={styles.todo}>
                        <TouchableOpacity onPress={() => toggleComplete(item._id, item.completed)}>
                            <Text style={item.completed ? styles.completed : styles.task}>{item.task}</Text>
                        </TouchableOpacity>
                        <Button title="Sil" onPress={() => deleteTodo(item._id)} />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 ,  backgroundColor: '#FFFFFF',},
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    inputContainer: { flexDirection: 'row', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', flex: 1, marginRight: 10, padding: 10 },
    todo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    task: { fontSize: 18 },
    completed: { fontSize: 18, textDecorationLine: 'line-through', color: 'gray' },
});
