export default function NestedComponent({ product }) {
    return (
      <article>
        <header>
          <h2>{product.name}</h2>
          <span>SKU: {product.sku}</span>
        </header>
        
        <div>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>Price:</strong> ${product.price}
          </p>
          <p>
            <strong>Stock:</strong> {product.stock} items available
          </p>
        </div>
  
        <footer>
          <button>Add to Cart</button>
          <button>Save for Later</button>
        </footer>
      </article>
    );
  }
  
  // Lingo.dev Compiler understands context:
  // - "Description:", "Price:", "Stock:" are labels - translated together
  // - Product data (name, sku, price) stays dynamic
  // - Button text maintains action semantics
  // - "items available" gets pluralization handled automatically