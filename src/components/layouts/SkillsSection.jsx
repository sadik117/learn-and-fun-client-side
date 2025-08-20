import React from 'react';

const SkillsSection = () => {
  const courses = [
    { name: 'Digital Marketing', icon: '📈' },
    { name: 'Graphics Design', icon: '🎨' },
    { name: 'UI/UX', icon: '🖌️' },
    { name: 'Web Design', icon: '💻' },
  ];

  return (
    <section className="py-8 px-6 sm:px-8 lg:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Master In-Demand Skills
          </h2>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Choose from our carefully curated courses designed by industry experts.
          </p>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Learn at your own pace and earn rewards for every milestone.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="text-4xl mb-4">{course.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition duration-300">
            View All Courses
          </button>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;