// ✅ Ensure script.js is loaded
console.log("✅ script.js is loaded and running");

// ✅ Function to analyze a book using the API
async function analyzeBook(bookTitle) {
    const API_KEY = 'YOUR_API_KEY_HERE'; // 🔒 Move this to a backend in production
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
        console.log(`🔍 Requesting analysis for: "${bookTitle}"`);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Analyze the book "${bookTitle}". Provide:
1. Page count (as number only)
2. Estimated reading time in hours (average speed)
3. Brief 50-word summary
4. Top 3 categories
Format as JSON ONLY: {"pageCount": number, "readingTime": number, "summary": string, "categories": string[]}`
                    }]
                }]
            })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status} - ${response.statusText}`);

        const data = await response.json();
        console.log('✅ Raw API Response:', data);

        // Extract response text
        let responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!responseText) throw new Error('⚠️ No text content found in response!');

        console.log('📜 Raw Response Text:', responseText);

        // **FIX: Remove markdown code block (```json ... ```)**
        responseText = responseText.replace(/```json|```/g, '').trim();

        console.log('📜 Cleaned JSON Text:', responseText);

        // Parse JSON safely
        return JSON.parse(responseText);

    } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
    }
}

// ✅ Attach processBook to window to make it accessible globally
window.processBook = async function() {
    console.log("📖 Processing book...");

    const bookInput = document.getElementById('bookInput');
    const bookTitle = bookInput.value.trim();

    if (!bookTitle || bookTitle.length > 100) {
        alert('Please enter a valid book title (max 100 characters).');
        return;
    }

    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    try {
        loading.style.display = 'block'; // Show loading message
        results.style.opacity = '0.5';   // Fade results

        const analysis = await analyzeBook(bookTitle);

        // ✅ Update DOM with results
        document.getElementById('pageCount').textContent = `${analysis.pageCount} pages`;
        document.getElementById('readingTime').textContent = `${analysis.readingTime} hours (${Math.round(analysis.readingTime / 2)} days at 2hr/day)`;
        document.getElementById('summary').textContent = analysis.summary;
        document.getElementById('category').textContent = analysis.categories.join(' | ');

    } catch (error) {
        alert('Error analyzing book: ' + error.message);
    } finally {
        loading.style.display = 'none';  // Hide loading
        results.style.opacity = '1';     // Restore results opacity
    }
};

// ✅ Ensure event listeners work
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded and ready");

    // Attach event listener to button
    document.querySelector("button").addEventListener("click", processBook);

    // Enable "Enter" keypress for input
    document.getElementById('bookInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processBook();
    });
});
