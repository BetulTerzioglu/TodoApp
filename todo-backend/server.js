const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Bağlantısı
mongoose.connect('mongodb+srv://betult18:VAkFmxPO3SZKmDJV@cluster0.jiept.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const todoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

// CRUD İşlemleri
app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/todos', async (req, res) => {
    const newTodo = new Todo({
        task: req.body.task,
        completed: false,
    });
    await newTodo.save();
    res.json(newTodo);
});

app.put('/todos/:id', async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        { completed: req.body.completed },
        { new: true }
    );
    res.json(updatedTodo);
});

app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo silindi' });
});

app.listen(3000, () => console.log('Sunucu 3000 portunda çalışıyor.'));
