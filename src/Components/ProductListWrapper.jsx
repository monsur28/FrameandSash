import { useParams } from "react-router-dom";
import ProductList from "../Shared/ProductList";

const ProductListWrapper = () => {
  const { title } = useParams(); // Access the dynamic `title` parameter
  const products = []; // Replace with actual data or state
  const addProduct = (product) => {
    // Handle adding a new product
    console.log("Added product:", product);
  };

  return (
    <ProductList title={title} products={products} addProduct={addProduct} />
  );
};
export default ProductListWrapper;
