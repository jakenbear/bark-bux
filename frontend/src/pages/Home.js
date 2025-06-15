import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  // Get the auth token from context to determine if user is logged in
  const { token } = useAuth();

  // Steps outlining how to earn and redeem Bark Bux points
  const steps = [
    {
      title: "Earn Bark Bux",
      description:
        "Get points every time you shop for pet supplies, share cute pet pics, or refer furry friends!",
    },
    {
      title: "Browse Rewards",
      description:
        "From squeaky toys to gourmet treats, pick rewards your pet will love.",
    },
    {
      title: "Redeem & Celebrate",
      description:
        "Cash in your Bark Bux and watch your pup’s tail wag with joy!",
    },
  ];

  // Fun tips to encourage user engagement, displayed in a carousel
  const tips = [
    "Post a pic of your pet in a Bark Bux bandana for 50 bonus points!",
    "Check daily deals to stretch your Bark Bux further.",
    "Join our monthly pet parade contest for a chance to win 500 Bark Bux!",
    "Refer a friend and both of you get 100 Bark Bux to spend on treats.",
  ];

  // State to keep track of the currently displayed tip index in the carousel
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // useEffect to auto-advance the tips carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Increment index, loop back to 0 after last tip
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [tips.length]);

  // Handler to jump to a specific tip when user clicks the carousel dots
  const goToTip = (index) => {
    setCurrentTipIndex(index);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
      {/* Hero Section with logo, main heading, description, and call-to-action button */}
      <section className="bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 text-center">
        <img
          src="/bblogo.png"
          alt="Bark Bux Logo"
          className="mx-auto mb-4 w-32 sm:w-40 lg:w-48 h-auto animate-[bounce_2s_infinite] opacity-90"
        />
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          Unleash the Fun with Bark Bux!
        </h2>
        <p className="text-lg sm:text-xl mb-6">
          Earn points by being a pawsome pet parent, then redeem them for
          tail-wagging rewards!
        </p>

        {/* Button links to rewards page if logged in, otherwise to login */}
        <Link
          to={token ? "/rewards" : "/login"}
          className="bg-yellow-400 text-blue-900 font-semibold py-3 px-6 rounded-full hover:bg-yellow-500 hover:scale-105 transition-all duration-300"
        >
          Start Redeeming Now
        </Link>
      </section>

      {/* How to Redeem Section */}
      <section className="mb-12">
        <h3 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-800">
          How to Redeem Your Bark Bux
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Map over steps to display each step with title and description */}
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <h4 className="text-xl font-bold text-blue-600 mb-2">
                Step {index + 1}: {step.title}
              </h4>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fun Tips Carousel */}
      <section className="mb-12">
        <h3 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-800">
          Fun Tips to Maximize Your Bark Bux
        </h3>
        <div className="relative overflow-hidden bg-gray-100 rounded-lg p-6">
          {/* Container holding all tips side by side; translateX slides tips horizontally */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentTipIndex * 100}%)` }}
          >
            {/* Each tip takes full width */}
            {tips.map((tip, index) => (
              <div
                key={index}
                className="min-w-full text-center text-lg text-gray-700"
              >
                <p>{tip}</p>
              </div>
            ))}
          </div>

          {/* Carousel navigation dots */}
          <div className="flex justify-center mt-4">
            {tips.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTip(index)}
                aria-label={`Show tip ${index + 1}`} // Accessibility label
                className={`h-3 w-3 rounded-full mx-1 ${
                  currentTipIndex === index ? "bg-blue-600" : "bg-gray-300"
                } hover:bg-blue-400 transition-colors`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="text-center bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
          Ready to Make Your Pet’s Day?
        </h3>
        {/* Alternative: Uncomment to add logo here */}
        {/* <img src="/bblogo.png" alt="Bark Bux Logo" className="mx-auto mb-4 w-24 h-auto opacity-80 hover:scale-110 transition-transform duration-300" /> */}
        
        {/* Button linking to profile if logged in, otherwise login */}
        <Link
          to={token ? "/profile" : "/login"}
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 hover:scale-105 transition-all duration-300 animate-pulse"
        >
          See Your Profile
        </Link>
      </section>
    </div>
  );
}

export default Home;
