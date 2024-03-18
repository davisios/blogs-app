import './App.css';
import { useEffect, useState } from 'react';
import { deleteBlog, getBlogs } from './services/blogService';
import dayjs from 'dayjs';

function App() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getBlogs()
      .then((data) => {
        const validBlogs = data.data.filter((blog) => blog.valid);
        setBlogs(validBlogs);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDeleteBlog = (id, e) => {
    e.preventDefault();
    deleteBlog(id).then(() => {
      setBlogs(blogs.filter((blog) => blog._id !== id));
    });
  };

  return (
    <>
      <div class="font-mono w-full h-52 bg-slate-700 content-center flex items-center">
        <div className="ml-6 mcontent-center  items-center">
          <h1 class="text-white text-7xl  my-0">HN Feed</h1>
          <h3 class="text-white text-xl">We &lt;3 love hacker news!</h3>
        </div>
      </div>
      {blogs.map((blog) => {
        const date = dayjs(blog.created_at);
        const now = dayjs();
        let dateToShow = '';
        if (now.isSame(date, 'day')) {
          dateToShow = date.format('h:mm A');
        } else if (now.subtract(1, 'day').isSame(date, 'day')) {
          dateToShow = 'Yesterday';
        } else if (now.diff(date, 'day') < 2) {
          dateToShow = date.format('MMM DD');
        } else {
          dateToShow = date.format('YYYY MMMM D');
        }
        return (
          <div class=" cursor-pointer mx-4  bg-[#fff] hover:bg-[#fafafa]  border-2 border-x-transparent border-t-transparent border-[#ccc">
            <div class="flex mx-3 my-5">
              <span class="flex-1 w-70 text-red-200 text-[#333]">
                {blog.title} - <span class="text-[#999]">{blog.author}</span>-
              </span>
              <div class="flex-none w-22">{dateToShow}</div>
              <div class="flex-none w-12"></div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                onClick={(e) => handleDeleteBlog(blog._id, e)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default App;
