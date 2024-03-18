# Starting the app

- in the root directory do docker compose build
- then docker compose up

Open [http://localhost:3000](http://localhost:3000) to view it in browser

This will show the web page with a single blog, which will be refreshed every hour, if you want to add manual blogs follow the instructions bellow

**Note: HOW TO ADD BLOGS**

The server is a rest api, which includes updating, posting, get by id and get all

if you want to add blogs, you need to make a post request to (http://localhost:5000/blogs/) with the following json as body
{
"created_at": "2021-03-11T21:38:36Z",
"objectID": "1",
"title": "Example Blog Title",
"author": "John Doe",
"story_url": "someurl.com"
}

## Available endpoints

- POST http://localhost:5000/blogs/
  if you want to add blogs, you need to make a post request to (http://localhost:5000/blogs/) with the following json as body
  {
  "created_at": "2021-03-11T21:38:36Z",
  "objectID": "1",
  "title": "Example Blog Title",
  "author": "John Doe",
  "story_url": "someurl.com"
  }

- GET http://localhost:5000/blogs/
  get the current blogs

- GET by ID http://localhost:5000/blogs/:blogId
  This will return the blog by id, the id can be obtained from the list in the get request that return all the blogs

- PUT by ID http://localhost:5000/blogs/:blogId
  This will update the blog by id, you can update onlu the title, author and story_url, you would need to pass the following data as the body ( not all the props are required, you can pass just the one you want to update)
  {
  "title": "Example Blog Title22",
  "author": "John Doe2",
  "story_url": "Example story_text result3333"
  }

- Delete by ID http://localhost:5000/blogs/:blogId
  This will set the blog valid as false so the FE does not display it
