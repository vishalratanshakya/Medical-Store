async function testUnsigned() {
  console.log("Testing Unsigned Upload with preset: 'medical-store'...");
  const formData = new FormData();
  
  formData.append("file", "https://res.cloudinary.com/demo/image/upload/sample.jpg");
  formData.append("upload_preset", "medical-store");
  formData.append("cloud_name", "daowawj5g");
  formData.append("folder", "medical-store");

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/daowawj5g/image/upload", {
      method: "POST",
      body: formData,
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log("Unsigned Upload Success! Result URL:", data.secure_url);
    } else {
      console.log("Unsigned Upload Failed! Response:", data);
    }
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

testUnsigned();
