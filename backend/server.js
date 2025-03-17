const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Clothes = require('./models/Clothes');
const Template = require('./models/Templates');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.set('debug', true);
console.log('Connecting to MongoDB:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DATABASE_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to MongoDB');})
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());



app.get('/api/clothes', async (req, res) => {
    try {
        const clothes = await Clothes.find();
        res.json(clothes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/clothes/:id', async (req, res) => {
    try {
        const clothes = await Clothes.findById(req.params.id);
        if (!clothes) {
            return res.status(404).json({ message: 'Clothes not found' });
        }
        res.json(clothes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/clothes', async (req, res) => {
    const { _id, clothesImage, name } = req.body;
    try {
        const clothes = new Clothes({ _id, clothesImage, name });
        const savedClothes = await clothes.save();
        console.log("Одяг збережено");
        res.status(201).json(savedClothes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/clothes/save', async (req, res) => {
    try {
        const { imageData, name } = req.body;
        
        if (!imageData || !name) {
            return res.status(400).json({ 
                success: false, 
                error: 'Image data and name are required' 
            });
        }

        const _id = Date.now();
        const clothes = new Clothes({
            _id,
            clothesImage: imageData,
            name
        });
        
        const savedClothes = await clothes.save();
        console.log('Design saved with ID:', _id);
        res.status(201).json({ success: true, id: _id, data: savedClothes });
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to save design: ' + error.message 
        });
    }
});

app.delete('/api/clothes/:id', async (req, res) => {
    try {
        await Clothes.findByIdAndDelete(req.params.id);
        res.json({ message: 'Clothes deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/templates', async (req, res) => {
    try {
        const templates = await Template.find();
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/templates', async (req, res) => {
    try {
        const { templateImage, type } = req.body;
        const _id = Date.now();
        
        const template = new Template({
            _id,
            templateImage,
            type
        });
        
        await template.save();
        res.status(201).json({ success: true, id: _id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// Запуск сервера
app.listen(PORT, () => console.log(`Server running on http://127.0.0.1:${PORT}`));
