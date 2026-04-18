import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

let genAI = null;

const getGenAI = () => {
  if (!genAI && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
};

const buildContextPrompt = (context) => {
  return `
You are the **AI Agent Manager** for PacPay. Your mission is to provide professional, analytical advice on finance, markets, and budgeting.

CORE SCOPE:
- You ONLY handle FINANCE, MONEY, STOCKS, BUDGETING, and SAVINGS.
- Stocks, market prices, and future spending projections ARE your primary duties.
- If a query is NOT about these topics, professionally state that you only handle financial queries.

User Financial Context:
- Level: ${context.level || 1}
- XP: ${context.xp || 0}
- Behavior Score: ${context.behaviorScore || 85}/100
- PacTokens Balance: ${context.pacTokens || 10000}
- Monthly Budget Threshold: $${context.monthlyBudget || 2000}
- Current Spending: $${context.currentSpending || 0}
- Savings Rate: ${(context.savingsRate || 0.15) * 100}%
- Streak: ${context.streakDays || 0} days

Guidelines:
1. Be analytical, professional, and strategic.
2. Provide actionable financial advice — specific steps, not vague tips.
3. Reference their behavior score to guide improvements.
4. celebrate financial wins and milestones.
5. NEVER answer non-financial questions.
`;
};

export const generateAIResponse = async (userMessage, context, conversationHistory = []) => {
  const ai = getGenAI();
  
  if (!ai) {
    return "The AI Agent Manager is currently in offline maintenance mode. Please ensure your Gemini API Key is configured. Based on your current profile, I recommend maintaining a low spending profile to boost your behavior score.";
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = buildContextPrompt(context);
    const historyContext = conversationHistory
      .slice(-6)
      .map(m => `${m.role === 'user' ? 'USER' : 'AGENT_MANAGER'}: ${m.content}`)
      .join('\n');

    const prompt = `${systemPrompt}\n\nCommunication History:\n${historyContext}\n\nUSER QUERY: ${userMessage}\n\nAGENT_RESPONSE:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Agent Manager Link Failure:', error);
    return "Warning: Uplink to financial matrix interrupted. Please retry in a moment.";
  }
};
