import React, {useState} from "react";
import axios from 'axios';


const CloudinaryUpload = () => {
    const [imageUrl, setImageUrl] = useState("");

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const formData = new FormData;
        formData.append("file", file);
        formData.append("upload_preset", olx-clone);

         try {
            const res = await axios.post(
                "https://api.cloudinary.com/v1_1/dhrrrgsc6/image/upload", formData);
                setImageUrl(res.data.secure_url);
         } catch (error) {
            console.error("Upload failed:", error);
         }
    }

    return (
        <div className="flex flex-col items-center gap-4">
          <input type="file" onChange={handleUpload} />
          {imageUrl && (
            <img src={imageUrl} alt="Uploaded" className="w-48 h-48 object-cover rounded" />
          )}
        </div>
      );
}