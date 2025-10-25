import React, { useState } from "react";

const faqs = [
  {
    question: "Learn and Earn কি?",
    answer:
      "Learn and Earn হলো এমন একটি প্রক্রিয়া যেখানে মানুষ অনলাইন স্কিল শিখে সেই স্কিল ব্যবহার করে আয় করতে পারে।",
  },
  {
    question: "Learn and Earn থেকে কিভাবে আয় করা যায়?",
    answer:
      "প্রথমে স্কিল শিখতে হয়, যেমন Graphic Design, Web Development অথবা Digital Marketing। এরপর Fiverr, Upwork বা Freelancing প্ল্যাটফর্মে কাজ করে আয় করা যায়।",
  },
  {
    question: "Learn and Earn কি স্ক্যাম করতে পারে?",
    answer:
      "Learn and Earn হলো decentralized সাইড, এই সাইডের কোনো মালিক নেই। আপনি একাউন্ট খুললে আপনিও এর মালিক হবেন তাই এটি কখনো বন্ধ হবে না, এবার আপনি বলতে পারেন মালিক নেই চলে কিভাবে, এটি চালায় মূলত Blockchain তাই এটা আজীবন এর জন্য বন্ধ হবে না। এই সাইডে আপনি নির্ধারিত কোনো বেতন পাবেন না, যত বেশি কাজ করবেন তত বেশি ইনকাম করতে পারবেন।",
  },
  {
    question: "কোন স্কিল দিয়ে বেশি ইনকাম করা যায়?",
    answer:
      "Popular স্কিল যেমন Web Development, Video Editing, Graphic Design, UI/UX Design এবং Content Writing দিয়ে ভালো ইনকাম সম্ভব।",
  },
  {
    question: "কে শিখতে পারে?",
    answer:
      "যে কেউ — ছাত্র-ছাত্রী, চাকরিজীবী বা গৃহিণী — যার শেখার ইচ্ছা ও সময় আছে সে এই প্রক্রিয়ায় অংশ নিতে পারে।",
  },
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 text-gray-800">

      {/* Page Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-5">
          Q&A
        </h1>
        <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">
          প্রশ্ন ও উত্তর
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Learn and Earn সম্পর্কে সবচেয়ে বেশি করা প্রশ্ন ও উত্তর এখানে দেওয়া
          হলো।
        </p>
      </div>

      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`border border-gray-200 rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl ${
              openIndex === index ? "ring-2 ring-purple-200" : ""
            }`}
          >
            {/* Question */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left px-6 py-5 flex justify-between items-center transition-colors duration-200 hover:bg-purple-50 rounded-2xl"
            >
              <span className="font-semibold text-lg md:text-xl text-gray-800 pr-4">
                {faq.question}
              </span>
              <span
                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                  openIndex === index
                    ? "bg-purple-100 text-purple-600 rotate-180"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                openIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
