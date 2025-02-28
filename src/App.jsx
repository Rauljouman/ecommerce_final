import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import ProductDetails from "./components/ProductDetails";
import { Box, CssBaseline } from "@mui/material";
import { db } from "./firebaseConfig";
import SidebarFilters from "./components/SidebarFilters";
import { collection, getDocs } from "firebase/firestore";

const Success = () => <h1>Pagament completat!</h1>;
const Cancel = () => <h1>El pagament s'ha cancel·lat.</h1>;

const App = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Product"));
        const productList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Producto sin nombre",
            category: data.category || "Sin categoría",
            price: parseFloat(data.price) || 0,
            stock: parseInt(data.stock, 10) || 0,
            imageURL: data.imageURL || "",
            description: data.description || "",
          };
        });

        console.log("Productos obtenidos de Firestore:", productList);
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (error) {
        console.error("Error obteniendo productos desde Firestore:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Router>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner />
                <Box sx={{ display: "flex", gap: 2, p: 2 }}>
                  {/* 🔥 SidebarFilters ahora actualiza filteredProducts */}
                  <SidebarFilters
                    products={products}
                    setFilteredProducts={setFilteredProducts}
                  />
                  <ProductGrid products={filteredProducts} />
                </Box>
              </>
            }
          />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
        </Routes>
        <Footer />
      </Box>
    </Router>
  );
};

export default App;
