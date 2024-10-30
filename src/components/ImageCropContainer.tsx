import React, { useRef, useState } from 'react'
import Cropper from './Cropper' // Import the presentational component
import { type Crop } from 'react-image-crop'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog'
import { TrashIcon } from 'lucide-react'
import DummyImage from '../assets/no-profile-picture-icon.png'

const ImageCropContainer = ({
    imageUrl,
    onImageChange,
    deleteFile,
}: {
    imageUrl: string | undefined
    onImageChange: any
    deleteFile: (name: string, removeKey: 'cvUrl' | 'profileImage') => void
}) => {
    const [uploadedImage, setUploadedImage] = useState<string | undefined>() // For the image source
    const [crop, setCrop] = useState<Crop | undefined>()
    const [croppedImage, setCroppedImage] = useState<string | undefined>()
    const inputFileRef = useRef<HTMLInputElement>(null)
    const [openModal, setOpenModal] = useState(false)

    // Function to handle image upload
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setUploadedImage(reader.result as string) // Set image source
            }
            reader.readAsDataURL(file)
            setOpenModal(true)
        }
        event.target.value = ''
    }

    // Handle final cropped image from presentational component
    const onCropComplete = (croppedData: string, croppedFile: Blob) => {
        setCroppedImage(() => {
            onImageChange({
                image: croppedData,
                file: croppedFile,
            })
            setOpenModal(false)
            return croppedData
        })
    }

    const onOpenFileDialog = () => {
        if (!inputFileRef.current) return
        inputFileRef.current.click()
    }

    const onCloseModal = () => {
        setOpenModal((prev) => !prev)
        setUploadedImage(undefined)
    }

    const hasImage = croppedImage || imageUrl
    const srcImage = hasImage ? hasImage : DummyImage
    
    return (
        <div>
            <img
                className="rounded-full p-8 my-0 mx-auto h-[200px]"
                src={srcImage}
            />
            <div className="space-y2">
                <Button
                    type="button"
                    variant={'link'}
                    onClick={onOpenFileDialog}
                >
                    Change Image
                </Button>
                {hasImage && (
                    <Button
                        type={'button'}
                        variant="outline"
                        onClick={() =>
                            deleteFile('profileImage', 'profileImage')
                        }
                    >
                        <TrashIcon className="w-4 h-4" />
                    </Button>
                )}
            </div>
            <Input
                ref={inputFileRef}
                style={{ visibility: 'hidden' }}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
            />
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
    )
}

export { ImageCropContainer }
