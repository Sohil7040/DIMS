import React, { createContext, useContext, useState } from 'react';

interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  sports: string[];
  amenities: string[];
  photos: string[];
  rating: number;
  pricePerHour: number;
  ownerId: string;
  status: 'pending' | 'approved' | 'rejected';
  courts: Court[];
}

interface Court {
  id: string;
  name: string;
  sport: string;
  pricePerHour: number;
  operatingHours: {
    start: string;
    end: string;
  };
}

interface Booking {
  id: string;
  userId: string;
  venueId: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

interface DataContextType {
  venues: Venue[];
  bookings: Booking[];
  addVenue: (venue: Omit<Venue, 'id'>) => void;
  updateVenue: (id: string, updates: Partial<Venue>) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  getVenueById: (id: string) => Venue | undefined;
  getBookingsByUserId: (userId: string) => Booking[];
  getBookingsByOwnerId: (ownerId: string) => Booking[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [venues, setVenues] = useState<Venue[]>([
    {
      id: '1',
      name: 'Elite Sports Complex',
      description: 'Premium sports facility with modern amenities and professional courts.',
      address: '123 Sports Avenue, Downtown',
      sports: ['Badminton', 'Tennis', 'Table Tennis'],
      amenities: ['Parking', 'Changing Rooms', 'Refreshments', 'WiFi', 'AC'],
      photos: [
        'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
        'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg'
      ],
      rating: 4.8,
      pricePerHour: 50,
      ownerId: '2',
      status: 'approved',
      courts: [
        { id: 'c1', name: 'Court A1', sport: 'Badminton', pricePerHour: 45, operatingHours: { start: '06:00', end: '22:00' } },
        { id: 'c2', name: 'Court A2', sport: 'Badminton', pricePerHour: 45, operatingHours: { start: '06:00', end: '22:00' } },
        { id: 'c3', name: 'Tennis Court 1', sport: 'Tennis', pricePerHour: 60, operatingHours: { start: '07:00', end: '21:00' } },
      ]
    },
    {
      id: '2',
      name: 'City Sports Hub',
      description: 'Affordable sports facility perfect for casual and competitive play.',
      address: '456 Main Street, Central City',
      sports: ['Football', 'Cricket', 'Basketball'],
      amenities: ['Parking', 'Changing Rooms', 'First Aid'],
      photos: [
        'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg',
        'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg'
      ],
      rating: 4.2,
      pricePerHour: 35,
      ownerId: '2',
      status: 'approved',
      courts: [
        { id: 'c4', name: 'Football Ground', sport: 'Football', pricePerHour: 80, operatingHours: { start: '06:00', end: '20:00' } },
        { id: 'c5', name: 'Basketball Court', sport: 'Basketball', pricePerHour: 30, operatingHours: { start: '08:00', end: '22:00' } },
      ]
    },
    {
      id: '3',
      name: 'Premium Racquet Club',
      description: 'Exclusive club for racquet sports with top-notch facilities.',
      address: '789 Elite Boulevard, Uptown',
      sports: ['Tennis', 'Squash', 'Badminton'],
      amenities: ['Valet Parking', 'Lounge', 'Pro Shop', 'Spa', 'Restaurant'],
      photos: [
        'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg'
      ],
      rating: 4.9,
      pricePerHour: 100,
      ownerId: '2',
      status: 'approved',
      courts: [
        { id: 'c6', name: 'Premium Court 1', sport: 'Tennis', pricePerHour: 120, operatingHours: { start: '06:00', end: '22:00' } },
        { id: 'c7', name: 'Squash Court A', sport: 'Squash', pricePerHour: 80, operatingHours: { start: '07:00', end: '21:00' } },
      ]
    }
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      userId: '1',
      venueId: '1',
      courtId: 'c1',
      date: '2025-01-25',
      startTime: '10:00',
      endTime: '11:00',
      totalPrice: 45,
      status: 'confirmed',
      createdAt: '2025-01-20T10:00:00Z'
    }
  ]);

  const addVenue = (venue: Omit<Venue, 'id'>) => {
    const newVenue = { ...venue, id: Date.now().toString() };
    setVenues(prev => [...prev, newVenue]);
  };

  const updateVenue = (id: string, updates: Partial<Venue>) => {
    setVenues(prev => prev.map(venue => 
      venue.id === id ? { ...venue, ...updates } : venue
    ));
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, ...updates } : booking
    ));
  };

  const getVenueById = (id: string) => venues.find(venue => venue.id === id);

  const getBookingsByUserId = (userId: string) => 
    bookings.filter(booking => booking.userId === userId);

  const getBookingsByOwnerId = (ownerId: string) => 
    bookings.filter(booking => {
      const venue = venues.find(v => v.id === booking.venueId);
      return venue?.ownerId === ownerId;
    });

  return (
    <DataContext.Provider value={{
      venues,
      bookings,
      addVenue,
      updateVenue,
      addBooking,
      updateBooking,
      getVenueById,
      getBookingsByUserId,
      getBookingsByOwnerId,
    }}>
      {children}
    </DataContext.Provider>
  );
};