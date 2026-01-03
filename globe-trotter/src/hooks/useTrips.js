import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './useAuth';

export function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const getTrips = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, 'trips'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const tripsData = [];
      querySnapshot.forEach((doc) => {
        tripsData.push({ id: doc.id, ...doc.data() });
      });
      setTrips(tripsData);
    } catch (error) {
      console.error('Error getting trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData) => {
    if (!currentUser) return null;
    
    try {
      const docRef = await addDoc(collection(db, 'trips'), {
        ...tripData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating trip:', error);
      return null;
    }
  };

  const updateTrip = async (tripId, tripData) => {
    try {
      await updateDoc(doc(db, 'trips', tripId), tripData);
      return true;
    } catch (error) {
      console.error('Error updating trip:', error);
      return false;
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      await deleteDoc(doc(db, 'trips', tripId));
      return true;
    } catch (error) {
      console.error('Error deleting trip:', error);
      return false;
    }
  };

  useEffect(() => {
    getTrips();
  }, [currentUser]);

  return {
    trips,
    loading,
    getTrips,
    createTrip,
    updateTrip,
    deleteTrip,
  };
}