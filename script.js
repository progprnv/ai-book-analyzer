async function getBookSummary() {
    const bookTitle = document.getElementById('bookInput').value.trim();
    if (!bookTitle) {
        alert("Please enter a book title!");
        return;
    }

    const API_KEY = "YOUR_API_KEY_HERE"; // Secure this in a backend for production
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    // Show loading text
    document.getElementById('response').textContent = "⏳ Fetching summary...";

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Give a short summary of the book "${bookTitle}". Just output the text, no JSON.`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const summaryText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!summaryText) throw new Error("No summary received!");

        document.getElementById('response').textContent = summaryText;

    } catch (error) {
        document.getElementById('response').textContent = `❌ Error: ${error.message}`;
    }
}
