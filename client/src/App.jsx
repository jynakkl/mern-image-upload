import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      await axios.post("http://localhost:3000/upload", formData);
    } catch (error) {}
  };

  const getImages = async () => {
    try {
      const res = await axios.get("http://localhost:3000/upload");

      setImages(res.data.message);
    } catch (error) {}
  };

  useEffect(() => {
    getImages();
  }, []);
  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          name="profilePic"
          id="profilePic"
        />
        <button>Upload</button>
      </form>
      <div>
        {images.map((image) => (
          <p key={image._id}>
            <img src={image.url} alt="image" />
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
