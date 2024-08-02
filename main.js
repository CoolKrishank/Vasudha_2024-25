let model;
let imgElement = document.getElementById('uploadedImage');
let statusElement = document.getElementById('status');
let predictionElement = document.getElementById('prediction');

// Load Teachable Machine model
async function loadModel() {
    const URL = 'https://teachablemachine.withgoogle.com/models/EctizHrLx/';
    try {
        model = await tmImage.load(URL + 'model.json', URL + 'metadata.json');
        statusElement.innerHTML = "Status: Model Loaded";
    } catch (error) {
        console.error('Error loading model:', error);
        statusElement.innerHTML = "Status: Error loading model";
    }
}

function predict() {
    if (!model) {
        statusElement.innerHTML = "Status: Model not loaded";
        return;
    }

    let file = document.getElementById('upload').files[0];
    if (!file) {
        statusElement.innerHTML = "Status: No image selected";
        return;
    }

    // Display the uploaded image
    let reader = new FileReader();
    reader.onload = function(event) {
        imgElement.src = event.target.result;
        imgElement.style.display = 'block';
        imgElement.onload = classifyImage;
    }
    reader.readAsDataURL(file);
}

async function classifyImage() {
    if (!model) {
        statusElement.innerHTML = "Status: Model not loaded";
        return;
    }

    try {
        // Create an image element
        const image = document.createElement('img');
        image.src = imgElement.src;

        // Wait for the image to load
        await new Promise((resolve) => {
            image.onload = () => resolve();
        });

        // Perform the classification
        const predictions = await model.predict(image);
        if (predictions.length > 0) {
            // Display all predictions
            let predictionsHtml = predictions.map(prediction => {
                return `<p>${prediction.className} - ${Math.round(prediction.probability * 100)}%</p>`;
            }).join('');
            predictionElement.innerHTML = predictionsHtml;
            statusElement.innerHTML = "Status: Prediction complete";
        } else {
            predictionElement.innerHTML = "No predictions";
            statusElement.innerHTML = "Status: Prediction failed";
        }
    } catch (error) {
        console.error('Error during prediction:', error);
        statusElement.innerHTML = "Status: Error during prediction";
    }
}

// Load the model when the page is ready
document.addEventListener('DOMContentLoaded', loadModel);
