import React from "react";

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div>
      <h2>Upload KML File</h2>
      <input type="file" accept=".kml" onChange={handleFileChange} />
    </div>
  );
};

export default FileUpload;