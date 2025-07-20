# Modern Todo App Setup Guide

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd todo-backend
python start_server.py
```
The backend will be available at `http://localhost:8000`

### 2. Start the Frontend Development Server
```bash
cd todo-frontend
bun install  # Install dependencies if not already done
bun dev      # Start the development server
```
The frontend will be available at `http://localhost:5173`

## ✨ Features

### Modern UI Design
- **Gradient Backgrounds**: Beautiful gradient backgrounds for visual appeal
- **Glass Morphism**: Modern card designs with subtle shadows and borders
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### Todo Management
- ✅ **Add Todos**: Create new todos with priority levels and due dates
- 🔍 **Search**: Real-time search with debouncing
- 🏷️ **Filter**: Filter by all, active, or completed todos
- ✏️ **Edit**: Inline editing of todo items
- 🗑️ **Delete**: Remove todos with confirmation
- 📅 **Due Dates**: Set and track due dates with overdue indicators
- 🎯 **Priority Levels**: High, Medium, Low priority with color coding

### Advanced Features
- 📊 **Statistics Dashboard**: Visual progress tracking with charts
- 🔄 **Real-time Updates**: Automatic refresh of stats and data
- 🎨 **Priority Color Coding**: Visual priority indicators
- ⏰ **Overdue Detection**: Automatic detection and highlighting of overdue items
- 📱 **Mobile Responsive**: Optimized for all screen sizes

## 🎨 Design System

### Color Palette
- **Primary**: Indigo to Purple gradient
- **Success**: Green tones for completed items
- **Warning**: Yellow/Orange for medium priority and overdue
- **Danger**: Red tones for high priority and delete actions
- **Neutral**: Gray scale for secondary elements

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with focus states
- **Icons**: Heroicons for consistent iconography

## 🛠️ Tech Stack

### Frontend
- **React 19**: Latest React with modern hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS 4**: Utility-first CSS framework
- **Heroicons**: Beautiful SVG icons
- **Bun**: Fast package manager and runtime

### Backend
- **FastAPI**: Modern Python web framework
- **SQLite**: Lightweight database
- **Pydantic**: Data validation
- **CORS**: Cross-origin resource sharing enabled

## 📁 Project Structure

```
todo-frontend/
├── src/
│   ├── components/
│   │   ├── AddTodoForm.jsx     # Form for adding new todos
│   │   ├── TodoList.jsx        # List container for todos
│   │   ├── TodoItem.jsx        # Individual todo item
│   │   ├── TodoForm.jsx        # Edit form for todos
│   │   ├── SearchBar.jsx       # Search functionality
│   │   ├── TodoStats.jsx       # Statistics dashboard
│   │   └── FilterTabs.jsx      # Filter tabs component
│   ├── hooks/
│   │   └── useTodos.js         # Custom hook for todo operations
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── package.json
└── vite.config.js
```

## 🔧 Customization

### Themes
You can easily customize the color scheme by modifying the Tailwind classes in the components. The main color variables are:
- Primary: `indigo-*` and `purple-*`
- Success: `green-*`
- Warning: `yellow-*` and `orange-*`
- Danger: `red-*`

### Adding Features
The modular component structure makes it easy to add new features:
1. Create new components in `src/components/`
2. Add API calls to `src/hooks/useTodos.js`
3. Update the main App component to include new features

## 🐛 Troubleshooting

### Common Issues
1. **Backend not running**: Make sure the backend server is started first
2. **CORS errors**: Check that the backend CORS settings include your frontend URL
3. **Dependencies**: Run `bun install` to ensure all dependencies are installed
4. **Port conflicts**: Change the port in vite.config.js if needed

### Development Tips
- Use browser dev tools to inspect API calls
- Check the backend logs for any errors
- Use React DevTools for component debugging
- Tailwind CSS IntelliSense extension for better development experience

## 📝 API Integration

The frontend integrates with the backend API using the following endpoints:
- `GET /api/todos/` - Fetch all todos
- `POST /api/todos/` - Create new todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo
- `PATCH /api/todos/{id}/toggle` - Toggle completion
- `GET /api/todos/search/` - Search todos
- `GET /api/todos/stats/` - Get statistics

All API calls include proper error handling and loading states for a smooth user experience.