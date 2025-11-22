import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";
import AllProducts from "./components/AllProducts/AllProducts.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";
import Register from "./components/Register/Register.jsx";
import MyProducts from "./components/MyProducts/MyProducts.jsx";
import MyBids from "./components/MyBids/MyBids.jsx";
import ProductDetails from "./components/ProductDetails/ProductDetails.jsx";
import PrivateRoute from "./Routes/PrivateRoute.jsx";
import CreateAProduct from "./components/CreateAProduct/CreateAProduct.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        Component: Home,
        index: true,
      },
      {
        path: "allproducts",
        Component: AllProducts,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "myProducts",
        element: (
          <PrivateRoute>
            <MyProducts></MyProducts>
          </PrivateRoute>
        ),
      },
      {
        path: "myBids",
        element: (
          <PrivateRoute>
            <MyBids></MyBids>
          </PrivateRoute>
        ),
      },
      {
        path: "productDetails/:id",
        loader: async ({ params }) => {
          const response = await fetch(`http://localhost:3000/products/${params.id}`);
          return response.json();
        },
        element: (
          <PrivateRoute>
            <ProductDetails></ProductDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "createAProduct",
        element: (
          <PrivateRoute>
            <CreateAProduct></CreateAProduct>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
