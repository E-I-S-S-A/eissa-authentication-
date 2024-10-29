import React from 'react';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Auth from './pages/Auth/Auth';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth/>,
  },
]);


function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
