import Review from "../components/Layout/Review";
import Rating from "../components/Layout/Rating";
import Modal from "../components/Layout/Modal";

const ProductPage = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <div className="w-full lg:w-1/2">
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src="https://via.placeholder.com/600x400"
                alt="Product"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl font-bold mb-2">Product Title</h1>
            <div className="flex items-center gap-2 mb-4">
              <Rating disabled={true}></Rating>
              <span className="text-gray-500">(45 reviews)</span>
            </div>
            <p className="text-xl font-semibold text-primary mb-4">$129.99</p>
            <p className="text-gray-700 mb-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
              commodi deserunt consectetur labore minima, nihil eveniet ea
              repellat ad aliquam!
            </p>

            {/* Buttons */}
            <div className="flex gap-4 mb-6">
              <button className="btn btn-primary">Buy Now</button>
              <button className="btn btn-secondary">Add to Cart</button>
            </div>

            {/* Additional Info */}
            <div className="bg-base-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Product Details</h3>
              <ul className="list-disc ml-6">
                <li>Feature 1: Amazing build quality</li>
                <li>Feature 2: Long-lasting durability</li>
                <li>Feature 3: Stylish and modern design</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <Modal />
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <div className="flex flex-col gap-6">
            {/* Review 1 */}
            <Review name="Ali" desc="Review" />
            <Review name="Ali" desc="Review" />
            <Review name="Ali" desc="Review" />
            <Review name="Ali" desc="Review" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
