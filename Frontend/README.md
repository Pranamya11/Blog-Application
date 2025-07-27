# Blog Frontend

A simple React blog application with the following features:

- View all blog posts
- Create new blog posts
- Read individual blog posts
- Edit existing blog posts
- Delete blog posts

## Features

- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean and intuitive user interface
- **Real-time Updates**: Immediate feedback on user actions
- **Error Handling**: Proper error messages and loading states

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── header.jsx          # Navigation header
│   ├── blogList.jsx        # List of all blog posts
│   ├── BlogPost.jsx        # Individual blog post view
│   └── CreatePost.jsx      # Create new post form
├── api.js                  # API service functions
├── App.jsx                 # Main app component
├── App.css                 # Main styles
└── main.jsx               # App entry point
```

## API Endpoints

The frontend connects to a backend API at `http://localhost:3000/api`:

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

## Technologies Used

- React 19
- React Router DOM
- Axios for API calls
- Vite for build tooling
- CSS for styling
