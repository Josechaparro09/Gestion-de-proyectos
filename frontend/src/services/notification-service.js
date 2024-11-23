import { db } from '../utils/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export const getNotifications = async (userId, limitCount = 50) => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('destinatarios', 'array-contains', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      notificationId: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      leido: arrayUnion(userId)
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};