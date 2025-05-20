import React from 'react';

interface ArticleCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  subtitle,
  imageUrl,
  link,
}) => {
  return (
    <a
      href={link}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {subtitle}
        </p>
      </div>
    </a>
  );
};

export default ArticleCard; 