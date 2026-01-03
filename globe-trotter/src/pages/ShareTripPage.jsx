import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { 
  FiShare2, FiCopy, FiFacebook, FiTwitter, 
  FiInstagram, FiMail, FiCalendar, FiMapPin, 
  FiDollarSign, FiGlobe 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const ShareTripPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const docRef = doc(db, 'trips', tripId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTrip({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out my trip on GlobeTrotter!`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gt-primary"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="page-padding text-center">
        <div className="card-padded max-w-md mx-auto">
          <FiGlobe className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Trip Not Found</h2>
          <p className="text-gray-600 mb-6">This trip doesn't exist or has been made private.</p>
          <Link to="/" className="btn-primary">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gt-bg-light to-white">
      <div className="page-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <FiGlobe className="text-5xl text-gt-primary mx-auto mb-4" />
            <h1 className="heading-primary">{trip.name}</h1>
            <p className="text-gray-600">Shared via GlobeTrotter</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Trip Info */}
            <div className="lg:col-span-2">
              <div className="card-padded mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Trip Overview</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    trip.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : trip.status === 'ongoing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trip.status || 'planning'}
                  </span>
                </div>

                <p className="text-gray-700 mb-6">{trip.description || 'No description provided.'}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gt-bg-section p-4 rounded-lg">
                    <FiCalendar className="text-gt-primary mb-2" />
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gt-bg-section p-4 rounded-lg">
                    <FiMapPin className="text-gt-primary mb-2" />
                    <p className="text-sm text-gray-600">Cities</p>
                    <p className="font-semibold">{trip.cities?.length || 0}</p>
                  </div>
                  <div className="bg-gt-bg-section p-4 rounded-lg">
                    <FiDollarSign className="text-gt-primary mb-2" />
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-semibold">₹{trip.budget?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="bg-gt-bg-section p-4 rounded-lg">
                    <FiGlobe className="text-gt-primary mb-2" />
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-semibold">
                      {new Date(trip.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-padded">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Itinerary Preview</h2>
                {trip.cities?.slice(0, 3).map((city, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <h3 className="font-semibold text-gray-800 mb-2">{city.name}</h3>
                    <div className="pl-4 border-l-2 border-gt-primary">
                      {city.activities?.slice(0, 2).map((activity, actIndex) => (
                        <div key={actIndex} className="mb-2 text-sm text-gray-600">
                          • {activity.name} - ₹{activity.cost}
                        </div>
                      ))}
                      {city.activities?.length > 2 && (
                        <div className="text-sm text-gt-primary">
                          +{city.activities.length - 2} more activities
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {trip.cities?.length > 3 && (
                  <div className="text-center mt-4">
                    <p className="text-gt-primary font-medium">
                      +{trip.cities.length - 3} more cities
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Share Options */}
            <div>
              <div className="card-padded sticky top-24">
                <div className="text-center mb-6">
                  <FiShare2 className="text-4xl text-gt-primary mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Share this Trip</h2>
                  <p className="text-gray-600">Inspire others with your travel plans</p>
                </div>

                <div className="space-y-4 mb-8">
                  <button
                    onClick={handleCopyLink}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <FiCopy /> {copied ? 'Copied!' : 'Copy Link'}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={shareOnFacebook}
                      className="bg-[#1877F2] hover:bg-[#166FE5] text-white py-3 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <FiFacebook /> Facebook
                    </button>
                    <button
                      onClick={shareOnTwitter}
                      className="bg-[#1DA1F2] hover:bg-[#1A91DA] text-white py-3 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <FiTwitter /> Twitter
                    </button>
                  </div>

                  <button className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] hover:opacity-90 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition">
                    <FiInstagram /> Instagram
                  </button>

                  <button className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition">
                    <FiMail /> Email
                  </button>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 mb-4">Want to create your own trip?</h3>
                  <Link to="/signup" className="w-full btn-primary block text-center">
                    Sign Up Free
                  </Link>
                  <p className="text-sm text-gray-600 text-center mt-3">
                    Already have an account?{' '}
                    <Link to="/login" className="text-gt-primary font-medium">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Created with ❤️ using GlobeTrotter
            </p>
            <Link to="/" className="text-gt-primary font-semibold hover:underline">
              Create your own travel plan →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareTripPage;