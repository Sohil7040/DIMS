import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { format, addDays, startOfDay, isToday, isTomorrow } from 'date-fns';
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, Check } from 'lucide-react';

const BookingPage: React.FC = () => {
  const { venueId } = useParams();
  const { getVenueById, addBooking } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const venue = getVenueById(venueId!);
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [duration, setDuration] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  if (!venue || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please log in to book a venue</p>
        </div>
      </div>
    );
  }

  // Generate available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: isToday(date) ? 'Today' : isTomorrow(date) ? 'Tomorrow' : format(date, 'MMM d'),
      fullDate: format(date, 'EEEE, MMMM d')
    };
  });

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 22; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(timeString);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const selectedCourtData = venue.courts.find(c => c.id === selectedCourt);
  const totalPrice = selectedCourtData ? selectedCourtData.pricePerHour * duration : 0;

  const formatDateDisplay = (dateString: string) => {
    const date = availableDates.find(d => d.value === dateString);
    return date ? date.fullDate : dateString;
  };

  const handleBooking = async () => {
    if (!selectedCourt || !selectedTimeSlot || !user) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const endTime = `${parseInt(selectedTimeSlot.split(':')[0]) + duration}:00`;

    addBooking({
      userId: user.id,
      venueId: venue.id,
      courtId: selectedCourt,
      date: selectedDate,
      startTime: selectedTimeSlot,
      endTime,
      totalPrice,
      status: 'confirmed'
    });

    setBookingComplete(true);
    setIsProcessing(false);
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your court has been successfully booked. We've sent a confirmation to your email.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/user/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/venues')}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Book Another Venue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Book Your Court</h1>
            <p className="text-gray-600">{venue.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Select Date
              </h2>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {availableDates.map((date) => (
                  <button
                    key={date.value}
                    onClick={() => setSelectedDate(date.value)}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      selectedDate === date.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="text-sm font-medium">{date.label}</div>
                  </button>
                ))}
              </div>
              {selectedDate && (
                <p className="mt-4 text-sm text-gray-600">
                  Selected: {formatDateDisplay(selectedDate)}
                </p>
              )}
            </div>

            {/* Court Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Court</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {venue.courts.map((court) => (
                  <button
                    key={court.id}
                    onClick={() => setSelectedCourt(court.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedCourt === court.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
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
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedCourt && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Select Time & Duration
                </h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                    <option value={3}>3 hours</option>
                    <option value={4}>4 hours</option>
                  </select>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTimeSlot(time)}
                      className={`p-2 rounded-lg text-sm transition-colors ${
                        selectedTimeSlot === time
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{venue.name}</p>
                    <p className="text-sm text-gray-500">{venue.address}</p>
                  </div>
                </div>

                {selectedDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{formatDateDisplay(selectedDate)}</p>
                    </div>
                  </div>
                )}

                {selectedCourtData && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs text-blue-600 font-bold">C</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedCourtData.name}</p>
                      <p className="text-sm text-gray-500">{selectedCourtData.sport}</p>
                    </div>
                  </div>
                )}

                {selectedTimeSlot && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedTimeSlot} - {parseInt(selectedTimeSlot.split(':')[0]) + duration}:00
                      </p>
                      <p className="text-sm text-gray-500">{duration} hour{duration > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )}
              </div>

              {totalPrice > 0 && (
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Court fee</span>
                    <span className="font-medium">${selectedCourtData!.pricePerHour} x {duration}hr</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">${totalPrice}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={!selectedCourt || !selectedTimeSlot || isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                  selectedCourt && selectedTimeSlot && !isProcessing
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Confirm & Pay</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By booking, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;