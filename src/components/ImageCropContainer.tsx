import React, {  useRef, useState } from "react";
import Cropper from "./Cropper"; // Import the presentational component
import { type Crop } from "react-image-crop";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription,  DialogHeader, DialogTitle } from "./ui/dialog";

const ImageCropContainer = ({
  imageUrl,
  onImageChange,
}: {
  imageUrl: string | undefined;
  onImageChange: any;
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | undefined>(); // For the image source
  const [crop, setCrop] = useState<Crop | undefined>();
  const [croppedImage, setCroppedImage] = useState<string | undefined>();
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [openModal, setOpenModal] = useState(false)

  // Function to handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string); // Set image source
      };
      reader.readAsDataURL(file);
      setOpenModal(true)
    }
  };

  // Handle final cropped image from presentational component
  const onCropComplete = (croppedData: string) => {
    setCroppedImage(() => {
      onImageChange(croppedData)
      setOpenModal(false)
      return croppedData
    });
  };

  
  const onOpenFileDialog = () => {
    if(!inputFileRef.current) return
    inputFileRef.current.click()
  }

  const onCloseModal = () => {
    setUploadedImage(undefined)
    setOpenModal(prev => !prev)
  }

  return (
    <div>
       <img className="rounded-full p-8 my-0 mx-auto" src={croppedImage || imageUrl} />
       <Button type="button" variant={"link"} onClick={onOpenFileDialog}>Change Image</Button>
       <Input ref={inputFileRef} style={{visibility: "hidden"}} type="file" accept="image/*" onChange={handleImageUpload} />
       <Dialog open={openModal} onOpenChange={onCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit your image</DialogTitle>
            <DialogDescription></DialogDescription>
              {uploadedImage && (
                <Cropper
                  uploadedImage={uploadedImage}
                  crop={crop}
                  setCrop={setCrop}
                  onCropComplete={onCropComplete}
                />
              )}
           
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { ImageCropContainer };
