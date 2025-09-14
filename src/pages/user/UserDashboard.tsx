import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Calendar, MapPin, Clock, Star, ArrowRight, Activity } from 'lucide-react';
import { format } from 'date-fns';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getBookingsByUserId, getVenueById } = useData();

  const userBookings = getBookingsByUserId(user?.id || '');
  const upcomingBookings = userBookings.filter(b => b.status === 'confirmed').slice(0, 3);
  const totalBookings = userBookings.length;
  const completedBookings = userBookings.filter(b => b.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Bookings</h3>
                <p className="text-2xl font-bold text-blue-600">{totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Bookings</h3>
                <p className="text-2xl font-bold text-green-600">
                  {userBookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
                <p className="text-2xl font-bold text-purple-600">{completedBookings}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Bookings</h2>
                <Link
                  to="/user/profile"
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>View all</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => {
                    const venue = getVenueById(booking.venueId);
                    const court = venue?.courts.find(c => c.id === booking.courtId);

                    return (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{venue?.name}</h3>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(booking.date), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{booking.startTime} - {booking.endTime}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{court?.name}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-lg font-bold text-blue-600">${booking.totalPrice}</span>
                          <div className="space-x-2">
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                              Cancel
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming bookings</h3>
                  <p className="text-gray-600 mb-4">Ready to book your next game?</p>
                  <Link
                    to="/venues"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Find Venues
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/venues"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center space-x-3 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Book a Venue</span>
                </Link>
                <Link
                  to="/user/profile"
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 p-4 rounded-lg flex items-center space-x-3 transition-colors"
                >
                  <Activity className="w-5 h-5" />
                  <span className="font-medium">My Bookings</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {userBookings.slice(0, 3).map((booking) => {
                  const venue = getVenueById(booking.venueId);
                  return (
                    <div key={booking.id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">
                          Booked {venue?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(booking.createdAt), 'MMM d')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;