const { GoogleGenerativeAI } = require("@google/generative-ai");

const key = "AIzaSyCTNnnmEsIq9QuuwNUQgkY64RmrMQy2zpU";

async function test() {
  console.log("Testing Key directly...");
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    console.log("SUCCESS! Response:", response.text());
  } catch (err) {
    console.error("FAILURE:", err.message);
  }
}

test();
