import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Search, MapPin, Clock, Star, Users, Calendar, Shield } from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { venues } = useData();

  const popularVenues = venues.filter(v => v.status === 'approved').slice(0, 3);
  const popularSports = ['Badminton', 'Tennis', 'Football', 'Basketball', 'Table Tennis', 'Cricket'];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find & Book Your
              <span className="block text-yellow-400">Perfect Court</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              Discover amazing sports facilities near you and book instantly. 
              Connect with fellow sports enthusiasts and elevate your game.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/venues"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Explore Venues
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/signup"
                  className="border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-all"
                >
                  Join Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Game</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search for sports facilities by location, sport type, or venue name
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search venues, sports, or location..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <Link
                to="/venues"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Sports */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Sports</h2>
            <p className="text-gray-600">Choose from a wide variety of sports and activities</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularSports.map((sport, index) => (
              <Link
                key={sport}
                to={`/venues?sport=${sport}`}
                className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-6 rounded-xl text-center transition-all transform hover:scale-105 border border-blue-200"
              >
                <div className="text-2xl mb-2">🏸</div>
                <h3 className="font-semibold text-gray-900">{sport}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Venues */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Venues</h2>
            <p className="text-gray-600">Top-rated facilities loved by our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularVenues.map((venue) => (
              <Link
                key={venue.id}
                to={`/venues/${venue.id}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 relative">
                  <img
                    src={venue.photos[0]}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{venue.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{venue.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{venue.description}</p>
                  <div className="flex items-center space-x-2 text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{venue.address}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {venue.sports.slice(0, 2).map((sport) => (
                        <span
                          key={sport}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                    <span className="text-lg font-bold text-blue-600">${venue.pricePerHour}/hr</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose QuickCourt?</h2>
            <p className="text-gray-600">Everything you need for the perfect sports experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">Book your favorite courts instantly with our simple booking system</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Availability</h3>
              <p className="text-gray-600">See live availability and book the perfect time slot for your game</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">Connect with fellow sports enthusiasts and join exciting matches</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of sports enthusiasts already using QuickCourt</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/venues"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Find Venues Now
            </Link>
            {!isAuthenticated && (
              <Link
                to="/signup"
                className="border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-all"
              >
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;