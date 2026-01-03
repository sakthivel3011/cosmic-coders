import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import { useAuth } from '../hooks/useAuth';
import TripCard from '../components/trip/TripCard';
import { 
  FiPlus, FiCalendar, FiMapPin, FiDollarSign, 
  FiCompass, FiTrendingUp, FiChevronLeft, FiChevronRight, FiStar, FiAward 
} from 'react-icons/fi';

const DashboardPage = () => {
  const { trips, loading, getTrips } = useTrips();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalBudget: 0,
    totalCities: 0,
  });
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    getTrips();
  }, []);

  useEffect(() => {
    if (trips) {
      const totalTrips = trips.length;
      const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
      const totalCities = trips.reduce((sum, trip) => sum + (trip.cities?.length || 0), 0);
      
      setStats({ totalTrips, totalBudget, totalCities });
    }
  }, [trips]);

  // Popular packages data
  const popularPackages = [
    {
      id: 1,
      title: 'India Tour Packages',
      tours: 98,
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
      category: 'india',
      description: 'Explore incredible India'
    },
    {
      id: 2,
      title: 'International Tour Packages',
      tours: 362,
      image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800',
      category: 'international',
      description: 'Discover the world'
    },
    {
      id: 3,
      title: 'Beach Destinations',
      tours: 145,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      category: 'beach',
      description: 'Relax on pristine beaches'
    }
  ];

  const handlePackageClick = (pkg) => {
    setSelectedCategory(pkg.category);
    setShowAllPackages(true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 absolute top-0"></div>
        </div>
      </div>
    );
  }

  if (showAllPackages) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="page-padding fade-in py-8">
          <button 
            onClick={() => setShowAllPackages(false)}
            className="mb-8 flex items-center gap-2 px-6 py-3 bg-white text-green-600 hover:bg-green-600 hover:text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
          >
            <FiChevronLeft className="text-xl" /> Back to Dashboard
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            {popularPackages.find(p => p.category === selectedCategory)?.title}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-${1500000000000 + item * 10000}?w=400&h=250&fit=crop`}
                    alt={`Package ${item}`}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=250&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Amazing Tour Package {item}</h3>
                  <p className="text-gray-600 mb-4 flex items-center gap-2">
                    <FiCalendar className="text-green-500" /> 7 Days • 6 Nights
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(star => (
                      <FiStar key={star} className="text-yellow-400 fill-yellow-400 text-sm" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(4.9)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Starting from</span>
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">₹25,999</div>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in bg-gradient-to-br from-green-50 via-white to-green-100 min-h-screen">
      {/* Hero Section with Welcome */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-700 to-green-800 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative container mx-auto max-w-7xl px-4 py-8 text-left">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 text-white drop-shadow-2xl tracking-tight">
            Welcome to GlobeTrip
          </h1>
          {user?.displayName && (
            <p className="text-3xl md:text-4xl mb-4 text-white/95 font-light">
              Hello, <span className="font-semibold">{user.displayName}</span>! 👋
            </p>
          )}
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl">
            Plan, organize, and share your travel adventures
          </p>
        </div>
      </div>

      {/* Video/Hero Banner Section */}
      <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 via-transparent to-green-900/20 flex items-center justify-center z-10">
          <div className="text-center text-white px-4 backdrop-blur-sm bg-black/10 rounded-3xl p-8">
            <p className="text-2xl md:text-3xl mb-6 font-light text-green-300 drop-shadow-2xl tracking-widest" style={{ fontFamily: 'cursive' }}>
              adventure
            </p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white drop-shadow-2xl leading-tight">
              travel, world class
            </h2>
            <p className="text-base md:text-xl max-w-4xl mx-auto text-white/95 drop-shadow-lg leading-relaxed">
              The real voyage of discovery consists not in seeking new landscapes, but in having new eyes. 
              Discover it with GTHolidays, the No.1 travel brand in South India
            </p>
          </div>
          <button className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-xl">
            <FiChevronLeft className="text-white text-2xl md:text-3xl" />
          </button>
          <button className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-xl">
            <FiChevronRight className="text-white text-2xl md:text-3xl" />
          </button>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&h=600&fit=crop"
          alt="Travel Adventure"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Popular Packages Section */}
      <div className="page-padding py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent">
            Popular Tour Packages
          </h2>
          <p className="text-gray-600 text-lg">Discover amazing destinations around the world</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {popularPackages.map((pkg) => (
            <div 
              key={pkg.id}
              onClick={() => handlePackageClick(pkg)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white"
            >
              <div className="relative h-96 overflow-hidden">
                <img 
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <FiAward /> Featured
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-300">
                  <h3 className="text-3xl md:text-4xl font-bold mb-3 text-white drop-shadow-lg">{pkg.title}</h3>
                  <p className="text-white/80 mb-4 text-lg">{pkg.description}</p>
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold px-6 py-3 rounded-full text-lg shadow-xl group-hover:scale-105 transition-transform">
                    <FiStar className="fill-gray-900" />
                    {pkg.tours} TOURS
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats and Your Trips Section */}
      <div className="page-padding pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-semibold uppercase tracking-wider mb-2">Total Trips</p>
                <h3 className="text-4xl font-bold">{stats.totalTrips}</h3>
              </div>
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <FiCalendar className="text-4xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-semibold uppercase tracking-wider mb-2">Total Budget</p>
                <h3 className="text-4xl font-bold">₹{(stats.totalBudget/1000).toFixed(0)}K</h3>
              </div>
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <FiDollarSign className="text-4xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-semibold uppercase tracking-wider mb-2">Cities Visited</p>
                <h3 className="text-4xl font-bold">{stats.totalCities}</h3>
              </div>
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <FiMapPin className="text-4xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-semibold uppercase tracking-wider mb-2">Planning</p>
                <h3 className="text-4xl font-bold">
                  {trips?.filter(t => t.status === 'planning').length || 0}
                </h3>
              </div>
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <FiCompass className="text-4xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">
                Your Trips
              </h2>
              <p className="text-gray-600">Manage and explore your travel plans</p>
            </div>
            <Link 
              to="/create-trip" 
              className="group px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
            >
              <FiPlus className="text-xl group-hover:rotate-90 transition-transform duration-300" /> 
              Plan New Trip
            </Link>
          </div>

          {trips && trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center shadow-xl border-2 border-dashed border-gray-300">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <FiCompass className="text-5xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Trips Yet</h3>
              <p className="text-gray-600 mb-8 text-lg">Start planning your first adventure today!</p>
              <Link 
                to="/create-trip" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <FiPlus className="text-xl" /> Create Your First Trip
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;