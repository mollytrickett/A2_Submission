1. User Authentication

* Register: POST /api/users/register
* Login: POST /api/users/login

2. Posts

* Create post: POST /api/posts (requires auth key token)
* Get all posts: GET /api/posts
* Update post: PUT /api/posts/:id (requires auth key token)
* Delete post: DELETE /api/posts/:id
