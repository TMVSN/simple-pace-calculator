import React from 'react';
import ArticleCard from '../components/ArticleCard';

// Temporary data for demonstration
const articles = [
  {
    title: "How to Build Your Running Base",
    subtitle: "Learn the fundamentals of building a strong running foundation for better performance",
    imageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    link: "#"
  },
  {
    title: "Understanding Heart Rate Zones",
    subtitle: "Master your training by understanding and utilizing heart rate zones effectively",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    link: "#"
  },
  {
    title: "Nutrition for Runners",
    subtitle: "Essential nutrition tips to fuel your runs and optimize recovery",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    link: "#"
  },
  {
    title: "Injury Prevention",
    subtitle: "Key strategies to prevent common running injuries and stay healthy",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    link: "#"
  }
];

const TrainingTips: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-purple-100">Training Tips</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article, index) => (
          <ArticleCard
            key={index}
            title={article.title}
            subtitle={article.subtitle}
            imageUrl={article.imageUrl}
            link={article.link}
          />
        ))}
      </div>
    </div>
  );
};

export default TrainingTips;
