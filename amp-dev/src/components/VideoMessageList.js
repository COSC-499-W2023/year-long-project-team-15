import React, { useEffect, useRef, useState } from 'react';
import { Storage } from 'aws-amplify';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useCurrentUser } from '../hooks/useCurrentUser';

const VideoMessagesList = ({ messages, error, loading }) => {
  const { currentUserId } = useCurrentUser();
  const [enhancedMessages, setEnhancedMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const fetchMediaUrl = async (message) => {
    let bucket = {};
    let region = {};

    if (message.contentType === 'video') {
      bucket = 'rekognitionvideofaceblurr-outputimagebucket1311836-seosn2svhtxh';
      region = 'us-west-2';
    } else {
      bucket = 'blurvid-photos';
      region = 'ca-central-1';
    }

    try {
      return await Storage.get(message.id, {
        bucket,
        region,
      });
    } catch (error) {
      console.error('Error fetching media from S3', error);
      return null;
    }
  };

  useEffect(() => {
    const enhanceMessagesWithUrls = async () => {
      const enhanced = await Promise.all(messages.map(async (message) => {
        if(message.message){
          return { ...message };
        }else{
          const url = await fetchMediaUrl(message);
          return { ...message, url };
        }
      }));
      setEnhancedMessages(enhanced);
    };

    if (messages.length > 0) {
      enhanceMessagesWithUrls();
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [enhancedMessages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 3000);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading messages</div>;

  return (
        <Box
          sx={{
            maxHeight: 'calc(100vh - 220px)',
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
                          {message.contentType === 'video' ? (
                            <video controls src={message.url} style={{ maxWidth: '100%', maxHeight: '300px' }} />
                          ) : (
                            <img src={message.url} alt={message.title} style={{ maxWidth: '100%', width: 'fit-content' }} />
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
