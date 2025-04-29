import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-purple-100">About Us</h1>
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-300">Information about the site or creators will go here.</p>
      </div>
      {/* Add more content as needed */}
    </div>
  );
};

export default AboutUs;
