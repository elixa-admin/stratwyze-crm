import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Native Sales CRM
          </h1>
          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Intelligent company research, beautiful pipeline management, and deep sales insights — powered by AI.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition">
                Get Started Free
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-4 px-8 rounded-lg border-2 border-blue-600 transition">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Research</h3>
            <p className="text-gray-600 leading-relaxed">
              Automatically research companies with Tavily API. Get real-time news, funding info, and technology stack details.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Beautiful Pipeline</h3>
            <p className="text-gray-600 leading-relaxed">
              Manage your sales funnel with an intuitive Kanban board. Drag deals across 5 stages with real-time updates.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Executive Briefs</h3>
            <p className="text-gray-600 leading-relaxed">
              Claude AI generates multi-section executive briefs with pitch angles and competitive analysis for every prospect.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-gray-200">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">50%</p>
            <p className="text-gray-600 mt-2">Faster research with AI</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">100%</p>
            <p className="text-gray-600 mt-2">Pipeline visibility</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">3x</p>
            <p className="text-gray-600 mt-2">Better insights</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to elevate your sales process?</h2>
          <p className="text-xl mb-8 text-blue-100">Join the next generation of AI-native CRM platforms.</p>
          <Link href="/signup">
            <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-blue-50 transition shadow-lg">
              Start Free Trial
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>&copy; 2026 Stratwyze CRM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
