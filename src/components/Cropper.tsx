import React, { useEffect, useRef, useState } from "react";
import ReactCrop, {
  Crop
} from "react-image-crop"; // Import types from react-image-crop
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "./ui/button";

// Define the props type for Cropper
interface CropperProps {
  uploadedImage: string;
  crop: Crop | undefined;
  setCrop: React.Dispatch<React.SetStateAction<Crop | undefined>>;
  onCropComplete: (croppedImage: string, croppedFile: Blob) => void;
}
const Cropper: React.FC<CropperProps> = ({
  uploadedImage,
  crop,
  setCrop,
  onCropComplete,
}) => {
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [myCrop, setMyCrop] = useState<Crop | undefined>()
  const imageRef = useRef<HTMLImageElement>(null);
 
  const initialCrop = ():Crop | undefined => {
    if (!imageRef.current) return;
    return {
      x: 0,
      y: 0,
      width: 200,
      height: 200,
      unit: "px",
    };
  };

 
  useEffect(() => {
    if(!crop) 
      setMyCrop(initialCrop())
    
  }, [crop])


  const generateCroppedImage = async (crop: Crop | null) => {
    if (!crop || !crop.width || !crop.height || !imageRef.current) return;

    const image = new Image();
    image.src = uploadedImage;
    image.width = imageRef.current.width;
    image.height = imageRef.current.height;

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.floor(crop.width);
    canvas.height = Math.floor(crop.height);
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }
    
    canvas.toBlob((file) => {
      if(!file) return 
      const croppedImageUrl = canvas.toDataURL("image/jpg");
      onCropComplete(croppedImageUrl, file); 
    }, "image/jpg")
   
  };

  return (
    <>
      <ReactCrop
        aspect={1 / 1}
        crop={crop || myCrop}
        onChange={(newCrop) => setCrop(newCrop)}
        onComplete={(crop) => setCompletedCrop(crop)}
        maxHeight={200}
        circularCrop={true}
      >
        <img ref={imageRef} alt="Crop me" src={uploadedImage} />
      </ReactCrop>
      <Button type="button" onClick={() => generateCroppedImage(completedCrop)}>
        Crop Image
      </Button>
    </>
  );
};

export default Cropper;
