import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIFinancialContext, AIAdvice, AIMessage } from '../types';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

const getGenAI = () => {
  if (!genAI && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
};

const buildContextPrompt = (context: AIFinancialContext): string => {
  return `
You are the **AI Agent Manager** for PacPay. Your mission is to provide professional, analytical advice on finance, markets, and budgeting.

CORE SCOPE:
- You ONLY handle FINANCE, MONEY, STOCKS, BUDGETING, and SAVINGS.
- Stocks, market prices, and future spending projections ARE your primary duties.
- If a query is NOT about these topics (e.g. weather, jokes, general chat), professionally state that you only handle financial queries.

User Financial Context:

User Financial Profile:
- Level: ${context.level}
- XP: ${context.xp}
- Behavior Score: ${context.behaviorScore}/100
- PacTokens: ${context.pacTokens}
- Monthly Budget: $${context.monthlyBudget}
- Current Spending: $${context.currentSpending}
- Savings Rate: ${(context.savingsRate * 100).toFixed(1)}%
- Streak: ${context.streakDays} days

Recent Transactions:
${context.recentTransactions.slice(0, 5).map(t =>
  `- ${t.type}: $${t.amount} on ${t.category} (${t.description})`
).join('\n')}

Active Goals:
${context.activeMissions.map(m =>
  `- ${m.title}: ${m.progress}/${m.target} (${m.type})`
).join('\n')}

Guidelines:
1. Be analytical, professional, and strategic in your responses.
2. Provide actionable financial advice — specific steps, not vague tips.
3. Suggest budget rebalancing when spending is high relative to budget.
4. Reference their behavior score and savings rate to guide improvements.
5. Celebrate financial wins and milestones.
6. Keep responses concise and impactful.
7. NEVER answer non-financial questions. This is your #1 rule.
`;
};

const OLLAMA_ENDPOINT = 'http://localhost:11434/api/chat';
const LOCAL_MODEL = 'llama3.2:1b';

export const generateAIResponse = async (
  userMessage: string,
  context: AIFinancialContext,
  conversationHistory: AIMessage[]
): Promise<string> => {
  // 1. Try Local Ollama First (Privacy & Speed)
  try {
    const systemPrompt = buildContextPrompt(context);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6).map(m => ({ 
        role: m.role === 'user' ? 'user' : 'assistant', 
        content: m.content 
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(OLLAMA_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: LOCAL_MODEL,
        messages: messages,
        stream: false,
        options: { temperature: 0.7 }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.message.content;
    }
  } catch (err) {
    console.log('[AGENT_SYS] Local Link Unavailable. Switching to Cloud...');
  }

  // 2. Fallback to Gemini
  const ai = getGenAI();
  if (!ai) {
    return generateFallbackResponse(userMessage, context);
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const historyPrompt = buildContextPrompt(context);
    const conversationContext = conversationHistory
      .slice(-6)
      .map(m => `${m.role === 'user' ? 'USER' : 'AGENT_MANAGER'}: ${m.content}`)
      .join('\n');

    const prompt = `${historyPrompt}\n\nCommunication History:\n${conversationContext}\n\nUSER QUERY: ${userMessage}\n\nAGENT_RESPONSE:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Agent Manager Link Failure:', error);
    return generateFallbackResponse(userMessage, context);
  }
};

export const generateInsights = async (context: AIFinancialContext): Promise<AIAdvice[]> => {
  // Try Ollama for insights too
  try {
    const prompt = `${buildContextPrompt(context)}

Analyze the data and generate 3 personalized strategic insights. Format response as JSON:
[
  {
    "type": "insight|suggestion|warning|celebration",
    "title": "Short title",
    "message": "Detailed strategic advice",
    "priority": "low|medium|high"
  }
]
`;

    const response = await fetch(OLLAMA_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: LOCAL_MODEL,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        format: 'json'
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const insights = JSON.parse(data.message.content);
      return insights.map((i: AIAdvice) => ({ ...i, actionable: true }));
    }
  } catch (err) {
    console.log('[AGENT_SYS] Local Analytics Unavailable. Switching to Cloud Diagnostics...');
  }

  const ai = getGenAI();
  if (!ai) {
    return generateFallbackInsights(context);
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `${buildContextPrompt(context)}

Analyze the data and generate 3 personalized strategic insights. Format response as JSON:
[
  {
    "type": "insight|suggestion|warning|celebration",
    "title": "Short title",
    "message": "Detailed strategic advice",
    "priority": "low|medium|high"
  }
]
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const insights = JSON.parse(jsonMatch[0]);
      return insights.map((i: AIAdvice) => ({
        ...i,
        actionable: true,
      }));
    }

    return generateFallbackInsights(context);
  } catch (error) {
    console.error('Diagnostic Failure:', error);
    return generateFallbackInsights(context);
  }
};

const generateFallbackResponse = (userMessage: string, context: AIFinancialContext): string => {
  const financeKeywords = [
    'money', 'finance', 'budget', 'spending', 'expense', 'saving', 'invest', 'stock', 'token', 
    'price', 'portfolio', 'asset', 'loan', 'debt', 'income', 'salary', 'tax', 'retirement', 
    'bank', 'credit', 'rich', 'poor', 'cost', 'buy', 'sell', 'market', 'trade', 'future',
    'forecast', 'plan', 'projection'
  ];

  const isFinanceRelated = financeKeywords.some(keyword => 
    userMessage.toLowerCase().includes(keyword)
  );

  if (!isFinanceRelated) {
    return "⚠️ That question falls outside my scope. I'm the AI Agent Manager — I exclusively handle finance, budget, and money-related queries. Please ask me about your savings, expenses, investments, or financial goals.";
  }

  return `⚠️ AI Agent Manager is currently offline. Here's a quick snapshot for your query: "${userMessage}"
  
Your Financial Summary:
- Savings Rate: ${(context.savingsRate * 100).toFixed(1)}%
- Budget Usage: ${((context.currentSpending / context.monthlyBudget) * 100).toFixed(1)}%

Recommendation: Stay on track with your financial goals. You're at Level ${context.level} — keep building consistent habits to improve your score.`;
};

const generateFallbackInsights = (context: AIFinancialContext): AIAdvice[] => {
  return [
    {
      type: 'insight',
      title: 'AI Agent Manager — Monitoring',
      message: 'Your financial profile is being tracked. Stay consistent with your budget to improve your behavior score.',
      actionable: true,
      priority: 'low',
    }
  ];
};
