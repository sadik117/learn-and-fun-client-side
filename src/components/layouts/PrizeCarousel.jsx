import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const PrizeCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prizeItems = [
    {
      image: "https://i.ibb.co.com/LznDvsLk/ai-generated-8702591-1280.jpg",
    },
    {
      image:
        "https://i.ibb.co.com/ycnG8RX9/games-1363219-1280.jpg",
    },
    {
      image:
        "https://i.ibb.co.com/MxzFRBjH/people-8598066-1280.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % prizeItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-8 px-4 sm:px-5 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Play & Win Amazing Prizes
          </h2>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Turn your learning achievements into lottery tickets. Win cash
            prizes, gadgets, and exclusive rewards.
          </p>
          <p className="text-md text-gray-600 max-w-2xl mx-auto mt-2">
            The more you learn, the more chances you get!
          </p>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden rounded-xl shadow-xl max-w-4xl mx-auto bg-white">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {prizeItems.map((item, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <img
                  src={item.image}
                  alt={`Prize ${index + 1}`}
                  className="w-full h-72 object-cover rounded-t-xl"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Try Your Luck Button */}
        <div className="text-center mt-8">
          <Link to="/playNwin" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition duration-300">
            Try Your Luck
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PrizeCarousel;
