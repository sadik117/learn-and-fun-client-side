import React, { useState, useEffect } from "react";

const faqs = [
  {
    id: 1,
    question: "Learn and Earn কি?",
    answer:
      "Learn and Earn হলো এমন একটি প্রক্রিয়া যেখানে মানুষ অনলাইন স্কিল শিখে সেই স্কিল ব্যবহার করে আয় করতে পারে।",
    category: "general"
  },
  {
    id: 2,
    question: "Learn and Earn থেকে কিভাবে আয় করা যায়?",
    answer:
      "প্রথমে স্কিল শিখতে হয়, যেমন Graphic Design, Web Development অথবা Digital Marketing। এরপর Fiverr, Upwork বা Freelancing প্ল্যাটফর্মে কাজ করে আয় করা যায়।",
    category: "earning"
  },
  {
    id: 3,
    question: "Learn and Earn কি স্ক্যাম করতে পারে?",
    answer:
      "Learn and Earn হলো decentralized সাইড, এই সাইডের কোনো মালিক নেই। আপনি একাউন্ট খুললে আপনিও এর মালিক হবেন তাই এটি কখনো বন্ধ হবে না, এবার আপনি বলতে পারেন মালিক নেই চলে কিভাবে, এটি চালায় মূলত Blockchain তাই এটা আজীবন এর জন্য বন্ধ হবে না। এই সাইডে আপনি নির্ধারিত কোনো বেতন পাবেন না, যত বেশি কাজ করবেন তত বেশি ইনকাম করতে পারবেন।",
    category: "trust"
  },
  {
    id: 4,
    question: "কোন স্কিল দিয়ে বেশি ইনকাম করা যায়?",
    answer:
      "Popular স্কিল যেমন Web Development, Video Editing, Graphic Design, UI/UX Design এবং Content Writing দিয়ে ভালো ইনকাম সম্ভব।",
    category: "skills"
  },
  {
    id: 5,
    question: "কে শিখতে পারে?",
    answer:
      "যে কেউ — ছাত্র-ছাত্রী, চাকরিজীবী বা গৃহিণী — যার শেখার ইচ্ছা ও সময় আছে সে এই প্রক্রিয়ায় অংশ নিতে পারে।",
    category: "eligibility"
  },
];

const GoogleFaqPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState(faqs);
  const [showResults, setShowResults] = useState(false);

  // Filter FAQs based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFaqs(faqs);
      setShowResults(false);
    } else {
      const query = searchQuery.toLowerCase();
      const results = faqs.filter(
        faq => 
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query) ||
          faq.category.toLowerCase().includes(query)
      );
      setFilteredFaqs(results);
      setShowResults(true);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowResults(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Google-style Header */}
      <header className="flex justify-end p-4">
        <div className="flex items-center space-x-4">
          <button className="text-sm text-gray-700 hover:underline">Gmail</button>
          <button className="text-sm text-gray-700 hover:underline">Images</button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
            A
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center mt-8 px-4">
        {/* Google Logo */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-center">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
          </h1>
          <p className="text-center text-gray-500 mt-2 text-lg">Learn & Earn FAQ Search</p>
        </div>

        {/* Search Box */}
        <div className="w-full max-w-2xl mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center border border-gray-300 hover:shadow-lg rounded-full px-4 py-3 transition-shadow duration-200">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Learn and Earn সম্পর্কে জানুন..."
                className="w-full focus:outline-none text-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex justify-center mt-6 space-x-4">
              <button 
                type="submit" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded text-sm transition-colors"
              >
                Google Search
              </button>
              <button 
                type="button" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded text-sm transition-colors"
              >
                I'm Feeling Lucky
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {showResults && (
          <div className="w-full max-w-3xl">
            <div className="text-gray-600 text-sm mb-4">
              About {filteredFaqs.length} results found
            </div>
            
            {filteredFaqs.length > 0 ? (
              <div className="space-y-8">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-start space-x-2 mb-1">
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <a href="#" className="block">
                      <h3 className="text-xl text-blue-600 hover:underline font-medium mb-2">
                        {faq.question}
                      </h3>
                    </a>
                    <p className="text-green-700 text-sm mb-2">
                      https://learn-earn.faq.com/{faq.category}/{faq.id}
                    </p>
                    <p className="text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-500">
                  Try different keywords or browse all FAQs below
                </p>
              </div>
            )}
          </div>
        )}

        {/* All FAQs Section (shown when no search or empty search) */}
        {!showResults && (
          <div className="w-full max-w-4xl mt-12">
            <h2 className="text-2xl font-medium text-gray-800 mb-6">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq) => (
                <div 
                  key={faq.id} 
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSearchQuery(faq.question);
                    setShowResults(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Searches */}
        {showResults && filteredFaqs.length > 0 && (
          <div className="w-full max-w-3xl mt-12">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Related searches</h3>
            <div className="flex flex-wrap gap-3">
              {["freelancing", "online income", "digital skills", "blockchain", "web development"].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-16 border-t border-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="text-center text-gray-500 text-sm">
            <p>Bangladesh</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm text-gray-600">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Advertising</a>
              <a href="#" className="hover:underline">Business</a>
              <a href="#" className="hover:underline">How Search works</a>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GoogleFaqPage;