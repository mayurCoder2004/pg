import React, { useEffect, useState } from "react";
import axios from "axios";
import PGCard from "../components/PGCard";

const Home = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterFood, setFilterFood] = useState("All");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/pgs`);
        setPgs(res.data);
      } catch (err) {
        setError("Failed to load PGs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPGs();
  }, []);

  const filteredPGs = pgs.filter((pg) => {
    const matchesSearch = pg.pgName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFood = filterFood === "All" || pg.foodType === filterFood;
    return matchesSearch && matchesFood;
  });

  const handleWhatsAppContact = () => {
    window.open("https://chat.whatsapp.com/HuFjutDXnBOKumF1oZFIZB", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Find Your Perfect PG
          </h1>
          <p className="text-gray-600 text-lg">
            Discover comfortable accommodations tailored to your needs
          </p>
        </div>

        {/* Important Notice Card */}
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl p-6 mb-8 shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-amber-800 font-semibold text-lg mb-2">Important Considerations</h3>
              <p className="text-amber-700 leading-relaxed">
                <span className="font-medium">Cons for joining NRI and Indian hostel:</span><br />
                11 month (2sem) + 9:30 closing time + food limitations
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 backdrop-blur-sm border border-white/20">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-1/2 lg:w-2/5">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search PG by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 placeholder-gray-500"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative w-full md:w-1/2 lg:w-1/4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
              </div>
              <select
                value={filterFood}
                onChange={(e) => setFilterFood(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 appearance-none bg-white cursor-pointer"
              >
                <option value="All">All Food Types</option>
                <option value="Veg">Vegetarian</option>
                <option value="Non-Veg">Non-Vegetarian</option>
                <option value="Veg/Non Veg">Both Veg & Non-Veg</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Results Counter */}
            {!loading && !error && (
              <div className="hidden lg:block text-sm text-gray-600 whitespace-nowrap">
                <span className="font-semibold text-blue-600">{filteredPGs.length}</span> PGs found
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading amazing PGs for you...</p>
            <p className="text-gray-500 text-sm mt-2">This won't take long</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-red-800 font-semibold text-lg mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* PG Grid */}
        {!loading && !error && (
          <>
            {/* Mobile Results Counter */}
            <div className="lg:hidden mb-4 text-center">
              <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                {filteredPGs.length} PGs found
              </span>
            </div>

            {filteredPGs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPGs.map((pg, index) => (
                  <div 
                    key={pg._id}
                    className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <PGCard pg={pg} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="flex justify-center mb-4">
                  <svg className="h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No PGs Found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  We couldn't find any PGs matching your search criteria. Try adjusting your filters or search terms.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setSearch("")}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Clear Search
                  </button>
                  <button
                    onClick={() => setFilterFood("All")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer Stats */}
        {!loading && !error && pgs.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 text-sm text-gray-600 border border-gray-200">
              <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>
                Showing <strong>{filteredPGs.length}</strong> of <strong>{pgs.length}</strong> available PGs
              </span>
            </div>
          </div>
        )}

        {/* Contact Us WhatsApp Button */}
        <div className="mt-16 mb-8 text-center">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 border border-green-200 shadow-lg">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Need Help Finding the Perfect PG?</h3>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Join our WhatsApp community to get personalized recommendations, ask questions, 
                and connect with other students looking for accommodation.
              </p>
            </div>
            
            <button
              onClick={handleWhatsAppContact}
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
            >
              <svg 
                className="h-6 w-6 group-hover:animate-bounce" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.108"/>
              </svg>
              <span className="text-lg">Contact Us on WhatsApp</span>
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              Get instant responses • Join our community • Free guidance
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .grid > div {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Home;