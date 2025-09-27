import os
from PIL import Image

def imagesToPDF(file_name):
    imagesPath = [i for i in os.listdir("../../temp/screenshots") if i.endswith(".png")]
    imagesPath = sorted(imagesPath, key=lambda x: int(x.split('_')[1].split('.')[0]))
    
    images = [Image.open(os.path.join("../../temp/screenshots", img)) for img in imagesPath if img.endswith(".png")]
    if images:
        images[0].save(f"../../temp/slides/{file_name.split('.')[0]}_slides.pdf", save_all=True, append_images=images[1:])
    else:
        print("No images found.")

if __name__ == "__main__":
    file_name = "2025-06-26 21-00-29 (s24 mfm5).mov"
    imagesToPDF(file_name)