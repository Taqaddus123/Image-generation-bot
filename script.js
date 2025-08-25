const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("promptInput");
const loader = document.getElementById("loader");
const generatedImage = document.getElementById("generatedImage");

generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    alert("Please enter a prompt!");
    return;
  }

  generateBtn.disabled = true;
  loader.classList.remove("hidden");
  generatedImage.classList.remove("show");
  generatedImage.style.display = "none";

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (data.imageBase64) {
      generatedImage.src = `data:image/png;base64,${data.imageBase64}`;
      generatedImage.style.display = "block";

      // Force reflow to re-trigger CSS transition
      void generatedImage.offsetWidth;
      generatedImage.classList.add("show");
    } else {
      alert("Failed to generate image.");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong. Please try again.");
  } finally {
    loader.classList.add("hidden");
    generateBtn.disabled = false;
  }
});
