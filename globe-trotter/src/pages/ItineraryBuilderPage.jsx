import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { 
  FiMapPin, 
  FiCalendar, 
  FiPlus, 
  FiTrash2, 
  FiSave, 
  FiArrowLeft,
  FiChevronUp,
  FiChevronDown,
  FiSettings,
  FiEye,
  FiShare2,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiGrid,
  FiList
} from 'react-icons/fi';
import { CityCard, CityForm, EmptyCityCard } from '../components/trip/CityCard';
import { ActivityCard, ActivityForm } from '../components/trip/ActivityCard';
import { Modal, ConfirmationModal, AlertModal } from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ItineraryBuilderPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Modal states
  const [showCityModal, setShowCityModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Selected items
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editingCity, setEditingCity] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  
  // View modes
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [expandedCities, setExpandedCities] = useState({});
  
  // Trip settings
  const [tripSettings, setTripSettings] = useState({
    autoSave: true,
    showCosts: true,
    showDurations: true,
    groupByDay: true,
    compactView: false
  });

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'trips', tripId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const tripData = { id: docSnap.id, ...docSnap.data() };
        setTrip(tripData);
        
        // Verify ownership
        if (tripData.userId !== currentUser?.uid) {
          toast.error('You do not have permission to edit this trip');
          navigate('/dashboard');
        }
        
        // Initialize expanded cities
        const expanded = {};
        tripData.cities?.forEach((city, index) => {
          expanded[city.id || index] = false;
        });
        setExpandedCities(expanded);
      } else {
        toast.error('Trip not found');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching trip:', error);
      toast.error('Failed to load trip');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = () => {
    setEditingCity(null);
    setShowCityModal(true);
  };

  const handleEditCity = (city) => {
    setEditingCity(city);
    setShowCityModal(true);
  };

  const handleDeleteCity = (city) => {
    setSelectedCity(city);
    setShowDeleteModal(true);
  };

  const handleAddActivity = (cityId) => {
    setSelectedCity(cityId);
    setEditingActivity(null);
    setShowActivityModal(true);
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setShowActivityModal(true);
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      // Remove activity from its city
      const cityId = editingActivity?.cityId || selectedCity;
      const updatedCities = trip.cities.map(city => {
        if (city.id === cityId) {
          return {
            ...city,
            activities: city.activities?.filter(act => act.id !== activityId) || []
          };
        }
        return city;
      });

      await saveTrip({ cities: updatedCities });
      toast.success('Activity deleted');
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    }
  };

  const handleSaveCity = async (cityData) => {
    try {
      setSaving(true);
      
      const newCity = {
        id: editingCity?.id || Date.now().toString(),
        ...cityData,
        activities: editingCity?.activities || []
      };

      let updatedCities;
      if (editingCity) {
        // Update existing city
        updatedCities = trip.cities.map(city =>
          city.id === editingCity.id ? newCity : city
        );
      } else {
        // Add new city
        updatedCities = [...(trip.cities || []), newCity];
      }

      await saveTrip({ cities: updatedCities });
      setShowCityModal(false);
      setEditingCity(null);
      toast.success(editingCity ? 'City updated' : 'City added');
    } catch (error) {
      console.error('Error saving city:', error);
      toast.error('Failed to save city');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveActivity = async (activityData) => {
    try {
      setSaving(true);
      
      const newActivity = {
        id: editingActivity?.id || Date.now().toString(),
        ...activityData
      };

      const updatedCities = trip.cities.map(city => {
        if (city.id === selectedCity) {
          const activities = city.activities || [];
          if (editingActivity) {
            // Update existing activity
            return {
              ...city,
              activities: activities.map(act =>
                act.id === editingActivity.id ? newActivity : act
              )
            };
          } else {
            // Add new activity
            return {
              ...city,
              activities: [...activities, newActivity]
            };
          }
        }
        return city;
      });

      await saveTrip({ cities: updatedCities });
      setShowActivityModal(false);
      setEditingActivity(null);
      toast.success(editingActivity ? 'Activity updated' : 'Activity added');
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCityConfirm = async () => {
    try {
      setSaving(true);
      const updatedCities = trip.cities.filter(city => city.id !== selectedCity.id);
      await saveTrip({ cities: updatedCities });
      setShowDeleteModal(false);
      toast.success('City removed from trip');
    } catch (error) {
      console.error('Error deleting city:', error);
      toast.error('Failed to delete city');
    } finally {
      setSaving(false);
    }
  };

  const saveTrip = async (updates) => {
    try {
      const tripRef = doc(db, 'trips', tripId);
      await updateDoc(tripRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      setTrip(prev => ({ ...prev, ...updates }));
      return true;
    } catch (error) {
      console.error('Error saving trip:', error);
      throw error;
    }
  };

  const toggleCityExpand = (cityId) => {
    setExpandedCities(prev => ({
      ...prev,
      [cityId]: !prev[cityId]
    }));
  };

  const moveCity = async (fromIndex, toIndex) => {
    const cities = [...trip.cities];
    const [movedCity] = cities.splice(fromIndex, 1);
    cities.splice(toIndex, 0, movedCity);
    
    try {
      await saveTrip({ cities });
      toast.success('City order updated');
    } catch (error) {
      console.error('Error moving city:', error);
      toast.error('Failed to reorder cities');
    }
  };

  const handleShareTrip = () => {
    setShowShareModal(true);
  };

  const handleSaveTrip = async () => {
    try {
      setSaving(true);
      await saveTrip({});
      toast.success('Trip saved successfully!');
    } catch (error) {
      toast.error('Failed to save trip');
    } finally {
      setSaving(false);
    }
  };

  const calculateTripStats = () => {
    if (!trip?.cities) return { totalCost: 0, totalActivities: 0, totalDays: 0 };
    
    let totalCost = 0;
    let totalActivities = 0;
    
    trip.cities.forEach(city => {
      city.activities?.forEach(activity => {
        totalCost += activity.cost || 0;
      });
      totalActivities += city.activities?.length || 0;
    });
    
    const totalDays = trip.cities.length || 0;
    
    return { totalCost, totalActivities, totalDays };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading itinerary..." />
      </div>
    );
  }

  const stats = calculateTripStats();

  return (
    <div className="min-h-screen bg-gt-bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="container-responsive py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/trip/${tripId}/view`)}
                className="p-2 text-gray-600 hover:text-gt-primary hover:bg-gray-100 rounded-lg transition"
                title="Back to view"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{trip?.name}</h1>
                <p className="text-gray-600">Building itinerary • {trip?.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiDollarSign />
                <span>₹{stats.totalCost.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiMapPin />
                <span>{stats.totalDays} cities</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiClock />
                <span>{stats.totalActivities} activities</span>
              </div>
              
              <div className="h-6 border-l border-gray-300"></div>
              
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 text-gray-600 hover:text-gt-primary hover:bg-gray-100 rounded-lg transition"
                title="Settings"
              >
                <FiSettings className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleShareTrip}
                className="p-2 text-gray-600 hover:text-gt-primary hover:bg-gray-100 rounded-lg transition"
                title="Share"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleSaveTrip}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                <FiSave />
                {saving ? 'Saving...' : 'Save Trip'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-responsive py-8">
        {/* View Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Itinerary Builder</h2>
            <p className="text-gray-600">Add cities and plan activities for your trip</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                title="Grid View"
              >
                <FiGrid className={viewMode === 'grid' ? 'text-gt-primary' : 'text-gray-500'} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                title="List View"
              >
                <FiList className={viewMode === 'list' ? 'text-gt-primary' : 'text-gray-500'} />
              </button>
            </div>
            
            <button
              onClick={handleAddCity}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus />
              Add City
            </button>
          </div>
        </div>

        {/* Cities Grid/List */}
        {trip?.cities && trip.cities.length > 0 ? (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-6'
            }
          `}>
            {trip.cities.map((city, index) => (
              <div key={city.id || index} className="relative">
                {viewMode === 'list' && index > 0 && (
                  <div className="absolute left-8 top-0 h-6 w-0.5 bg-gray-300 -translate-y-full"></div>
                )}
                
                <div className="relative">
                  {/* Order Controls */}
                  {viewMode === 'list' && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 flex flex-col gap-1">
                      {index > 0 && (
                        <button
                          onClick={() => moveCity(index, index - 1)}
                          className="p-1 text-gray-400 hover:text-gt-primary hover:bg-gray-100 rounded"
                          title="Move up"
                        >
                          <FiChevronUp className="w-4 h-4" />
                        </button>
                      )}
                      {index < trip.cities.length - 1 && (
                        <button
                          onClick={() => moveCity(index, index + 1)}
                          className="p-1 text-gray-400 hover:text-gt-primary hover:bg-gray-100 rounded"
                          title="Move down"
                        >
                          <FiChevronDown className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                  
                  <CityCard
                    city={city}
                    onEdit={() => handleEditCity(city)}
                    onDelete={() => handleDeleteCity(city)}
                    onAddActivity={() => handleAddActivity(city.id)}
                    isExpanded={expandedCities[city.id || index]}
                    onToggleExpand={() => toggleCityExpand(city.id || index)}
                    isDraggable={viewMode === 'list'}
                  />
                </div>
                
                {viewMode === 'list' && index < trip.cities.length - 1 && (
                  <div className="ml-8 h-6 w-0.5 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyCityCard onAddCity={handleAddCity} />
        )}

        {/* Stats Summary */}
        {trip?.cities && trip.cities.length > 0 && (
          <div className="mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Trip Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gt-bg-section rounded-lg">
                <div className="text-2xl font-bold text-gt-primary">{stats.totalDays}</div>
                <div className="text-sm text-gray-600">Cities</div>
              </div>
              <div className="text-center p-4 bg-gt-bg-section rounded-lg">
                <div className="text-2xl font-bold text-gt-primary">{stats.totalActivities}</div>
                <div className="text-sm text-gray-600">Activities</div>
              </div>
              <div className="text-center p-4 bg-gt-bg-section rounded-lg">
                <div className="text-2xl font-bold text-gt-primary">
                  ₹{stats.totalCost.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Estimated Cost</div>
              </div>
              <div className="text-center p-4 bg-gt-bg-section rounded-lg">
                <div className="text-2xl font-bold text-gt-primary">
                  ₹{stats.totalDays > 0 ? Math.round(stats.totalCost / stats.totalDays).toLocaleString() : '0'}
                </div>
                <div className="text-sm text-gray-600">Avg. per city</div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate(`/trip/${tripId}/view`)}
                className="btn-secondary flex items-center gap-2 mx-auto"
              >
                <FiEye />
                Preview Itinerary
              </button>
            </div>
          </div>
        )}
      </main>

      {/* City Modal */}
      <Modal
        isOpen={showCityModal}
        onClose={() => {
          setShowCityModal(false);
          setEditingCity(null);
        }}
        title={editingCity ? `Edit ${editingCity.name}` : 'Add New City'}
        size="lg"
        isLoading={saving}
      >
        <CityForm
          city={editingCity}
          onSubmit={handleSaveCity}
          onCancel={() => {
            setShowCityModal(false);
            setEditingCity(null);
          }}
          loading={saving}
        />
      </Modal>

      {/* Activity Modal */}
      <Modal
        isOpen={showActivityModal}
        onClose={() => {
          setShowActivityModal(false);
          setEditingActivity(null);
        }}
        title={editingActivity ? 'Edit Activity' : 'Add New Activity'}
        size="lg"
        isLoading={saving}
      >
        <ActivityForm
          activity={editingActivity}
          onSubmit={handleSaveActivity}
          onCancel={() => {
            setShowActivityModal(false);
            setEditingActivity(null);
          }}
          loading={saving}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteCityConfirm}
        title={`Remove ${selectedCity?.name}?`}
        message="Are you sure you want to remove this city from your trip? All activities in this city will also be removed."
        confirmText="Remove City"
        cancelText="Cancel"
        variant="danger"
        isLoading={saving}
      />

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Builder Settings"
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Auto Save</h4>
                <p className="text-sm text-gray-600">Automatically save changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={tripSettings.autoSave}
                  onChange={(e) => setTripSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gt-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Show Costs</h4>
                <p className="text-sm text-gray-600">Display activity costs</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={tripSettings.showCosts}
                  onChange={(e) => setTripSettings(prev => ({ ...prev, showCosts: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gt-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Compact View</h4>
                <p className="text-sm text-gray-600">Show more content in less space</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={tripSettings.compactView}
                  onChange={(e) => setTripSettings(prev => ({ ...prev, compactView: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gt-primary"></div>
              </label>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full btn-primary"
            >
              Apply Settings
            </button>
          </div>
        </div>
      </Modal>

      {/* Share Modal */}
      <AlertModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Trip"
        message="Your trip itinerary is being prepared for sharing. Share options will be available when you save the trip."
        type="info"
        buttonText="Got it"
      />

      {/* Saving Indicator */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-gt-primary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <LoadingSpinner size="sm" color="white" />
          Saving changes...
        </div>
      )}
    </div>
  );
};

export default ItineraryBuilderPage;