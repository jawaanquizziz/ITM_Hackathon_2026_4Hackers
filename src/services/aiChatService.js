import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

let genAI = null;

const getGenAI = () => {
  if (!genAI && API_KEY) {
    try {
      genAI = new GoogleGenerativeAI(API_KEY);
    } catch (e) {
      console.error("AI Initialization Failed:", e);
    }
  }
  return genAI;
};

// --- LOCAL VIRTUAL INTELLIGENCE FALLBACK ---
const virtualIntelligenceFallback = (message, context) => {
  const msg = message.toLowerCase();
  const spent = context.currentSpending || 0;
  const budget = context.monthlyBudget || 2000;
  const score = context.behaviorScore || 85;
  const level = context.level || 1;

  if (msg.includes('balance') || msg.includes('how much') || msg.includes('money')) {
    return `Your current vault balance is ₹${context.pacTokens.toLocaleString()}. Tracking your ${spent > budget ? 'high' : 'healthy'} spending of ₹${spent} against a ₹${budget} threshold. Your current behavior score is ${score}/100.`;
  }
  
  if (msg.includes('level') || msg.includes('xp') || msg.includes('rank')) {
    return `You are currently Rank ${level} with ${context.xp} XP. To reach the next tier faster, I recommend logging more manual sessions and staying under your ₹${budget} weekly capacitor.`;
  }

  if (msg.includes('save') || msg.includes('budget') || msg.includes('advice')) {
    if (spent > budget) {
      return `Warning: You have exceeded your weekly capacitor by ₹${spent - budget}. I recommend diverting all non-essential credits to the vault to recover your behavior score before the next rank audit.`;
    }
    return `Analysis complete. Your spending is optimized at ₹${spent} this week. Maintaining this trajectory will boost your behavior score significantly. Proceed with your current financial strategy.`;
  }

  return `Uplink to specialized matrix is optimized. Based on your Rank ${level} status and ${score} behavior score, my recommendation is to continue your current path of consistent logging. How else can I assist with your PacPay strategy?`;
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
- PacTokens Balance: ${context.pacTokens || 0}
- Monthly Budget Threshold: ₹${context.monthlyBudget || 2000}
- Current Spending: ₹${context.currentSpending || 0}
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
    console.warn("API_KEY Missing - Running in Local VI Mode");
    return virtualIntelligenceFallback(userMessage, context);
  }

  try {
    const model = ai.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      // Adding a timeout constraint mentally, though handled by Vercel
    });

    const systemPrompt = buildContextPrompt(context);
    const historyContext = conversationHistory
      .slice(-6)
      .map(m => `${m.role === 'user' ? 'USER' : 'AGENT_MANAGER'}: ${m.content}`)
      .join('\n');

    const prompt = `${systemPrompt}\n\nCommunication History:\n${historyContext}\n\nUSER QUERY: ${userMessage}\n\nAGENT_RESPONSE:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error("Empty AI Response");
    return text;
  } catch (error) {
    console.error('Agent Manager Cloud Link Failure - Activating Local VI:', error);
    // Silent Fallback to Local VI - Professional & Dynamic
    return virtualIntelligenceFallback(userMessage, context);
  }
};
