# AI Email Generator

A modern, responsive web application that generates professional emails using AI powered by Hugging Face's free Inference API with the open source Mistral-7B-Instruct-v0.2 model.

## Features

- **Beautiful Modern UI**: Glassmorphism design with smooth animations
- **Light & Dark Mode**: Toggle between themes with persistent preference
- **Comprehensive Input Options**:
  - Recipient & Sender names
  - Subject line
  - Email purpose
  - Key points to include
  - Multiple tone options (Professional, Friendly, Formal, Casual, Persuasive, Apologetic, Thank You)
  - Email length selection (Short, Medium, Long)
  - Language selection
  - Additional instructions
- **Action Buttons**:
  - Generate Email
  - Regenerate (with same settings)
  - Copy to clipboard
  - Download as TXT file
  - Clear form
- **Editable Output**: Generated email appears in an editable text editor
- **Loading Animation**: Visual feedback during AI generation
- **Error Handling**: Graceful error messages for API failures
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **No Local Setup Required**: Uses cloud-based free API

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python Flask
- **AI Model**: Hugging Face Inference API (Mistral-7B-Instruct-v0.2 - Open Source)
- **No Database Required**

## Project Structure

```
ai-website-generator/
│
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── style.css         # Modern CSS with glassmorphism
│   └── script.js         # Frontend JavaScript logic
└── .gitignore           # Git ignore file
```

## Installation

### Prerequisites

1. **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
2. **Git** (optional) - For cloning the repository
3. **Internet Connection** - Required for Hugging Face API

### Step 1: Install Python Dependencies

Open your terminal/command prompt and navigate to the project directory:

```bash
cd ai-website-generator
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

This will install:
- Flask 3.0.0
- requests 2.31.0

### Step 2: Run the Flask Application

Navigate to the project directory and start the Flask app:

```bash
python app.py
```

You should see:

```
Starting AI Email Generator...
Using Hugging Face Free Inference API (Mistral-7B-Instruct-v0.2)
No local setup required - works with internet connection
 * Running on http://0.0.0.0:5000
```

### Step 3: Access the Application

Open your web browser and navigate to:

```
http://localhost:5000
```

**That's it!** No local AI setup required. The application uses Hugging Face's free Inference API.

## Usage

1. **Fill in the form**:
   - Enter recipient name (required)
   - Enter sender name (required)
   - Enter subject (required)
   - Enter email purpose (required)
   - Add key points (optional)
   - Select tone (default: Professional)
   - Select length (default: Medium)
   - Enter language (default: English)
   - Add additional instructions (optional)

2. **Click "Generate Email"**:
   - The AI will generate an email based on your inputs
   - A loading animation will appear during generation
   - The generated email will appear in the editor

3. **Edit the email**:
   - Click on the generated email to edit it
   - Make any changes you want

4. **Use action buttons**:
   - **Regenerate**: Generate a new email with the same settings
   - **Copy**: Copy the email to clipboard
   - **Download**: Download the email as a TXT file
   - **Clear**: Reset the form and output

5. **Toggle theme**:
   - Click the moon/sun icon in the header to switch between light and dark mode

## API Endpoint

### POST /generate

Generate an email using Ollama AI.

**Request Body:**

```json
{
  "recipient": "John Doe",
  "sender": "Jane Smith",
  "subject": "Meeting Request",
  "purpose": "Request a meeting to discuss project",
  "points": "Discuss timeline, budget, and deliverables",
  "tone": "Professional",
  "length": "Medium",
  "language": "English",
  "instructions": "Include availability for next week"
}
```

**Response:**

```json
{
  "email": "Dear John Doe,\n\nI hope this email finds you well...",
  "error": null
}
```

**Error Response:**

```json
{
  "error": "Ollama API error: 503"
}
```

## Troubleshooting

### "Could not connect to Ollama" Error

**Solution**: Ensure Ollama is running with `ollama serve` in a separate terminal.

### "No email generated" Error

**Solution**: 
- Verify the model is pulled: `ollama pull llama3.2:3b`
- Check Ollama server logs for errors
- Ensure you have sufficient system resources

### Port 5000 Already in Use

**Solution**: 
- Stop any other application using port 5000
- Or modify the port in `app.py` (line 97):
  ```python
  app.run(debug=True, host='0.0.0.0', port=5001)
  ```

### Model Not Found Error

**Solution**: Pull the model again:
```bash
ollama pull llama3.2:3b
```

## Development

### Running in Debug Mode

The application runs in debug mode by default. To disable debug mode for production:

```python
# In app.py, change line 97 to:
app.run(debug=False, host='0.0.0.0', port=5000)
```

### Customizing the AI Model

To use a different Ollama model:

1. Pull the desired model:
   ```bash
   ollama pull <model-name>
   ```

2. Update the model in `app.py` (line 12):
   ```python
   OLLAMA_MODEL = "<model-name>"
   ```

### Styling Customization

Edit `static/style.css` to customize:
- Colors (CSS variables at the top)
- Animations
- Layout
- Responsive breakpoints

## License

This project is open source and available under the ISC License.

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Ensure Ollama is running properly
3. Verify all dependencies are installed
4. Check browser console for JavaScript errors

## Acknowledgments

- **Ollama** - For providing the local AI model
- **Flask** - Python web framework
- **Font Awesome** - Icon library

---

**Enjoy generating professional emails with AI! 🚀**
