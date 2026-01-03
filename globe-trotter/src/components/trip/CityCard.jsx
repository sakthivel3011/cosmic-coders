import React, { useState } from 'react';
import { 
  FiMapPin, 
  FiCalendar, 
  FiDollarSign, 
  FiEdit2, 
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiStar,
  FiCloud,
  FiUsers
} from 'react-icons/fi';
import { ConfirmationModal } from '../common/Modal';
import ActivityCard from './ActivityCard';
import toast from 'react-hot-toast';

const CityCard = ({ 
  city, 
  onEdit, 
  onDelete, 
  onAddActivity,
  onReorder,
  isDraggable = false,
  isExpanded = false,
  onToggleExpand
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivities, setShowActivities] = useState(isExpanded);
  const [isDragging, setIsDragging] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(city.id);
      toast.success(`${city.name} removed from trip`);
    }
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(city);
    }
  };

  const handleDragStart = (e) => {
    if (!isDraggable) return;
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', city.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const totalCityCost = city.activities?.reduce((sum, activity) => sum + (activity.cost || 0), 0) || 0;

  return (
    <>
      <div 
        className={`
          bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden
          transition-all duration-300 hover:shadow-lg
          ${isDragging ? 'opacity-50 scale-95' : ''}
          ${isDraggable ? 'cursor-move' : ''}
        `}
        draggable={isDraggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* City Header */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gt-primary rounded-lg text-white">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{city.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>{city.country}</span>
                    {city.countryCode && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {city.countryCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <FiCalendar className="text-gray-400" />
                  <span>{city.visitDate || city.duration || '--'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <FiDollarSign className="text-gray-400" />
                  <span className="font-medium text-gt-primary">
                    ₹{totalCityCost.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-xs">estimated</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <FiUsers className="text-gray-400" />
                  <span>{city.activities?.length || 0} activities</span>
                </div>
                
                {city.weather && (
                  <div className="flex items-center gap-2 text-sm">
                    <FiCloud className="text-gray-400" />
                    <span>{city.weather}°C</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              {onReorder && (
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  title="Drag to reorder"
                >
                  ⋮⋮
                </button>
              )}
              
              <button
                onClick={() => setShowActivities(!showActivities)}
                className="p-2 text-gray-400 hover:text-gt-primary hover:bg-gray-100 rounded-lg transition"
                title={showActivities ? 'Hide activities' : 'Show activities'}
              >
                {showActivities ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
              </button>
              
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="p-2 text-gray-400 hover:text-gt-primary hover:bg-gray-100 rounded-lg transition"
                  title="Edit city"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Remove city"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          {city.description && (
            <p className="text-gray-600 mb-4">{city.description}</p>
          )}

          {/* Tags */}
          {city.tags && city.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {city.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gt-soft text-gt-primary text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          {city.notes && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <FiStar className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">{city.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Activities Section */}
        {showActivities && (
          <div className="border-t border-gray-200">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-800">Activities ({city.activities?.length || 0})</h4>
                {onAddActivity && (
                  <button
                    onClick={() => onAddActivity(city.id)}
                    className="px-4 py-2 bg-gt-primary text-white text-sm font-medium rounded-lg hover:bg-gt-secondary transition"
                  >
                    + Add Activity
                  </button>
                )}
              </div>

              {city.activities && city.activities.length > 0 ? (
                <div className="space-y-4">
                  {city.activities.map((activity, index) => (
                    <ActivityCard
                      key={activity.id || index}
                      activity={activity}
                      variant="compact"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiMapPin className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>No activities added yet</p>
                  {onAddActivity && (
                    <button
                      onClick={() => onAddActivity(city.id)}
                      className="mt-3 text-gt-primary hover:text-gt-secondary font-medium"
                    >
                      Add your first activity
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={`Remove ${city.name}?`}
        message={`Are you sure you want to remove ${city.name} from this trip? All activities in this city will also be removed.`}
        confirmText="Remove City"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
};

// City Form Component
export const CityForm = ({ city, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: city?.name || '',
    country: city?.country || '',
    countryCode: city?.countryCode || '',
    visitDate: city?.visitDate || '',
    duration: city?.duration || '',
    description: city?.description || '',
    notes: city?.notes || '',
    tags: city?.tags?.join(', ') || '',
    budget: city?.budget || ''
  });

  const popularCities = [
    { name: 'Paris', country: 'France', code: 'FR' },
    { name: 'Tokyo', country: 'Japan', code: 'JP' },
    { name: 'New York', country: 'USA', code: 'US' },
    { name: 'London', country: 'UK', code: 'GB' },
    { name: 'Dubai', country: 'UAE', code: 'AE' },
    { name: 'Sydney', country: 'Australia', code: 'AU' },
    { name: 'Singapore', country: 'Singapore', code: 'SG' },
    { name: 'Bangkok', country: 'Thailand', code: 'TH' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectCity = (selectedCity) => {
    setFormData(prev => ({
      ...prev,
      name: selectedCity.name,
      country: selectedCity.country,
      countryCode: selectedCity.code
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      budget: parseInt(formData.budget) || 0,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Select */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Select Popular Cities
          </label>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((popCity, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectCity(popCity)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-gt-primary hover:bg-gt-soft transition"
              >
                {popCity.name}, {popCity.country}
              </button>
            ))}
          </div>
        </div>

        {/* City Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="E.g., Paris"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="input-field"
            placeholder="E.g., France"
            required
          />
        </div>

        {/* Country Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country Code
          </label>
          <input
            type="text"
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="input-field"
            placeholder="E.g., FR"
            maxLength="2"
          />
        </div>

        {/* Visit Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visit Date
          </label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="input-field"
            placeholder="E.g., 3 days"
          />
        </div>

        {/* Budget */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City Budget (₹)
          </label>
          <div className="relative">
            <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="Estimated budget for this city"
              min="0"
            />
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field min-h-[100px]"
            placeholder="Describe this city, your expectations, etc..."
            rows="3"
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="input-field"
            placeholder="E.g., romantic, historic, foodie, nightlife"
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personal Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input-field min-h-[80px]"
            placeholder="Any special notes or reminders..."
            rows="2"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gt-primary text-white font-medium rounded-lg hover:bg-gt-secondary transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : city ? 'Update City' : 'Add City'}
        </button>
      </div>
    </form>
  );
};

// Empty State City Card
export const EmptyCityCard = ({ onAddCity }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-8 text-center">
      <FiMapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Cities Added</h3>
      <p className="text-gray-500 mb-6">Start building your trip by adding cities</p>
      <button
        onClick={onAddCity}
        className="btn-primary flex items-center gap-2 mx-auto"
      >
        + Add First City
      </button>
    </div>
  );
};

export { CityCard };
export default CityCard;