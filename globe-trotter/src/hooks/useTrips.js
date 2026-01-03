import { useState } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';

export const useTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const getTrips = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, 'trips'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const tripsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrips(tripsData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTrip = async (tripData) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, 'trips'), {
        ...tripData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      await getTrips();
      return docRef.id;
    } catch (err) {
      setError(err.message);
      console.error('Error adding trip:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (tripId, tripData) => {
    setLoading(true);
    setError(null);
    try {
      const tripRef = doc(db, 'trips', tripId);
      await updateDoc(tripRef, {
        ...tripData,
        updatedAt: new Date().toISOString()
      });
      await getTrips();
    } catch (err) {
      setError(err.message);
      console.error('Error updating trip:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'trips', tripId));
      await getTrips();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting trip:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    trips,
    loading,
    error,
    getTrips,
    addTrip,
    updateTrip,
    deleteTrip
  };
};
