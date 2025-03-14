"use client"
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from "next/image";

// Helper function to format updatedAt
// const formatUpdatedAt = (dateString) => {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffInSeconds = Math.floor((now - date) / 1000);

//   if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
//   if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
//   if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
//   return `${Math.floor(diffInSeconds / 86400)} days ago`;
// };

const formatUpdatedAt = (dateString) => {
  const date = new Date(dateString);
  const diff = Math.floor((new Date() - date) / 1000); // Difference in seconds

  const units = [
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const unit of units) {
    const interval = Math.floor(diff / unit.seconds);
    if (interval >= 1) return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
  }

  return "Just now";
};

const getFileCategory = (fileType) => {
  const sheetTypes = ["xls", "xlsx", "csv", "ods"];
  const docTypes = ["doc", "docx", "pdf", "txt", "odt", "rtf"];
  const slideTypes = ["ppt", "pptx", "odp"];

  if (sheetTypes.includes(fileType.toLowerCase())) return "Sheet";
  if (docTypes.includes(fileType.toLowerCase())) return "Docs";
  if (slideTypes.includes(fileType.toLowerCase())) return "Slide";
  
  return "Other"; 
};

export default function ResourcePage() {
  const [viewType, setViewType] = useState('grid');
  const [previewResource, setPreviewResource] = useState(null);
  const [resources, setResources] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Fetch resources from the API
  useEffect(() => {
  const fetchResources = async () => {
    setIsLoading(true);

    const response = await fetch(`/api/resources?page=${page}&limit=4`);
    const data = await response.json();

    setResources(prevResources => {
      // If page is 1, reset resources, else append new ones
      return page === 1 ? data.resources.filter(resource => resource.visible) : [...prevResources, ...data.resources.filter(resource => resource.visible)];
    });

    setTotalPages(data.total);
    setIsLoading(false);
  };

  fetchResources();
}, [page]);

// Reset resources when navigating to a different section of the app
useEffect(() => {
  setResources([]); 
  setPage(1); 
}, []);

  // Sort resources
  const sortedResources = [...resources].sort((a, b) => {
    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc'
        ? new Date(a.updatedAt) - new Date(b.updatedAt)
        : new Date(b.updatedAt) - new Date(a.updatedAt);
    }
    if (sortConfig.key === 'type') {
      return sortConfig.direction === 'asc'
        ? a.fileType.localeCompare(b.fileType)
        : b.fileType.localeCompare(a.fileType);
    }
    return 0;
  });

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Featured resource is always the first one
  const featuredResource = resources[0];

  // Handle "See More" button click
  const handleSeeMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Handle resource click to open preview
  const handleResourceClick = (resource) => {
    setPreviewResource(resource);
  };

  // Handle download button click
const handleDownload = (resource) => {
  if (resource.fileUrl) {
    const link = document.createElement("a");
    link.href = resource.fileUrl;
    link.setAttribute("download", resource.title || "downloaded-file"); // Ensures file has a name
    link.setAttribute("target", "_blank"); // Opens in new tab if needed
    link.setAttribute("rel", "noopener noreferrer"); // Security best practice

    document.body.appendChild(link);
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
    }, 100); // Small delay for mobile compatibility
  } else {
    alert("Download link not available.");
  }
};

  // Handle close preview modal
  const closePreview = () => {
    setPreviewResource(null);
  };

  return (
    <div className="min-h-screen bg-[#F9F5EC]">
  {/* Header */}
  <Navbar resources={true} />

  <main className="container mx-auto px-4 py-8">
    {/* Featured Resource Section */}
    <section className="mb-10">
      <h2 className="text-[#84670A] text-2xl font-bold mb-4">Recently Added</h2>
      
      {featuredResource && (
        <div
          className="bg-white rounded-lg border-2 border-[#E0D5C0] p-4 md:p-6 cursor-pointer"
          onClick={() => handleResourceClick(featuredResource)}
        >
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail */}
            <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-6">
              <div className="bg-[#E0D5C0] rounded-lg md:h-full h-48  flex items-center justify-center overflow-hidden">
                {featuredResource.thumbnail ? (
                  <Image
                    src={featuredResource.thumbnail}
                    alt={`Thumbnail for ${featuredResource.title}`}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="bg-[#84670A] bg-opacity-70 rounded-full w-20 h-20 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{featuredResource.fileType}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="w-full md:w-2/3 flex flex-col justify-between">
              <div>
  <h3 className="text-gray-800 text-xl md:text-2xl font-bold mb-2">
    {featuredResource.title}
  </h3>
  <p className="text-gray-600 mb-4 text-justify line-clamp-4 md:[-webkit-line-clamp:15] md:[display:-webkit-box] md:[-webkit-box-orient:vertical]">
    {featuredResource.description}
  </p>
</div>
            
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <span className="bg-[#84670A] text-white px-4 py-1 rounded-full text-sm">
                  {featuredResource.category}
                </span>
                <span className="text-gray-600 text-sm line-clamp-1">{featuredResource.source ? `Source: ${featuredResource.source}` : `By ${featuredResource.author}`}</span>
                <span className="text-gray-600 text-sm">Updated {formatUpdatedAt(featuredResource.updatedAt)}</span>
              
                {/* Download Button */}
                <div className="ml-auto">
                  <button
                    className="w-12 h-12 rounded-full bg-[#F9F5EC] border-2 border-[#84670A] flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(featuredResource);
                    }}
                  >
                    <span className="text-[#84670A] text-2xl font-bold">↓</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
    
    {/* All Resources Section */}
    <section>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-[#84670A] text-2xl font-bold mb-4 md:mb-0">All Resources</h2>
        
        {/* View Toggle */}
        <div className="flex items-center mb-4 md:mb-0">
          <div className="relative h-8 w-32 bg-white rounded border-2 border-[#E0D5C0] flex items-center">
            <div className={`absolute h-full w-1/2 rounded bg-[#84670A] transition-all ${viewType === 'list' ? 'left-1/2' : 'left-0'}`}></div>
            <button 
              className={`z-10 w-1/2 h-full flex items-center justify-center text-sm ${viewType === 'grid' ? 'text-white' : 'text-[#84670A]'}`}
              onClick={() => setViewType('grid')}
            >
              Grid
            </button>
            <button 
              className={`z-10 w-1/2 h-full flex items-center justify-center text-sm ${viewType === 'list' ? 'text-white' : 'text-[#84670A]'}`}
              onClick={() => setViewType('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>
      
      {/* Filter Options */}
      <div className="flex flex-wrap items-center mb-6">
        <span className="text-gray-600 mr-4 mb-2 md:mb-0">Filter by:</span>
        <div className="flex flex-wrap gap-2">
          <button 
            className="px-4 py-1 rounded-full bg-white border-2 border-[#84670A] text-[#84670A] text-sm"
            onClick={() => handleSort('date')}
          >
            Date {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↓'}
          </button>
          <button 
            className="px-4 py-1 rounded-full bg-white border-2 border-[#84670A] text-[#84670A] text-sm"
            onClick={() => handleSort('type')}
          >
            Type {sortConfig.key === 'type' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↓'}
          </button>
        </div>
      </div>
      
      {/* Resource Grid or List View */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#84670A]"></div>
        </div>
      ) : (
        <div className={`${viewType === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}`}>
          {sortedResources.map(resource => (
            <div 
              key={resource.id} 
              className={`
                bg-white rounded-lg border-2 border-[#E0D5C0] overflow-hidden cursor-pointer
                ${viewType === 'list' ? 'flex items-center p-4' : ''}
              `}
              onClick={() => handleResourceClick(resource)}
            >
              {/* Thumbnail */}
              <div 
                className={`
                  bg-[#E0D5C0] flex items-center justify-center overflow-hidden relative
                  ${viewType === 'grid' ? 'h-32 rounded-t-lg' : 'h-16 w-16 rounded-lg mr-4 flex-shrink-0'}
                `}
              >
                {resource.thumbnail ? (
                  <Image
                    src={resource.thumbnail}
                    alt={`Thumbnail for ${resource.title}`}
                    width={viewType === 'grid' ? 300 : 64}
                    height={viewType === 'grid' ? 128 : 64}
                    className="w-full h-full object-cover"
                  />
                ) : getFileCategory(resource.fileType) === "Sheet" && !resource.thumbnail ?
                    <div className="relative w-3/4 h-3/4">
                      <div className="absolute inset-0 bg-[#84670A] opacity-30"></div>
                      <svg className="absolute inset-0" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M0 40 L10 30 L30 35 L50 15 L70 20 L90 10 L100 20" 
                          stroke="#84670A" 
                          strokeWidth="3" 
                          fill="none"
                        />
                      </svg>
                    </div>
                    :
                    <div className="bg-[#84670A] bg-opacity-70 rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{resource.fileType}</span>
                    </div>
                }
              </div>
              
              {/* Content */}
              <div className={viewType === 'grid' ? 'p-4' : 'flex-grow'}>
                <div className="flex justify-between items-start">
                  <h3 className="text-gray-800 font-bold mb-1 line-clamp-2">{resource.title}</h3>
                  {viewType === 'list' && (
                    <button 
                      className="ml-4 flex-shrink-0 p-2 bg-[#F9F5EC] rounded-full" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(resource);
                      }}
                    >
                      <span className="text-[#84670A] text-lg font-bold">↓</span>
                    </button>
                  )}
                </div>
                
                {viewType === 'list' && (
                  <p className="text-gray-600 text-sm mb-1 line-clamp-1">{resource.description}</p>
                )}
                <p className="text-gray-600 text-xs line-clamp-1">{resource.source ? `Source: ${resource.source}` : `By ${resource.author}`}</p>
                <p className="text-gray-600 text-xs">Updated {formatUpdatedAt(resource.updatedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* See More Button */}
      {sortedResources.length < totalPages && (
        <div className="flex justify-center mt-10">
          <button 
            onClick={handleSeeMore}
            className="bg-[#84670A] text-white px-8 py-3 rounded-full font-bold"
          >
            See More
          </button>
        </div>
      )}
      
      {/* Pagination Dots */}
      <div className="md:flex justify-center mt-36 space-x-2 hidden">
        {Array.from({ length: page }, (_, i) => (
          <div
            key={i}
            className={`w-5 h-1 rounded-full ${i + 1 === page ? 'bg-[#84670A]' : 'bg-[#E0D5C0]'}`}
          ></div>
        ))}
      </div>
    </section>
  </main>
  
  {/* Resource Preview Modal */}
  {previewResource && (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#84670A] text-white p-4 flex justify-between items-center">
          <h3 className="font-bold truncate">{previewResource.title}</h3>
          <button 
            onClick={closePreview}
            className="text-white hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Preview Content */}
        <div className="flex-grow overflow-auto p-6 flex flex-col md:flex-row gap-6">
          {/* Preview Image */}
          {previewResource.thumbnail && (
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={previewResource.thumbnail}
                alt={`Preview of ${previewResource.title}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Resource Details */}
          <div className={`${previewResource.thumbnail ? "md:w-1/2" : "w-full"} w-full bg-[#F9F5EC] py-6 px-3 rounded-lg`}>
            <h4 className="font-bold md:text-2xl text-lg mb-4 text-[#84670A]">{previewResource.title}</h4>
            
            {/* Description */}
            <div className="mb-6 max-h-[200px] overflow-y-auto">
              <p className="text-gray-700 text-justify text-sm">{previewResource.description}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-brandGold">
              <div>
                <p className="text-gray-500 text-sm">Type</p>
                <p className="font-medium">{getFileCategory(previewResource.fileType)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Size</p>
                <p className="font-medium">{previewResource.fileSize}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Category</p>
                <p className="font-medium">
                  {previewResource.category}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Last Updated</p>
                <p className="font-medium">{formatUpdatedAt(previewResource.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="p-4 border-t flex justify-end">
          <button 
            onClick={closePreview}
            className="px-4 py-2 border border-gray-300 rounded-lg mr-3"
          >
            Close
          </button>
          <button 
            onClick={() => handleDownload(previewResource)}
            className="px-4 py-2 bg-[#84670A] text-white rounded-lg flex items-center"
          >
            <span className="mr-2">Download</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )}
  
  <Footer />
</div>
  );
}