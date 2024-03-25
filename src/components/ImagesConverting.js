import React, { useState } from 'react';
import './style.css';

const ImageConverter = () => {
  const [inputFile, setInputFile] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [convertFormat, setConvertFormat] = useState('jpeg');

  const convertImage = async (file, format) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const image = new Image();
            image.src = event.target.result;
            image.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    resolve(url);
                }, `image/${format}`);
            };
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setInputFile(file);
  };

  const handleConvert = async () => {
    if (inputFile) {
      try {
        const output = await convertImage(inputFile, convertFormat);
        setOutputImage(output);
      } catch (error) {
        console.error(error);
        alert('Conversion failed. Please try again.');
      }
    } else {
      alert('Select an image first!');
    }
  };

  const handleDownload = () => {
    if (outputImage) {
      const link = document.createElement('a');
      link.href = outputImage;
      link.download = 'converted-image.' + convertFormat;
      link.click();
    }
  };

	return (
	  <div className="ic-card">
		<h2 className="ic-title">IMAGES CONVERTING</h2>
		<div className="ic-coverts">
		  <input className="ic-input-file" type="file" accept="image/jpeg, image/png, image/webp" onChange={handleImageUpload} />
		  <select className="ic-input-select" value={convertFormat} onChange={(e) => setConvertFormat(e.target.value)}>
			<option value="jpeg">JPEG</option>
			<option value="png">PNG</option>
			<option value="webp">WEBP</option>
		  </select>
		</div>
		<button className="ic-input-button" onClick={handleConvert}>Convert</button>
		<div className="ic-result">
		  {outputImage && <img src={outputImage} alt="Converted Image" />}
		</div>
		{outputImage && <button className="ic-download" onClick={handleDownload}>Download</button>}
	  </div>
	);
};

export default ImageConverter;