import { useState } from "react";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-600 to-teal-500 px-4">
      <div className="relative w-full max-w-4xl h-[520px] bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="w-1/2 flex flex-col justify-center px-12">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-6">Sign in to manage your quizzes</p>

            <input className="auth-input" placeholder="Email" />
            <input
              className="auth-input"
              placeholder="Password"
              type="password"
            />

            <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded">
              Sign In
            </button>
          </div>

          <div className="w-1/2 flex flex-col justify-center px-12 bg-gray-50">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-500 mb-6">Start creating smarter quizzes</p>

            <input className="auth-input" placeholder="Name" />
            <input className="auth-input" placeholder="Email" />
            <input
              className="auth-input"
              placeholder="Password"
              type="password"
            />

            <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded">
              Sign Up
            </button>
          </div>
        </div>

        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-br from-cyan-600 to-teal-500 text-white
          transition-transform duration-700 ease-in-out
          ${isSignUp ? "-translate-x-full" : "translate-x-0"}`}
        >
          <div className="h-full flex flex-col items-center justify-center px-10 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {isSignUp ? "Already have an account?" : "New here?"}
            </h2>
            <p className="mb-6 text-white/80">
              {isSignUp
                ? "Sign in and continue building quizzes"
                : "Create an account and start instantly"}
            </p>

            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-cyan-700 transition"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
