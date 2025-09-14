import React, { useState } from 'react';

const FacilityManagement: React.FC = () => {
  const [facilities, setFacilities] = useState([
    { id: '1', name: 'Main Court', type: 'Tennis', status: 'active', bookings: 12 },
    { id: '2', name: 'Training Court', type: 'Basketball', status: 'maintenance', bookings: 0 },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Facility Management</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Your Facilities</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your sports facilities and bookings</p>
        </div>
        
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {facilities.map((facility) => (
              <li key={facility.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{facility.name}</h4>
                    <p className="text-sm text-gray-500">{facility.type}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      facility.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {facility.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Bookings: {facility.bookings}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FacilityManagement;
