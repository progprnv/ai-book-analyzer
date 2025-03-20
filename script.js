async function analyzeBook(bookTitle) {
    const API_KEY = 'AIzaSyDpujbyrAZ1I_hniPtJNZwnMClGSjfLj-A'; // Secure in backend for production
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
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
        console.log('Raw API Response:', data); // Debugging

        // Extract text response
        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!responseText) throw new Error('Invalid API response format');

        // Ensure response contains JSON
        const jsonMatch = responseText.match(/\{.*\}/s);
        if (!jsonMatch) throw new Error('No JSON found in response');

        // Parse extracted JSON
        return JSON.parse(jsonMatch[0]);

    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
