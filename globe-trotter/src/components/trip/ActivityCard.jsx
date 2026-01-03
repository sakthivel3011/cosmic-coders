import React, { useState } from 'react';
import { 
  FiClock, 
  FiDollarSign, 
  FiMapPin, 
  FiHeart, 
  FiEdit2, 
  FiTrash2,
  FiStar,
  FiUsers,
  FiInfo
} from 'react-icons/fi';
import { Modal, ConfirmationModal } from '../common/Modal';
import toast from 'react-hot-toast';

const ActivityCard = ({ 
  activity, 
  onEdit, 
  onDelete, 
  onToggleFavorite,
  editable = true,
  variant = 'default',
  onClick
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(activity.isFavorite || false);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(activity.id, !isFavorite);
    }
    toast.success(!isFavorite ? 'Added to favorites' : 'Removed from favorites');
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(activity.id);
      toast.success('Activity deleted');
    }
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(activity);
    }
  };

  const cardVariants = {
    default: 'bg-white border border-gray-200',
    selected: 'bg-gt-bg-section border-gt-primary border-2',
    compact: 'bg-gray-50 border-none'
  };

  const iconVariants = {
    sightseeing: '🌆',
    food: '🍽️',
    adventure: '🏔️',
    culture: '🏛️',
    shopping: '🛍️',
    relaxation: '🏖️',
    transportation: '🚗',
    accommodation: '🏨'
  };

  return (
    <>
      <div 
        className={`
          rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300
          ${cardVariants[variant]} ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        `}
        onClick={() => onClick && onClick(activity)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{iconVariants[activity.category] || '📍'}</span>
              <h3 className="font-bold text-gray-800 truncate">{activity.name}</h3>
              {activity.rating && (
                <div className="flex items-center gap-1 ml-2">
                  <FiStar className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium">{activity.rating}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{activity.description}</p>
          </div>
          
          {editable && (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={handleFavoriteToggle}
                className="p-2 text-gray-400 hover:text-red-500 transition"
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FiHeart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
              </button>
              <button
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-gt-primary transition"
                title="Edit activity"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-gray-400 hover:text-red-600 transition"
                title="Delete activity"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <FiClock className="text-gray-400" />
            <span>{activity.duration || '--'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <FiDollarSign className="text-gray-400" />
            <span className="font-medium text-gt-primary">₹{activity.cost?.toLocaleString() || '0'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <FiMapPin className="text-gray-400" />
            <span className="truncate">{activity.location || '--'}</span>
          </div>
          
          {activity.groupSize && (
            <div className="flex items-center gap-2 text-sm">
              <FiUsers className="text-gray-400" />
              <span>Up to {activity.groupSize}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {activity.tags && activity.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {activity.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gt-soft text-gt-primary text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {activity.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{activity.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Notes Preview */}
        {activity.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-start gap-2">
              <FiInfo className="w-4 h-4 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-600 line-clamp-2">{activity.notes}</p>
            </div>
          </div>
        )}

        {/* More Info Button */}
        <button
          onClick={() => setShowDetails(true)}
          className="mt-4 w-full text-center text-sm text-gt-primary hover:text-gt-secondary hover:underline"
        >
          View Details
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Activity"
        message={`Are you sure you want to delete "${activity.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={activity.name}
        size="lg"
      >
        <div className="space-y-6">
          {/* Activity Image */}
          {activity.imageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={activity.imageUrl} 
                alt={activity.name}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
            <p className="text-gray-600">{activity.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <FiClock />
                Duration
              </div>
              <div className="font-semibold">{activity.duration || 'Not specified'}</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <FiDollarSign />
                Cost
              </div>
              <div className="font-semibold text-gt-primary">₹{activity.cost?.toLocaleString() || '0'}</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <FiMapPin />
                Location
              </div>
              <div className="font-semibold">{activity.location || 'Not specified'}</div>
            </div>
            
            {activity.groupSize && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <FiUsers />
                  Group Size
                </div>
                <div className="font-semibold">Up to {activity.groupSize} people</div>
              </div>
            )}
            
            {activity.category && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span className="text-lg">{iconVariants[activity.category] || '📍'}</span>
                  Category
                </div>
                <div className="font-semibold capitalize">{activity.category}</div>
              </div>
            )}
            
            {activity.rating && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <FiStar className="text-yellow-500" />
                  Rating
                </div>
                <div className="font-semibold">{activity.rating}/5</div>
              </div>
            )}
          </div>

          {/* Tags */}
          {activity.tags && activity.tags.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {activity.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 bg-gt-soft text-gt-primary text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {activity.notes && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Additional Notes</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">{activity.notes}</p>
              </div>
            </div>
          )}

          {/* Booking Info */}
          {activity.bookingInfo && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Booking Information</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-700">{activity.bookingInfo}</p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

// Activity Form Component
export const ActivityForm = ({ activity, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: activity?.name || '',
    description: activity?.description || '',
    category: activity?.category || 'sightseeing',
    cost: activity?.cost || '',
    duration: activity?.duration || '',
    location: activity?.location || '',
    groupSize: activity?.groupSize || '',
    notes: activity?.notes || '',
    tags: activity?.tags?.join(', ') || ''
  });

  const categories = [
    { value: 'sightseeing', label: 'Sightseeing', icon: '🌆' },
    { value: 'food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'adventure', label: 'Adventure', icon: '🏔️' },
    { value: 'culture', label: 'Culture', icon: '🏛️' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'relaxation', label: 'Relaxation', icon: '🏖️' },
    { value: 'transportation', label: 'Transportation', icon: '🚗' },
    { value: 'accommodation', label: 'Accommodation', icon: '🏨' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      cost: parseInt(formData.cost) || 0,
      groupSize: parseInt(formData.groupSize) || null,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activity Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="E.g., Eiffel Tower Visit"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
            required
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Cost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cost (₹) *
          </label>
          <div className="relative">
            <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="0"
              min="0"
              required
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <div className="relative">
            <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="E.g., 2 hours, Full day"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="E.g., Paris, France"
            />
          </div>
        </div>

        {/* Group Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group Size
          </label>
          <input
            type="number"
            name="groupSize"
            value={formData.groupSize}
            onChange={handleChange}
            className="input-field"
            placeholder="Number of people"
            min="1"
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
            placeholder="E.g., landmark, family-friendly, romantic"
          />
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
            placeholder="Describe this activity..."
            rows="3"
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input-field min-h-[80px]"
            placeholder="Any additional information..."
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
          {loading ? 'Saving...' : activity ? 'Update Activity' : 'Add Activity'}
        </button>
      </div>
    </form>
  );
};

export { ActivityCard };
export default ActivityCard;