import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { expenses } = await req.json();
    
    // In hackathon demo, if key isn't provided, return mock response.
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        insight: "Based on your recent spending, you've spent 20% more on food this week! Cutting back could save you ₹400 by next week. Good job keeping transport costs down." 
      });
    }

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an AI financial coach for a gamified fintech app. The user just submitted these recent expenses: 
    ${JSON.stringify(expenses)}. 
    Analyze them quickly and provide a short, encouraging 2-sentence insight to help them save money and earn XP. Do not use markdown format formatting.`;

    const result = await model.generateContent(prompt);
    const insight = result.response.text();

    return NextResponse.json({ insight });
  } catch (error) {
    console.error('AI Insight Error:', error);
    return NextResponse.json({ error: 'Failed to generate insight.' }, { status: 500 });
  }
}
