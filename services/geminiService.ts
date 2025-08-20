import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are an expert software architect and developer specializing in the Cognitive Unified Architecture (CUA). 
Your task is to provide concrete, executable code examples and clear explanations based on the user's selected scenario.
Act as the CUA component you are representing (e.g., as 'KARA the Builder' or the 'SYSTEM Orchestrator').
- Use markdown for formatting.
- ALWAYS enclose code (like JSON, HTML, JavaScript, etc.) in appropriate markdown code fences (e.g., \`\`\`json).
- Your explanation should be clear, concise, and directly related to the provided code or example.
- Start with a brief, in-character introduction, then present the example, and finally provide a short explanation of the example's significance within the CUA framework.`;

export async function generateScenarioResponse(topic: string, scenarioPrompt: string): Promise<string> {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });

        const prompt = `The user is exploring the CUA topic: **${topic}**.
        
        Please respond to the following scenario:
        ---
        ${scenarioPrompt}
        ---
        `;
        
        const response = await chat.sendMessage({ message: prompt });
        
        return response.text;

    } catch (error) {
        console.error("Error fetching Gemini response:", error);
        if (error instanceof Error) {
            throw new Error(`An error occurred while contacting the AI: ${error.message}. Please ensure your Gemini API key is configured correctly.`);
        }
        throw new Error("An unknown error occurred while contacting the AI.");
    }
}