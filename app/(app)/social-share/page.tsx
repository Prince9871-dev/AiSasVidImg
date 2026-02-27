"use client"
import React,{useEffect, useState, useRef} from "react"
import { CldImage } from "next-cloudinary"

const socialFormats = {
  "Instagram Square (1:1)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  "Instagram Portrait (4:5)": {
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
  },
  "Twitter Post (16:9)": {
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
  },
  "Twitter Header (3:1)": {
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
  },
  "Facebook Cover (205:78)": {
    width: 820,
    height: 312,
    aspectRatio: "205:78",
  },
};

type socialFormat = keyof typeof socialFormats

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [selectedFormat, setSelectedFormat] = useState<socialFormat>(
    "Instagram Square (1:1)"
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file  = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    //since reaching out to the backend api route we need to use fetch and then send the form data to the backend
    try { 
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      }) 
      if (response.ok) {
        const data = await response.json();
        setUploadedImage(data.public_id);
      }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    }

  const handleDownload = () => {
    if (!imageRef.current) return;
    //fetch is getting url from the imageRef and then we are converting it to blob and then creating a link to download the image   
    //we are using the selectedFormat to create a dynamic file name for the downloaded image
    fetch(imageRef.current.src)
    //blob is a file-like object of immutable, raw data. It can be read as text or binary data, or converted into a ReadableStream so its methods can be used for processing the data.
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary URL for the blob and trigger a download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        // Set the download attribute with a filename based on the selected format
        link.href = url;
        // Replace spaces and special characters in the filename
        link.download = `${selectedFormat.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.jpg`;
        // Append the link to the document, trigger the click, and then remove the link
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

 return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Social Media Image Creator
      </h1>

      {/* Upload Section */}
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Upload an Image</h2>

          <input
            type="file"
            onChange={handleFileUpload}
            className="file-input file-input-bordered file-input-primary w-full"
          />

          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}
        </div>
      </div>

      {/* Show Only After Upload */}
      {uploadedImage && (
        <>
          {/* Format Selection */}
          <div className="mt-6">
            <h2 className="mb-4 font-semibold text-lg">
              Select Social Media Format
            </h2>

            <select
              className="select select-bordered w-full"
              value={selectedFormat}
              onChange={(e) =>
                //setSelectedFormat() updates state
                setSelectedFormat(e.target.value as socialFormat)
              }
            >
              
              {Object.keys(socialFormats).map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          <div className="mt-6 relative">
            <h3 className="text-lg font-semibold mb-2">Preview:</h3>

            <div className="flex justify-center">
              {isTransforming && (
                <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              )}

              <CldImage
                width={socialFormats[selectedFormat].width}
                height={socialFormats[selectedFormat].height}
                src={uploadedImage}
                sizes="100vw"
                alt="transformed image"
                crop="fill"
                aspectRatio={socialFormats[selectedFormat].aspectRatio}
                gravity="auto"
                ref={imageRef}
                className="w-full"
              />
            </div>
          </div>

          {/* Download Button */}
          <div className="card-actions justify-end mt-6">
            <button className="btn btn-primary" onClick={handleDownload}>
              Download Image
            </button>
          </div>
        </>
      )}
    </div>
  );
}