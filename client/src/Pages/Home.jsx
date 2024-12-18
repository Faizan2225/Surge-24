import Banner from "../components/Layout/Banner";
import Modal from "../components/Layout/Modal";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="hero bg-base-200">
        <Banner />
      </header>

      {/* Features Section */}
      <section className="bg-base-100 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Why Choose Us?</h2>
          <p className="text-gray-600">
            Our platform offers everything you need to succeed.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-12">
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h3 className="text-xl font-bold">Feature 1</h3>
              <p>Describe your first amazing feature here!</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h3 className="text-xl font-bold">Feature 2</h3>
              <p>Highlight another key functionality that stands out.</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h3 className="text-xl font-bold">Feature 3</h3>
              <p>Wrap it up with one more compelling reason to choose you.</p>
            </div>
          </div>
        </div>
      </section>

      <Modal />

      {/* Call-To-Action (CTA) */}
      <section className="bg-primary text-primary-content py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg my-4">
            Take the first step toward building something amazing with us.
          </p>
          <button className="btn btn-secondary">Join Now</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
