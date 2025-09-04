import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import ReactPlayer from "react-player";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MapPin,
  Users,
  Utensils,
  Star,
  Wifi,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Custom arrow components
const NextArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl p-2 z-10 transition-all duration-200 backdrop-blur-sm"
    onClick={onClick}
  >
    <ChevronRight className="w-5 h-5 text-gray-700" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl p-2 z-10 transition-all duration-200 backdrop-blur-sm"
    onClick={onClick}
  >
    <ChevronLeft className="w-5 h-5 text-gray-700" />
  </button>
);

const PGCard = ({ pg }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Prepare media items for the lightbox
  const mediaItems = [
    ...(pg.photos?.map((p) => ({ type: "image", src: `${BASE_URL}${p}` })) ||
      []),
    ...(pg.videos?.map((v) => ({ type: "video", src: `${BASE_URL}${v}` })) ||
      []),
  ];

  // react-slick settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots slick-thumb",
  };

  // Parse amenities if it's a string
  const amenitiesList =
    typeof pg.amenities === "string"
      ? pg.amenities
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a)
      : pg.amenities || [];

  // Food type styling
  const getFoodTypeStyle = (foodType) => {
    switch (foodType) {
      case "Veg":
        return "bg-green-100 text-green-800 border-green-200";
      case "Non-Veg":
        return "bg-red-100 text-red-800 border-red-200";
      case "Veg/Non Veg":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className="group bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Carousel */}
      {mediaItems.length > 0 ? (
        <div className="relative overflow-hidden rounded-t-2xl">
          <Slider {...settings} className="pg-slider">
            {mediaItems.map((item, i) => (
              <div key={i} className="relative">
                {item.type === "image" ? (
                  <div className="relative">
                    <img
                      src={item.src}
                      alt={`${pg.pgName}-${i + 1}`}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      src={item.src}
                      className="w-full h-56 object-cover"
                      muted
                      poster={item.src}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Media Counter */}
                <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                  {i + 1} / {mediaItems.length}
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={() => {
                    setMediaIndex(i);
                    setLightboxOpen(true);
                  }}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <Maximize2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl flex items-center justify-center">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 text-sm">No photos available</p>
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={mediaIndex}
        slides={mediaItems.map((item) =>
          item.type === "image"
            ? { src: item.src }
            : {
                type: "video",
                sources: [{ src: item.src, type: "video/mp4" }],
              }
        )}
        plugins={[Video]}
      />

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-grow">
            <h2 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-200">
              {pg.pgName}
            </h2>
            <div className="flex items-center gap-1 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{pg.location}</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-semibold">NEW</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">₹{pg.price}</p>
              <p className="text-gray-600 text-sm">per month</p>
            </div>
            <div className="bg-green-500 p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600 mb-1">Sharing</p>
            <p className="font-semibold text-blue-700">{pg.sharing}</p>
          </div>

          <div
            className={`border rounded-lg p-3 text-center ${getFoodTypeStyle(
              pg.foodType
            )}`}
          >
            <Utensils className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs mb-1">Food Type</p>
            <p className="font-semibold text-xs">{pg.foodType}</p>
          </div>
        </div>

        {/* Amenities */}
        {amenitiesList.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-semibold text-gray-700">Amenities</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.slice(0, 4).map((amenity, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 hover:bg-gray-200 transition-colors duration-200"
                >
                  {amenity}
                </span>
              ))}
              {amenitiesList.length > 4 && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
                  +{amenitiesList.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hover Overlay for Media Count */}
      {mediaItems.length > 1 && (
        <div
          className={`absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {mediaItems.length}{" "}
          {mediaItems.length === 1 ? "photo" : "photos/videos"}
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .pg-slider .slick-dots {
          bottom: 10px;
        }

        .pg-slider .slick-dots li button:before {
          color: white;
          opacity: 0.5;
          font-size: 8px;
        }

        .pg-slider .slick-dots li.slick-active button:before {
          opacity: 1;
          color: white;
        }

        .pg-slider .slick-dots li {
          margin: 0 2px;
        }
      `}</style>
    </div>
  );
};

export default PGCard;
