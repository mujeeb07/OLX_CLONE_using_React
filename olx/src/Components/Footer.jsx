import React from 'react';
import playstore from '../assets/playstore.webp';
import appstore from '../assets/appstore.webp';

function Footer() {
  return (
    <div className="bg-[#eff1f3] mt-20">
        <div className="py-8 px-8 max-w-6xl mx-auto">

          <div className="flex justify-center gap-5 mb-6">
            <img className="w-32 cursor-pointer" src={playstore} alt="playstore" />
            <img className="w-32 cursor-pointer" src={appstore} alt="appstore" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-600">
            
            <div>
              <h3 className="font-bold mb-2 text-black text-[13px] uppercase">Popular Locations</h3>
              <ul className="space-y-1">
                <li>Kolkata</li>
                <li>Mumbai</li>
                <li>Chennai</li>
                <li>Pune</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2 text-black text-[13px] uppercase">Trending Locations</h3>
              <ul className="space-y-1">
                <li>Bhubaneshwar</li>
                <li>Hyderabad</li>
                <li>Chandigarh</li>
                <li>Nashik</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2 text-black text-[13px] uppercase">About Us</h3>
              <ul className="space-y-1">
                <li>Tech@OLX</li>
                <li>Careers</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2 text-black text-[13px] uppercase">OLX</h3>
              <ul className="space-y-1">
                <li>Blog</li>
                <li>Help</li>
                <li>Sitemap</li>
                <li>Legal & Privacy information</li>
                <li>Vulnerability Disclosure Program</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">© 2025 OLX.</p>
          </div>
        </div>
    </div>
  )
}

export default Footer