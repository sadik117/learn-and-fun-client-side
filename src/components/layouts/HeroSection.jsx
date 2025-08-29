import React from 'react';
import { Link } from 'react-router-dom';


const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-5">
            <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              <span className="block">Learn Skills.</span>
              <span className="block">Win Rewards.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Have Fun!
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-lg">
              Master in-demand skills through interactive courses and earn rewards while learning. 
              Join thousands of learners who are turning their passion into profit.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-3">
              <Link 
                to="/auth/signup" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold text-center hover:shadow-lg transition duration-300"
              >
                Join Now
              </Link>
              <Link 
                to="/learn" 
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-semibold text-center hover:bg-blue-50 transition duration-300"
              >
                Browse Courses
              </Link>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="w-full flex justify-center">
            <img 
              src="https://i.ibb.co.com/WWwp08zq/istockphoto-1182223823-1024x1024.jpg" 
              alt="Hero Pic"
              className="w-full h-60 md:h-80 max-w-md rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
