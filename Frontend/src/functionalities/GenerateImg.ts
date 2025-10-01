export default async function GenerateImg(prompt:string) {
  try {
    const randomPage = Math.floor(Math.random() * 50) + 1; // Pages 1–50
    const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(prompt)}&per_page=1&page=${randomPage}`,
    { headers: { Authorization: "vlKLfkcE8D1Xqx4oW2auFV0Mx4cHWZyWIjoxTbVa277kx45XJUB92q1o" } }
    );

    const data = await response.json();

    if (data.photos && data.photos.length > 0) {
      return {
        type: "img",
        url: data.photos[0].src.medium,
        alt: prompt,
      };
    } else {
      return {
        type: "img",
        url: "error",
        alt: "No image found",
      };
    }
  } catch (error) {
    return {
      type: "img",
      url: "error",
      alt: "Error fetching image",
    };
  }
}