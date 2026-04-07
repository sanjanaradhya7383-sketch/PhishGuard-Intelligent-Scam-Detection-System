const Tesseract = require("tesseract.js");

async function extractTextFromImage(imagePath) {
  try {
    const result = await Tesseract.recognize(
      imagePath,
      "eng",
      {
        logger: m => console.log(m)
      }
    );

    return result.data.text;

  } catch (err) {
    console.error("OCR ERROR:", err);
    return "";
  }
}

module.exports = extractTextFromImage;