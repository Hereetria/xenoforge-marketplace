# My Teaching Page

This page provides instructors with a comprehensive dashboard for managing their courses.

## Features

### Course Creation Form (Left Side)
- **Course Information**: Title, description, thumbnail URL with random generator
- **Course Details**: Price, level, duration (in hours)
- **Random Thumbnail**: Button to generate random software-related thumbnail URLs
- **Form Validation**: Uses Zod schema validation with react-hook-form
- **API Integration**: Creates courses via `/api/courses/create`

### My Courses List (Right Side)
- **Course Overview**: Displays all instructor's courses
- **Filtering**: Filter by All, Published, or Draft courses
- **Course Cards**: Show thumbnail, title, description, pricing, level, duration, enrollment count, and ratings
- **Status Badges**: Visual indicators for course level, publication status, and featured status
- **Action Buttons**: Edit, Analytics, Publish/Unpublish functionality
- **Real-time Updates**: Automatically refreshes when new courses are created
- **API Integration**: Fetches courses via `/api/courses/my-courses`

## Design System
- **Dark Theme**: Consistent with the overall application design
- **Color Scheme**: Uses the established color palette (`#1C1F2A`, `#2A2D3A`, `#F5B301`, `#6B7280`)
- **Responsive Layout**: Two-column layout on large screens, stacked on mobile
- **Component Consistency**: Uses the same UI components as other pages

## API Endpoints

### POST `/api/courses/create`
Creates a new course for the authenticated instructor.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "thumbnail": "string (optional)",
  "price": "number",
  "level": "BEGINNER | INTERMEDIATE | EXPERT",
  "duration": "number (hours)"
}
```

### GET `/api/courses/my-courses`
Fetches all courses created by the authenticated instructor.

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "shortDescription": "string",
    "thumbnail": "string",
    "price": "number",
    "originalPrice": "number",
    "level": "string",
    "language": "string",
    "duration": "number",
    "isPublished": "boolean",
    "isFeatured": "boolean",
    "enrollments": "number",
    "rating": "number",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

## Components

- `MyTeachingHeader`: Page header with title and description
- `CreateCourseForm`: Comprehensive course creation form
- `MyCoursesList`: Course management and display component

## Navigation
The page is accessible via the "My Teaching" link in the main navigation bar.
