import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import guitar from '../assets/guitar.png';
import google from '../assets/google.png';
import phone from '../assets/phone.png';

function Login({ setLoginPop }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(email, password, username);
        toast.success('User registered successfully!', {
                  position: 'top-right',
                  autoClose: 2000,
                });
      } else {
        toast.success('User Loged-in successfully!', {
          position: 'top-right',
          autoClose: 2000,
        });
        await login(email, password);
      }
      setLoginPop(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailLoginClick = () => {
    setShowEmailLogin(true);
    setIsRegister(false);
  };

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-zinc-900/75 transition-opacity" aria-hidden="true"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-96 sm:max-w-lg">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <div className="mt-2">
                    <img src={guitar} className="w-20 h-20 mx-auto" alt="Guitar" />
                    <p className="text-base font-medium mt-5 text-center">
                      Help us become one of the safest places<br /> to buy and sell.
                    </p>
                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                    {!showEmailLogin ? (
                      <div className="mt-12">
                        <div className="flex border-2 border-black p-2 rounded-md cursor-pointer">
                          <img src={phone} className="w-6 h-6" alt="Phone" />
                          <h1 className="font-semibold ml-3">Continue with phone</h1>
                        </div>
                        <div className="flex border-2 border-gray-300 p-2 rounded-md mt-4 cursor-pointer">
                          <img src={google} className="w-6 h-6" alt="Google" />
                          <h1 className="font-semibold ml-10">Continue with Google</h1>
                        </div>
                        <h1 className="text-center mt-4">OR</h1>
                        <h1
                          className="text-center font-semibold underline cursor-pointer mt-4"
                          onClick={handleEmailLoginClick}
                        >
                          Login with email
                        </h1>
                      </div>
                    ) : (
                      <div className="mt-12">
                        {!isRegister ? (
                          <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-4">
                              <label className="block text-gray-700">Email</label>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700">Password</label>
                              <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full bg-blue-500 text-white p-2 rounded"
                            >
                              Login
                            </button>
                          </form>
                        ) : (
                          <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-4">
                              <label className="block text-gray-700">Username</label>
                              <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700">Email</label>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700">Password</label>
                              <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full bg-blue-500 text-white p-2 rounded"
                            >
                              Register
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                    <p className="mt-4 text-center">
                      {isRegister ? 'Already have an account?' : 'Need an account?'}
                      <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-blue-500 underline ml-1"
                      >
                        {isRegister ? 'Login' : 'Register'}
                      </button>
                    </p>
                    <h1 className="text-center text-sm mt-4">
                      All your personal details are safe with us.
                    </h1>
                    <h1 className="text-center text-sm mt-4 cursor-pointer">
                      If you continue, you are accepting{' '}
                      <span className="text-blue-600">
                        OLX Terms and <br /> Conditions and Privacy Policy
                      </span>
                    </h1>
                    <button
                      onClick={() => setLoginPop(false)}
                      className="mt-4 w-full text-gray-500 underline cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;