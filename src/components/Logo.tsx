import React from 'react';
const Logo = ({
  className = ""
}: {
  className?: string;
}) => {
  return <div className={`flex items-center gap-3 ${className}`}>

    <div className="flex items-center">
      <img src="/assest/image/logo_white.jpg" alt="Company Logo" className="h-14 object-contain" />
    </div>
  </div>;
};
export default Logo;


export const NotFoundLogo = ({
  className = ""
}: {
  className?: string;
}) => {
  return <div className={`flex items-center gap-3 ${className}`}>

    <div className="flex items-center">
      <img src="/assest/image/puppy.jpg" alt="Company Logo" className="h-14 object-contain" />
    </div>
  </div>;
};