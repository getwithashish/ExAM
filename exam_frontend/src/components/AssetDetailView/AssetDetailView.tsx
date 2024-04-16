import React from "react";

// Define props interface
interface SimplePageProps {
  message: string;
}

// Functional component
const SimplePage: React.FC<SimplePageProps> = ({ message }) => {
  return (
    <div>
      <h1>{message}</h1>
      <p>This is a simple React page written in TypeScript (TSX).</p>
    </div>
  );
};

// Export the component
export default SimplePage;
