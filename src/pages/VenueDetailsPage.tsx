import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Star, MapPin, Clock, Wifi, Car, Users, Shield, Calendar, ArrowLeft } from 'lucide-react';

const VenueDetailsPage: React.FC = () => {
  const { id } = useParams();
  const { getVenueById } = useData();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const venue = getVenueById(id!);

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue not found</h2>
          <Link to="/venues" className="text-blue-600 hover:text-blue-700">
            Back to venues
          </Link>
        </div>
      </div>
    );
  }

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Parking': <Car className="w-5 h-5" />,
    'WiFi': <Wifi className="w-5 h-5" />,
    'Changing Rooms': <Users className="w-5 h-5" />,
    'Refreshments': <Users className="w-5 h-5" />,
    'AC': <Shield className="w-5 h-5" />,
    'First Aid': <Shield className="w-5 h-5" />,
    'Lounge': <Users className="w-5 h-5" />,
    'Pro Shop': <Users className="w-5 h-5" />,
    'Spa': <Users className="w-5 h-5" />,
    'Restaurant': <Users className="w-5 h-5" />,
    'Valet Parking': <Car className="w-5 h-5" />,
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'user') {
      alert('Only users can book venues. Please login with a user account.');
      return;
    }

    navigate(`/booking/${venue.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Images */}
            <div className="relative h-64 lg:h-96">
              <img
                src={venue.photos[0]}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold">{venue.rating}</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 lg:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{venue.name}</h1>
              <p className="text-gray-600 mb-6">{venue.description}</p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>{venue.address}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Open 6:00 AM - 10:00 PM</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-3xl font-bold text-blue-600">
                    ${venue.pricePerHour}
                  </span>
                  <span className="text-gray-500 ml-1">/hour starting from</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Now</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sports Available */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sports Available</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {venue.sports.map((sport) => (
                  <div
                    key={sport}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
                  >
                    <div className="text-2xl mb-2">🏸</div>
                    <h3 className="font-semibold text-gray-900">{sport}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Courts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Courts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {venue.courts.map((court) => (
                  <div
                    key={court.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{court.name}</h3>
                      <span className="text-lg font-bold text-blue-600">
                        ${court.pricePerHour}/hr
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{court.sport}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{court.operatingHours.start} - {court.operatingHours.end}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            {venue.photos.length > 1 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Photo Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {venue.photos.slice(1).map((photo, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={photo}
                        alt={`${venue.name} photo ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="space-y-3">
                {venue.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-3">
                    <div className="text-blue-600">
                      {amenityIcons[amenity] || <Shield className="w-5 h-5" />}
                    </div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Book */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Play?</h3>
              <p className="text-gray-600 mb-4">
                Book your preferred time slot and start playing today!
              </p>
              <button
                onClick={handleBookNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Book Now
              </button>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{venue.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Open 6:00 AM - 10:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailsPage;