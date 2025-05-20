import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-purple-100">About Us</h1>
      
      {/* Hero Section */}
      <div className="bg-gray-800 rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Running community"
              className="rounded-lg shadow-lg w-full h-64 object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold text-purple-100 mb-4">Our Story</h2>
            <p className="text-gray-300 mb-4">
              Welcome to our running community! We're passionate about helping runners of all levels achieve their goals. 
              Whether you're training for your first 5K or preparing for a marathon, we're here to support your journey.
            </p>
            <p className="text-gray-300">
              Our platform combines cutting-edge technology with expert knowledge to provide you with the tools and 
              resources you need to succeed in your running endeavors.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gray-800 rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-purple-100 mb-6">Our Mission</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="text-purple-400 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-purple-100 mb-2">Empower Runners</h3>
            <p className="text-gray-300">
              We believe in empowering every runner with the knowledge and tools they need to reach their full potential.
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="text-purple-400 text-4xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-purple-100 mb-2">Share Knowledge</h3>
            <p className="text-gray-300">
              Our goal is to share valuable insights and training tips that help runners improve their performance.
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="text-purple-400 text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-purple-100 mb-2">Build Community</h3>
            <p className="text-gray-300">
              We're creating a supportive community where runners can connect, share experiences, and grow together.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-purple-100 mb-6">Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Team member"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-purple-100 mb-2">John Doe</h3>
              <p className="text-gray-300">Running Coach & Founder</p>
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80"
              alt="Team member"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-purple-100 mb-2">Jane Smith</h3>
              <p className="text-gray-300">Sports Nutritionist</p>
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80"
              alt="Team member"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-purple-100 mb-2">Mike Johnson</h3>
              <p className="text-gray-300">Performance Analyst</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
