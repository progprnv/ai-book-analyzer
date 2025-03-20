async function analyzeBook(bookTitle) {
    const API_KEY = 'YOUR'; // Secure in backend for production
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
        console.log(`🔍 Sending request for book: "${bookTitle}"`);

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

        console.log(`🔄 API Request Sent, waiting for response...`);

        if (!response.ok) {
            console.error(`❌ API Error: ${response.status} - ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        console.log(`✅ API Response Received:`, data);

        // Extract the text response from the API
        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!responseText) {
            console.error('⚠️ No text content found in response!');
            return null;
        }

        console.log(`📜 Raw Response Text:`, responseText);

        // Extract JSON from text
        const jsonMatch = responseText.match(/\{.*\}/s);
        if (!jsonMatch) {
            console.error('⚠️ No JSON found in response!');
            return null;
        }

        console.log(`📜 Extracted JSON:`, jsonMatch[0]);

        // Parse JSON safely
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (jsonError) {
            console.error('❌ JSON Parse Error:', jsonError);
            return null;
        }

    } catch (error) {
        console.error('❌ API Error:', error);
        return null;
    }
}
