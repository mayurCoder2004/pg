import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [pg, setPg] = useState({
    pgName: "",
    location: "",
    price: "",
    sharing: "",
    foodType: "",
    amenities: "",
  });
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [pgs, setPgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Protect admin page & fetch PGs
  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }

    const fetchPGs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/pgs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPgs(res.data);
      } catch (err) {
        console.error("Error fetching PGs:", err);
      }
    };

    fetchPGs();
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(pg).forEach(([key, value]) => formData.append(key, value));
    photos.forEach((file) => formData.append("photos", file));
    videos.forEach((file) => formData.append("videos", file));

    try {
      const res = await axios.post("http://localhost:5000/pgs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("PG Added ✅");
      setPg({
        pgName: "",
        location: "",
        price: "",
        sharing: "",
        foodType: "",
        amenities: "",
      });
      setPhotos([]);
      setVideos([]);

      // Add new PG to list
      setPgs([...pgs, res.data.pg]);
    } catch (err) {
      console.error("Error adding PG:", err);
      alert("❌ Failed to add PG");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PG?")) return;

    setIsDeleting(id);
    try {
      await axios.delete(`http://localhost:5000/pgs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPgs(pgs.filter((pg) => pg._id !== id));
      alert("PG Deleted ✅");
    } catch (err) {
      console.error("Error deleting PG:", err);
      alert("❌ Failed to delete PG");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
                <p className="text-gray-600 text-sm">Manage PG listings and accommodations</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Add PG Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500 p-2 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Add New PG</h2>
              <p className="text-gray-600">Create a new accommodation listing</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PG Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter PG name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                  value={pg.pgName}
                  onChange={(e) => setPg({ ...pg, pgName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="Enter location"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                  value={pg.location}
                  onChange={(e) => setPg({ ...pg, location: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  placeholder="Enter monthly rent"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                  value={pg.price}
                  onChange={(e) => setPg({ ...pg, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sharing *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2/3/4 sharing"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                  value={pg.sharing}
                  onChange={(e) => setPg({ ...pg, sharing: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Food Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Food Type *
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 bg-white"
                value={pg.foodType}
                onChange={(e) => setPg({ ...pg, foodType: e.target.value })}
                required
              >
                <option value="">Select Food Type</option>
                <option value="Veg">Vegetarian</option>
                <option value="Non-Veg">Non-Vegetarian</option>
                <option value="Veg/Non Veg">Both Veg & Non-Veg</option>
              </select>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amenities
              </label>
              <textarea
                placeholder="Enter amenities separated by commas (e.g., WiFi, AC, Laundry)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 resize-none"
                rows="3"
                value={pg.amenities}
                onChange={(e) => setPg({ ...pg, amenities: e.target.value })}
              />
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Photos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setPhotos(Array.from(e.target.files))}
                    className="hidden"
                    id="photos"
                  />
                  <label htmlFor="photos" className="cursor-pointer">
                    <span className="text-blue-600 font-medium">Click to upload photos</span>
                    <p className="text-gray-500 text-sm mt-1">PNG, JPG up to 10MB each</p>
                  </label>
                  {photos.length > 0 && (
                    <p className="text-green-600 text-sm mt-2 font-medium">
                      {photos.length} photo(s) selected
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Videos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => setVideos(Array.from(e.target.files))}
                    className="hidden"
                    id="videos"
                  />
                  <label htmlFor="videos" className="cursor-pointer">
                    <span className="text-blue-600 font-medium">Click to upload videos</span>
                    <p className="text-gray-500 text-sm mt-1">MP4, MOV up to 50MB each</p>
                  </label>
                  {videos.length > 0 && (
                    <p className="text-green-600 text-sm mt-2 font-medium">
                      {videos.length} video(s) selected
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Adding PG...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add PG
                </div>
              )}
            </button>
          </form>
        </div>

        {/* List of PGs */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500 p-2 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">All PGs</h2>
                <p className="text-gray-600 text-sm">Manage existing accommodations</p>
              </div>
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              {pgs.length} Total PGs
            </div>
          </div>

          {pgs.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <svg className="h-20 w-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No PGs Added Yet</h3>
              <p className="text-gray-500">Start by adding your first PG listing using the form above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pgs.map((pgItem, index) => (
                <div
                  key={pgItem._id}
                  className="group bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{pgItem.pgName}</h3>
                        <div className="flex gap-2">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                            ₹{pgItem.price}
                          </span>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {pgItem.sharing}
                          </span>
                          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {pgItem.foodType}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">{pgItem.location}</span>
                      </div>
                      {pgItem.amenities && (
                        <div className="mt-2">
                          <p className="text-gray-600 text-sm">
                            <span className="font-semibold">Amenities:</span> {pgItem.amenities}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(pgItem._id)}
                      disabled={isDeleting === pgItem._id}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium group-hover:shadow-md disabled:cursor-not-allowed"
                    >
                      {isDeleting === pgItem._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .grid > div {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Admin;