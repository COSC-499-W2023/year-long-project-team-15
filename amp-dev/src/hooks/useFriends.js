
import { useState, useEffect } from 'react';
import { fetchFriendRequests, fetchFriendDetails } from '../services/FriendService';
import { getAuthenticatedUserId } from '../services/AuthService';

const processFriendRequests = (sentRequests, receivedRequests) => {
  const friendIds = new Set();
  sentRequests.forEach(request => friendIds.add(request.receiverID));
  receivedRequests.forEach(request => friendIds.add(request.senderID));
  return Array.from(friendIds);
};

const useFriends = () => {
  const [friendsData, setFriendsData] = useState([]);

  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const userId = await getAuthenticatedUserId();
        const { sentRequests, receivedRequests } = await fetchFriendRequests(userId);

        // Combine friend requests into a single list of unique friend IDs
        const uniqueFriendIds = processFriendRequests(sentRequests, receivedRequests);

        // Fetch details for each friend
        const friends = await fetchFriendDetails(uniqueFriendIds);
        setFriendsData(friends);
      } catch (error) {
        console.error("Error fetching friends data:", error);
      }
    };

    fetchFriendsData();
  }, []);

  return friendsData;
};

export default useFriends;
