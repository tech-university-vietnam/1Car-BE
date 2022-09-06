export default function mapFilesToArray(images: any) {
  const files: any[] = [];
  let currentImage = images;
  let nestedImage = null;
  do {
    nestedImage = currentImage[''];
    if (nestedImage) {
      delete currentImage[''];
      files.push(currentImage);
      currentImage = nestedImage;
    } else {
      files.push(currentImage);
    }
  } while (nestedImage != undefined);

  return files;
}
