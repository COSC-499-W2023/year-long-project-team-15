import React, { useEffect, useRef, useState } from 'react';
import { Storage } from 'aws-amplify';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useGetMessages } from '../hooks/useGetMessages';

const VideoMessagesList = ({ selectedFriend }) => {
  const { currentUserId } = useCurrentUser();
  const [enhancedMessages, setEnhancedMessages] = useState([]);
  const { messages, loading, error, fetchMessages } = useGetMessages({ selectedFriend });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    const enhanceMessagesWithUrls = async () => {
      const enhanced = await Promise.all(messages.map(async (message) => {
        const url = await fetchMediaUrl(message.id);
        return { ...message, url };
      }));
      setEnhancedMessages(enhanced);
    };

    if (messages.length > 0) {
      enhanceMessagesWithUrls();
    }
  }, [messages, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [enhancedMessages]);

  const fetchMediaUrl = async (key) => {
    try {
      return await Storage.get(key, {
        bucket: 'blurvid-photos',
        region: 'ca-central-1',
      });
    } catch (error) {
      console.error('Error fetching media from S3', error);
      return null;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading messages</div>;

  return (
    <Box
      sx={{
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {enhancedMessages.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: 'flex',
            justifyContent: message.senderID === currentUserId ? 'flex-end' : 'flex-start',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          <Card sx={{ 
              maxWidth: '60%', 
              width: message.message ? 'fit-content' : '100%',
              bgcolor: message.senderID !== currentUserId ? '' : '#e9ecef', 
           }}>
            <CardContent>
              {message.message ? (
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{message.message}</Typography>
              ) : (
                <>
                  <Typography color="textSecondary" gutterBottom>
                    {message.title}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {message.description}
                  </Typography>
                  {message.url && (
                    <Box display="flex" justifyContent="center">
                      {message.url.endsWith('.mp4') ? (
                        <video controls src={message.url} style={{ maxWidth: '100%', maxHeight: '300px' }} />
                      ) : (
                        <img src={message.url} alt={message.title} style={{ maxWidth: '100%', maxHeight: '300px' }} />
                      )}
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default VideoMessagesList;
