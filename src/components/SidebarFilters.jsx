import React, { useState, useEffect } from "react";
import { Box, Slider, Checkbox, Typography, Stack, FormGroup, FormControlLabel } from "@mui/material";

const SidebarFilters = ({ products, setFilteredProducts }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [...new Set(products.map((product) => product.category))];

  useEffect(() => {
    if (products.length > 0) {
      const maxPrice = Math.max(...products.map((p) => p.price));
      setPriceRange([0, maxPrice]); 
    }
  }, [products]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const withinPriceRange =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);

      return withinPriceRange && matchesCategory;
    });

    setFilteredProducts(filtered);
  }, [priceRange, selectedCategories, products, setFilteredProducts]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.name;
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <Box sx={{ width: 250, position: "sticky", top: 100, bgcolor: "white", borderRadius: 2, boxShadow: 3, p: 2 }}>
      <Typography variant="h6" sx={{ fontSize: 16, fontWeight: "bold" }}>
        Filtrar Productos
      </Typography>

      <Typography variant="subtitle2" sx={{ mt: 1, fontSize: 14, fontWeight: "bold" }}>
        Rango de Precios (€)
      </Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={Math.max(...products.map((p) => p.price), 1000)}
        step={1}
        sx={{ width: "100%" }}
      />
      <Typography variant="body2">
        €{priceRange[0]} - €{priceRange[1]}
      </Typography>

      <Typography variant="subtitle2" sx={{ mt: 2, fontSize: 16, fontWeight: "bold" }}>
        Categorías
      </Typography>
      <FormGroup>
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                checked={selectedCategories.includes(category)}
                onChange={handleCategoryChange}
                name={category}
              />
            }
            label={category}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default SidebarFilters;
