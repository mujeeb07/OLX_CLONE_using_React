import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import olx_logo_blue from '../assets/olx_logo_blue.svg';
import search1 from '../assets/search1.svg';
import search2 from '../assets/search.png';
import arrow_down from '../assets/arrow-down.svg';
import sell_button from '../assets/sellButton.png';
import Login from './Login';
import SellForm from './SellForm';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';
import avatar from '../assets/avatar.png';
import UserProfile from './UserProfile';


function Navbar() {
  const [loginPop, setLoginPop] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [profile, setProfile] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate()

  const handleAuthClick = async () => {
    if (user) {
      try {
        await logout();
        setLoginPop(false); 
        setShowForm(false); 
        toast.success('Logged out successfully!', {
          position: 'top-right',
          autoClose: 2000,
        });
      } catch (error) {
        console.error('Error logging out:', error);
        toast.error('Failed to log out. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } else {
      setLoginPop(true);
    }
  };

  const handleSellClick = () => {
    if (user) {
      setShowForm(true);
    } else {
      toast.warn('Please Login.');
      setLoginPop(true); 
    }
  };
  const handleNavigateHome = () => {
    navigate('/')
  }

  const handleProfile = () => {
    setProfile(!profile);
  }

  return (
    <>
      <div className="flex p-4 bg-slate-100 shadow-md items-center justify-between cursor-pointer" onClick={handleNavigateHome}>
        <img src={olx_logo_blue} alt="logo" className="w-15 h-12" />
        <div className="flex border-2 h-12 w-72 p-2 border-black ml-5 items-center">
          <img src={search1} className="w-6 h-5" alt="search location" />
          <input
            type="text"
            placeholder="Location"
            className="ml-1 flex-1 outline-none"
          />
          <img src={arrow_down} className="w-5 h-7" alt="dropdown arrow" />
        </div>

        <div className="flex h-12 ml-4 border-2 border-black">
          <input
            placeholder="Search Cars, Mobile phones and more"
            className="ml-3 w-96 outline-none"
          />
          <div className="flex items-center justify-center w-12 h-full bg-black">
            <img src={search2} alt="search icon" className="h-full" />
          </div>
        </div>

        <div className="flex h-12 p-3 ml-5 cursor-pointer items-center">
          <h1 className="font-semibold">ENGLISH</h1>
          <img src={arrow_down} alt="dropdown arrow" className="w-5 h-6 ml-1" />
        </div>

        <div
          className="flex h-12 p-3 ml-6 cursor-pointer items-center"
          onClick={handleAuthClick}
        >
          <h1 className="font-bold text-lg underline hover:no-underline">
            {user ? 'Logout' : 'Login'}
          </h1>
        </div>

        <div className="relative flex items-center cursor-pointer ml-5" onClick={handleProfile}>
          <img src={avatar} alt="User avatar" className="w-8 h-8 rounded-full" />
          {profile && (
            <div className="absolute top-full right-0 z-50">
              <UserProfile isOpen={profile} onClose={() => setProfile(false)} />
            </div>
          )}
        </div>

        <div
          className="w-28 flex p-2 ml-5 mr-5 cursor-pointer justify-center"
          onClick={handleSellClick}
        >
          <img className="font-bold text-lg" src={sell_button} alt="sell button" />
        </div>
      </div>

      {loginPop && <Login setLoginPop={setLoginPop} />}
      {showForm && <SellForm setShowForm={setShowForm} />}
    </>
  );
}

export default Navbar;