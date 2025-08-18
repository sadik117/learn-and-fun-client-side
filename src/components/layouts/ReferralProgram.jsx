import React from 'react';
import { FaUserFriends, FaGraduationCap, FaMoneyBillWave, FaShareAlt } from 'react-icons/fa';
import { Link } from 'react-router';

const ReferralProgram = () => {
  const steps = [
    {
      number: "1",
      icon: <FaUserFriends className="text-3xl text-blue-600" />,
      title: "Invite Friends",
      description: "Share your unique referral code and invite friends to join the learning revolution."
    },
    {
      number: "2",
      icon: <FaGraduationCap className="text-3xl text-purple-600" />,
      title: "They Learn",
      description: "Your friends start learning and completing courses at their own pace."
    },
    {
      number: "3",
      icon: <FaMoneyBillWave className="text-3xl text-green-600" />,
      title: "You Both Earn",
      description: "Earn 10% of their course rewards plus bonus lottery tickets for successful referrals."
    },
    {
      number: "4",
      icon: <FaShareAlt className="text-3xl text-orange-600" />,
      title: "Start Referring",
      description: "Get you referral link now. Don't miss the benefit."
    }
  ];

  return (
    <section className="py-8 px-4 -mt-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Invite Friends & Earn Together
          </h2>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Build your learning network and earn passive income. Get rewarded when your friends learn and achieve milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {step.number}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              {step.description && (
                <p className="text-gray-600 mb-4">{step.description}</p>
              )}
              
              {index === 3 && (
                <Link to="myprofile" className="mt-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition duration-300 w-full">
                  Get Referral Link
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300">
            Learn More About Referrals
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReferralProgram;