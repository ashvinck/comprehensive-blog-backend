# Comprehensive-Blog API
- This API allows you to perform CRUD (Create, Read, Update, Delete) operations on for a blog app.
- It utilizes MongoDB for storing Posts Data and MySQL for user information.
- Only users who are authorized can view latest posts.

## Node.js & Express
- The API is built using Node.js and the Express framework. 
- TypeScript is used for type safety in the Node.js application.

## API Endpoints
### GET /api/posts
Retrieve a list of all blog posts.
#### Response
```json
[
  {
    "_id": "1",
    "title": "Sample Blog Post",
    "content": "This is the content of the blog post.",
    "created_at": "2023-10-03T12:00:00Z",
    "updated_at": "2023-10-03T12:00:00Z",
    "category": ["Technology","AI"]
  },
  {
    "_id": "2",
    "title": "Another Blog Post",
    "content": "This is another blog post content.",
    "created_at": "2023-10-02T13:00:00Z",
    "updated_at": "2023-10-02T13:00:00Z",
    "category": ["Technology"]
  }
]
```

### GET /api/posts/:id
Retrieve a specific blog post by its ID.
#### Response
```json
 {
    "_id": "2",
    "title": "Another Blog Post",
    "content": "This is another blog post content.",
    "created_at": "2023-10-02T13:00:00Z",
    "updated_at": "2023-10-02T13:00:00Z",
    "category": ["Technologyl"]
  }
```

### POST /api/posts
Create a new blog post. The request body should contain title, content, and category_id.
#### Request Body
```json
{
  "title": "New Blog Post",
  "content": "This is the content of the new blog post.",
  "category_id": ["work", "code"]
}
```
### PUT /api/posts/:id
Update an existing blog post by its ID.
#### Request Body
```json
{
  "title": "New Blog Post",
  "content": "This is the content of the new blog post.",
  "category_id": ["work", "coding","AI"]
}
```
### DELETE /api/posts/:id
Delete a blog post by its ID.
#### Response
```json
{
  "message": "Blog post  has been deleted successfully."
}
```

### GET /api/posts/latest (Authorized Users Only)
Retrieve the latest blog post from each unique category. Only authorized users have access to this endpoint.
#### Response
```json
  {
    "_id": "1",
    "title": "Sample Blog Post",
    "content": "This is the content of the blog post.",
    "created_at": "2023-10-03T12:00:00Z",
    "updated_at": "2023-10-03T12:00:00Z",
    "category": ["Technology","AI"]
  }
```

  
