import api from "./api";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/uploads/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.image;
};

export const uploadAudio = async (file) => {
  const formData = new FormData();
  formData.append("audio", file);

  const response = await api.post("/uploads/audio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.audio;
};