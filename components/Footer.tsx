import React from 'react';
import { DEVELOPER_NAME, FACEBOOK_LINK } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm md:text-base">
          Design and Developed By{' '}
          <a
            href={FACEBOOK_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary hover:text-sky-300 transition-colors underline decoration-dotted underline-offset-4"
          >
            {DEVELOPER_NAME}
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
