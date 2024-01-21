const resizeImage = (file, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      const canvas = document.createElement("canvas");
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, width, height);

      canvas.toBlob(resolve, file.type);
    };
    image.onerror = reject;
  });
};

export default resizeImage;
