import './App.css';
import { useEffect } from 'react';
import { getBlogs } from './services/blogService';
function App() {
  useEffect(() => {
    getBlogs().then((data) => console.log('data', data));
  }, []);

  return <div className="App">Just a test</div>;
}

export default App;
