import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">Stratwyze CRM</h1>
          <p className="text-center text-gray-600 mb-8">AI-powered sales pipeline management</p>

          <div className="space-y-4">
            <Link href="/login">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition">
                Create Account
              </button>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Lead management, research, and proposal generation in one platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
