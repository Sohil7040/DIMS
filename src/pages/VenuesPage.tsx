import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Search, Filter, MapPin, Star, Clock } from 'lucide-react';

const VenuesPage: React.FC = () => {
  const { venues } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');

  const approvedVenues = venues.filter(v => v.status === 'approved');
  const sports = ['Badminton', 'Tennis', 'Football', 'Basketball', 'Cricket', 'Table Tennis', 'Squash'];

  const filteredVenues = approvedVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = !selectedSport || venue.sports.includes(selectedSport);
    const matchesPrice = !priceRange || 
      (priceRange === 'low' && venue.pricePerHour <= 40) ||
      (priceRange === 'medium' && venue.pricePerHour > 40 && venue.pricePerHour <= 80) ||
      (priceRange === 'high' && venue.pricePerHour > 80);
    const matchesRating = !rating || venue.rating >= parseFloat(rating);

    return matchesSearch && matchesSport && matchesPrice && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Sports Venues</h1>
          <p className="text-gray-600">Discover and book amazing sports facilities near you</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search venues or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sport Filter */}
            <div>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sports</option>
                {sports.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Prices</option>
                <option value="low">Under $40/hr</option>
                <option value="medium">$40-80/hr</option>
                <option value="high">Above $80/hr</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSport('');
                setPriceRange('');
                setRating('');
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVenues.map((venue) => (
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
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{venue.address}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Open today</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {venue.sports.slice(0, 3).map((sport) => (
                    <span
                      key={sport}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {sport}
                    </span>
                  ))}
                  {venue.sports.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                      +{venue.sports.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    ${venue.pricePerHour}
                    <span className="text-sm text-gray-500 font-normal">/hour</span>
                  </span>
                  <div className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    View Details
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSport('');
                setPriceRange('');
                setRating('');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenuesPage;