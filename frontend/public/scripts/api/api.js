class ClothingAPI {
    static compressImage(base64String) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64String;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Reduce max dimensions
                const MAX_WIDTH = 600;
                const MAX_HEIGHT = 600;
                
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                ctx.drawImage(img, 0, 0, width, height);
                // Increase compression by reducing quality
                resolve(canvas.toDataURL('image/jpeg', 0.5));
            };
        });
    }

    static async saveCanvas() {
        const canvas = document.getElementById('designCanvas');
        if (!canvas) {
            console.error('Canvas element not found');
            alert('Error: Canvas not found');
            return;
        }
    
        const name = prompt('Enter design name:');
        if (!name) return;
    
        try {
            const originalImage = canvas.toDataURL('image/png');
            const compressedImage = await this.compressImage(originalImage);
            
            const response = await fetch('http://localhost:5000/api/clothes/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageData: compressedImage,
                    name
                })
            });
    
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to save design');
            }
            
            if (data.success) {
                alert('Design saved successfully!');
                return data.id;
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Error saving design: ' + (error.message || 'Unknown error'));
            return null;
        }
    }

    static async getClothes() {
        try {
            const response = await fetch('http://localhost:5000/api/clothes');
            return await response.json();
        } catch (error) {
            console.error('Error fetching clothes:', error);
            return [];
        }
    }

    static async saveTemplate(templateImage, type) {
        try {
            const response = await fetch('http://localhost:5000/api/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    templateImage,
                    type
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error saving template:', error);
            throw error;
        }
    }

    static async getTemplates() {
        try {
            const response = await fetch('http://localhost:5000/api/templates');
            return await response.json();
        } catch (error) {
            console.error('Error fetching templates:', error);
            return [];
        }
    }

    static async getClothesById(id) {
        try {
            const response = await fetch(`http://localhost:5000/api/clothes/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching clothes details:', error);
            throw error;
        }
    }
}

// Add event listener
document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveCanvas');
    if (saveButton) {
        saveButton.addEventListener('click', () => ClothingAPI.saveCanvas());
    }
});