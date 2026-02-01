import React from 'react';
import { DEVELOPER_NAME } from '../constants';

interface FooterProps {
  onDeveloperClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onDeveloperClick }) => {
  return (
    <footer className="w-full bg-slate-900 text-white py-6 mt-auto border-t border-slate-800">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm md:text-base text-slate-400">
          Design and Developed By{' '}
          <button
            onClick={onDeveloperClick}
            className="font-bold text-primary hover:text-sky-300 transition-colors underline decoration-dotted underline-offset-4 ml-1 focus:outline-none"
          >
            {DEVELOPER_NAME}
          </button>
        </p>
        <p className="text-xs text-slate-600 mt-2">© {new Date().getFullYear()} All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;