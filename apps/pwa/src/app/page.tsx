import Link from 'next/link';
import { Button } from '@chaufher/ui';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Safe rides for women,
              <br />
              <span className="opacity-90">by women.</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl">
              Schedule your ride with verified female drivers. 
              Travel with confidence, comfort, and peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register/rider">
                <Button
                  size="lg"
                  className="bg-white text-magenta-600 hover:bg-gray-100 shadow-xl"
                >
                  Book a Ride
                </Button>
              </Link>
              <Link href="/register/driver">
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Become a Driver
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ChaufHER?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We prioritize your safety and comfort with every ride.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-card text-center">
              <div className="w-16 h-16 bg-gradient-soft rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-magenta-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-3">
                Verified Drivers
              </h3>
              <p className="text-gray-600">
                All drivers undergo thorough background checks and verification before joining our platform.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-card text-center">
              <div className="w-16 h-16 bg-gradient-soft rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-magenta-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-3">
                Schedule Ahead
              </h3>
              <p className="text-gray-600">
                Book rides up to 30 days in advance. Perfect for airport transfers, appointments, and daily commutes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-card text-center">
              <div className="w-16 h-16 bg-gradient-soft rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-magenta-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-3">
                Women Supporting Women
              </h3>
              <p className="text-gray-600">
                Join a community that empowers female drivers and provides safe transportation for women.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to ride with confidence?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Download the app or sign up now to schedule your first ride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/register/driver">
              <Button variant="outline" size="lg">
                Apply as Driver
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="font-poppins text-2xl font-bold">
                Chauf<span className="text-magenta-400">HER</span>
              </span>
              <p className="text-gray-400 mt-2">
                Safe rides for women, by women.
              </p>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
              <Link href="/safety" className="hover:text-white transition-colors">
                Safety
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2026 ChaufHER. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
