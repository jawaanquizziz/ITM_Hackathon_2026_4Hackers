import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const { userMessage, context, conversationHistory } = await req.json();

    if (!userMessage || !context) {
      return NextResponse.json({ error: 'Incomplete parameters' }, { status: 400 });
    }

    const response = await generateAIResponse(userMessage, context, conversationHistory || []);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('[API_CHAT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
