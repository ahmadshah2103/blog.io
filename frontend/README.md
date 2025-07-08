# Blog.io - Modern Blogging Platform

A modern, social blogging platform built with Next.js and Mantine UI.

## Features

### Core Functionality
- ✅ **User Authentication** (Login/Register)
- ✅ **Responsive Design** with Mantine UI
- ✅ **State Management** with Zustand
- ✅ **API Integration** with React Query
- ✅ **Form Validation** with Yup schemas

### Planned Features
- 🚧 **User Profiles** with avatar, bio, and blog listings
- 🚧 **Blog Creation & Editing** with rich text editor
- 🚧 **Social Features** (Like, Comment, Follow/Unfollow)
- 🚧 **Feed System** (All blogs vs Following only)
- 🚧 **Search Functionality** 
- 🚧 **Blog Categories & Tags**

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **UI Library**: Mantine UI
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Form Handling**: Mantine Form + Yup validation
- **HTTP Client**: Axios
- **Icons**: Tabler Icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env.local file
NEXT_PUBLIC_API_BASE_URL=your_api_base_url
```

3. Run development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
├── layouts/          # Layout components
├── hooks/            # Custom React hooks
├── store/            # Zustand store configuration
├── services/         # API services
├── utils/            # Utility functions
├── schemas/          # Form validation schemas
└── constants/        # App constants and theme
```

## Clean Architecture

This codebase has been cleaned up to remove dashboard/analytics specific code and is now ready for blogging platform development. The following reusable components have been preserved:

- Authentication system
- Layout components
- Form handling
- State management
- API client setup
- UI components (buttons, loaders, modals)

## Next Steps

1. Set up backend API endpoints for blogs
2. Implement blog creation/editing functionality
3. Add user profile management
4. Implement social features (likes, comments, follows)
5. Add search and filtering capabilities
