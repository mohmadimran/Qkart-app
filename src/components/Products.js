import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

const Products = () => {
  const [isLoading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [isDebounce, setDebounce] = useState(null);
  const [items, setItems] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");

  const performAPICall = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.endpoint}/products`);
      const isData = response.data;
      console.log("show product data",isData);
      setProductList(isData);
      setProductFilter(isData); // Filtered list
    } catch (error) {
      if (error.response && error.response.status === 500) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Network error or unexpected issue occurred", {
          variant: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => performAPICall(), []);

  const performSearch = async (text) => {
    if (!text) {
      setProductList(productFilter);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );

      setProductList(response.data); // Original list
      setProductFilter(response.data); // Filtered list
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setProductFilter([]);
        setProductList([]);
      } else if (error.response && error.response.status === 500) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
        setProductFilter(productList);
      } else {
        enqueueSnackbar("Network error or unexpected issue occurred", {
          variant: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      const res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(res.data);
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart(token).then((cartData) => {
        if (cartData) {
          setItems(generateCartItemsFrom(cartData, productList));
        }
      });
    }
  }, [token, productList]);

  const isItemInCart = (items, productId) => {
    return items.some((item) => item.productId === productId);
  };

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }

    // Check for duplicates if preventDuplicate is true
    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar("Item already in cart", { variant: "warning" });
      return;
    }

    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedCart = generateCartItemsFrom(response.data, products);
      setItems(updatedCart);

      // Persist cart in localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (e) {
      enqueueSnackbar("Error updating cart", { variant: "error" });
    }
  };

  const debounceSearch = (e, debounce) => {
    const text = e.target.value;
    if (debounce) {
      clearTimeout(debounce);
    }
    const timeDelay = setTimeout(() => {
      performSearch(text);
    }, 5000);
    setDebounce(timeDelay);
  };
  const handleQuantity = (productId, qty) => {
    if (qty < 1) {
      // Remove item from cart when quantity is 0
      addToCart(token, items, productList, productId, 0);
    } else {
      // Update item quantity in cart
      addToCart(token, items, productList, productId, qty);
    }
  };
  if (token) {
    return (
      <div>
        <Header>
          <TextField
            className="search-desktop"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            onChange={(event) => debounceSearch(event, isDebounce)}
          />
        </Header>
        {/* Search view for mobiles */}
        <TextField
          className="search-mobile"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(event) => debounceSearch(event, isDebounce)}
        />
        <Grid container spacing={2} sx={{ mt: 4, mb: 4 }}>
          <Grid item xs={12} md={9}>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s
                  <span className="hero-highlight">FASTEST DELIVERY</span>
                  to your door step
                </p>
              </Box>
            </Grid>
            <Grid container padding="1rem">
              {isLoading ? (
                <Grid
                  item
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    height: "100vh",
                    width: "100%",
                  }}
                >
                  <CircularProgress />
                  <p>Loading Products</p>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  {productFilter.length ? (
                    productFilter.map((product) => (
                      <Grid item xs={6} md={3} key={product._id}>
                        <ProductCard
                          product={product}
                          handleAddToCart={() =>
                            addToCart(
                              token,
                              items,
                              productList,
                              product._id,
                              1,
                              {
                                preventDuplicate: true,
                              }
                            )
                          }
                        />
                      </Grid>
                    ))
                  ) : (
                    <Grid
                      item
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        height: "100vh",
                        width: "100%",
                      }}
                    >
                      <SentimentDissatisfied />
                      <p>No products found</p>
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={3} bgcolor="#E9F5E1" sx={{ mt: 2 }}>
            <Cart
              product={productList}
              items={items}
              handleQuantity={handleQuantity}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
  return (
    <div>
      <Header>
        <TextField
          className="search-desktop"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(event) => debounceSearch(event, isDebounce)}
        />
      </Header>

      {/* Search view for mobiles */}

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event) => debounceSearch(event, isDebounce)}
      />
      <Grid container sx={{ mt: 4 }}>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>
              to your door step
            </p>
          </Box>
        </Grid>
      </Grid>
      <Grid container padding="2rem" spacing={2} sx={{ mt: 4, mb: 4 }}>
        {isLoading ? (
          <Grid
            item
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              height: "100vh",
              width: "100%",
            }}
          >
            <CircularProgress />
            <p>Loading Products</p>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {productFilter.length ? (
              productFilter.map((product) => (
                <Grid item xs={6} md={3} key={product._id}>
                  <ProductCard
                    product={product}
                    handleAddToCart={() =>
                      addToCart(token, items, productList, product._id, 1, {
                        preventDuplicate: true,
                      })
                    }
                  />
                </Grid>
              ))
            ) : (
              <Grid
                item
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                  height: "100vh",
                  width: "100%",
                }}
              >
                <SentimentDissatisfied />
                <p>No products found</p>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};
export default Products;
