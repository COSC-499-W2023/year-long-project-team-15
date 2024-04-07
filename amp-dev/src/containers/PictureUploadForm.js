import React, { useState } from "react";
import { Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import AcceptButton from "../components/AcceptButton";
import DeclineButton from "../components/DeclineButton";

const PictureUploadForm = ({ handleSendContent }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uniqueKey, setUniqueKey] = useState(null);
  const [bucketConfig, setBucketConfig] = useState({
    level: "",
    name: "",
    region: "",
  });
  const [outputBucketConfig, setOutputBucketConfig] = useState({
    level: "",
    name: "",
    region: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile( file );
      setProcessedUrl(null);
      determineBucket(file);
    }
  };

  const determineBucket = (file) => {
    console.log("file", file);
    console.log(file.type);
    console.log(file.name);

    if (file.type.startsWith("image/") && !file.type.startsWith("image/gif")) {
      setBucketConfig({
        level: "public",
        name: "blurvid-content204708-staging",
        region: "ca-central-1",
      });
      setFileType("image");
      setOutputBucketConfig({
        level: "public",
        name: "blurvid-photos",
        region: "ca-central-1",
      });
      const uniqueKey = uuidv4() + file.name;
      setUniqueKey(uniqueKey);
    } else if (
      file.type.startsWith("video/") ||
      file.type.startsWith("image/gif")
    ) {
      setBucketConfig({
        level: "public",
        name: "rekognitionvideofaceblurr-inputimagebucket20b2ba6b-kfbjqw5ifll4",
        region: "us-west-2",
      });
      setFileType("video");
      setOutputBucketConfig({
        level: "public",
        name: "rekognitionvideofaceblurr-outputimagebucket1311836-seosn2svhtxh",
        region: "us-west-2",
      });
      const uniqueKey = uuidv4() + file.name;
      setUniqueKey(uniqueKey);
    } else {
      setSelectedFile(null);
      setSnackbarMessage("Unsupported file type");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();

    handleSendContent(uniqueKey, title, description, fileType);

    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setIsLoading(false);
    setProcessedUrl(null);
  };

  const clearFile = async (event) => {
    event.preventDefault();
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setProcessedUrl(null);
    setIsLoading(false);
    if (pollingInterval) clearInterval(pollingInterval);
    return;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setSnackbarMessage("Please select a file to upload");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    // Generate a unique file key using UUID

    if (!bucketConfig) {
      alert("Unsupported file type");
      return;
    }

    console.log("Uploading file with unique key:", uniqueKey);
    setIsLoading(true); // Start loading

    try {
      const result = await Storage.put(uniqueKey, selectedFile, {
        level: bucketConfig.level,
        bucket: bucketConfig.name,
        region: bucketConfig.region,
      });

      console.log("Succeeded:", result);

      startPollingForProcessedContent(uniqueKey);
    } catch (error) {
      console.error("Upload error:", error);
      setSnackbarMessage("Upload failed");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } 
  };

  let pollingInterval = null;

  const startPollingForProcessedContent = (fileName) => {
    const pollingFrequency = 5000; // Poll every 5 seconds
    pollingInterval = setInterval(
      () => checkStatus(fileName),
      pollingFrequency
    );
  };

  const checkStatus = async (fileName) => {
    try {
      console.log(outputBucketConfig.name);
      console.log(outputBucketConfig.region);
      console.log(fileName);
      const url = await Storage.get(fileName, {
        level: outputBucketConfig.level,
        bucket: outputBucketConfig.name,
        region: outputBucketConfig.region,
      });
      console.log(url);
  
      if (fileType === 'video') {
        // Handle video files
        const video = document.createElement('video');
  
        // Optional: add listeners for video-specific events here
  
        video.onloadeddata = () => {
          // Video is loaded, update state
          setProcessedUrl(url);
          setIsLoading(false);
          clearInterval(pollingInterval);
        };
        video.onerror = () => {
          // Error handling for video loading
          console.log('Error loading video');
          // Optionally implement a retry limit or error handling logic here
        };
        video.src = url;
        video.load(); // Start loading the video
      } else if (fileType === 'image'){
        // Handle image files as before
        const img = new Image();
        img.onload = () => {
          // Image has loaded, update state
          setProcessedUrl(url);
          setIsLoading(false);
          clearInterval(pollingInterval);
        };
        img.src = url;
      }
  
      console.log(processedUrl);
    } catch (error) {
      console.log("content not ready yet:", error.message);
      // Optionally implement a retry limit or error handling logic here
    }
  };
  
  // const checkStatus = async (fileName) => {
  //   try {
  //     console.log(outputBucketConfig.name);
  //     console.log(outputBucketConfig.region);
  //     console.log(fileName);
  //     const url = await Storage.get(fileName, {
  //       bucket: outputBucketConfig.name,
  //       region: outputBucketConfig.region,
  //     });
  //     console.log(url)
  //     const img = new Image();

  //     // Set up onload event
  //     img.onload = () => {
  //       // Image has loaded, update state
  //       setProcessedUrl(url);
  //       setIsLoading(false);
  //       clearInterval(pollingInterval);
  //     };
  //     img.src = url;

  //     console.log(processedUrl);
  //   } catch (error) {
  //     console.log("content not ready yet:", error.message);
  //     // Optionally implement a retry limit or error handling logic
  //   }
  // };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      {isLoading ? (
        <div className="d-flex flex-column align-items-center">
          <CircularProgress/>
          <div>Blurring... This may take a while :/</div>
        </div>
      ) : processedUrl ? (
        <div>
          <div className="image-container">
            {fileType === "video" ? (
              <video controls src={processedUrl} style={{ maxWidth: '100%', maxHeight: '300px' }} />
            ) : (
              <img src={processedUrl} alt="Processed" />
            )}
          </div>
          <div className="d-flex justify-content-end">
            <DeclineButton
              label="Cancel"
              onClick={clearFile}
            />
            <AcceptButton
              label="Send"
              onClick={handleSend}
            />
          </div>
        </div>
      ) : (
        <form>
          <Typography>Upload Content</Typography>
          <div className="d-flex justify-content-start">
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
          >
            Upload
            <input
              type="file"
              hidden
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </Button>
          { selectedFile? (
            <Typography
              variant="caption"
              sx={{mb:'0', mt:'1.5em'}}
            >
              {selectedFile.name}
            </Typography>
          ) : (<Typography></Typography>)}
          </div>
          <TextField
            fullWidth
            type="text"
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            type="textarea"
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
          <div className="d-flex justify-content-end">
          { !selectedFile? (
            <Typography
             mt='auto'
             mr='0.5em'
            >
              Upload a file to continue
            </Typography>
          ) : (<Typography></Typography>)}
            <Button
              sx={{ flex: "flex-end" }}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!selectedFile}
            >
              Submit
            </Button>
          </div>
        </form>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PictureUploadForm;
