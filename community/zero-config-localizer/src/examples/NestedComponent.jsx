/**
 * React component example.
 *
 * @param {Object} props - Component props
 * @param {Object} props.product - Product object
 * @param {string} props.locale - Locale string for formatting
 * @param {string} props.currency - Currency code (e.g., 'USD', 'EUR')
 * @returns {JSX.Element}
 */

export default function NestedComponent({ product = {}, locale = 'en-US', currency = 'USD' }) {
    const formattedPrice = product.price 
      ? new Intl.NumberFormat(locale, { style: 'currency', currency }).format(product.price)
      : '';

    return (
      <article>
        <header>
          <h2>{product?.name}</h2>
          <span>SKU: {product?.sku}</span>
        </header>
        
        <div>
          <p>
            <strong>Description:</strong> {product?.description}
          </p>
          <p>
            <strong>Price:</strong> {formattedPrice}
          </p>
          <p>
            <strong>Stock:</strong> {product?.stock} items available
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