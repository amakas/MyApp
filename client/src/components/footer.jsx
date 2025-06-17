import React from 'react';
 
import './footer.scss'; // Custom styles for the footer if needed
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="text">
          &copy; {new Date().getFullYear()} My Website. All rights reserved.
        </p>
        <p className="text">
          Built with ❤️ using React.
        </p>
      </div>
    </footer>
  );
}