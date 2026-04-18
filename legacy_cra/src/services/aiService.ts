import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIFinancialContext, AIAdvice, AIMessage } from '../types';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

const getGenAI = () => {
  if (!genAI && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
};

const buildContextPrompt = (context: AIFinancialContext): string => {
  return `
You are PacPay AI, a friendly and knowledgeable financial advisor for students and young adults.
You have access to the user's financial context and should provide personalized advice.

User Context:
- Level: ${context.level} (Financial maturity)
- XP: ${context.xp} (Total experience points earned)
- Behavior Score: ${context.behaviorScore}/100 (Financial habits score)
- PacTokens: ${context.pacTokens} (Virtual currency earned through good habits)
- Monthly Budget: $${context.monthlyBudget}
- Current Spending: $${context.currentSpending}
- Savings Rate: ${(context.savingsRate * 100).toFixed(1)}%
- Streak: ${context.streakDays} days

Recent Transactions:
${context.recentTransactions.slice(0, 5).map(t =>
  `- ${t.type}: $${t.amount} on ${t.category} (${t.description})`
).join('\n')}

Active Missions:
${context.activeMissions.map(m =>
  `- ${m.title}: ${m.progress}/${m.target} (${m.type})`
).join('\n')}

Guidelines:
1. Be encouraging and supportive
2. Provide actionable advice specific to their situation
3. Celebrate achievements and progress
4. Suggest improvements based on their spending patterns
5. Reference their level and XP to gamify financial learning
6. Keep responses concise but helpful (2-3 paragraphs max)
7. Use emojis occasionally to be friendly
`;
};

export const generateAIResponse = async (
  userMessage: string,
  context: AIFinancialContext,
  conversationHistory: AIMessage[]
): Promise<string> => {
  const ai = getGenAI();

  if (!ai) {
    return generateFallbackResponse(userMessage, context);
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-pro' });

    const historyPrompt = buildContextPrompt(context);
    const conversationContext = conversationHistory
      .slice(-6)
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    const prompt = `${historyPrompt}\n\nConversation History:\n${conversationContext}\n\nUser: ${userMessage}\n\nAssistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI Error:', error);
    return generateFallbackResponse(userMessage, context);
  }
};

export const generateInsights = async (context: AIFinancialContext): Promise<AIAdvice[]> => {
  const ai = getGenAI();

  if (!ai) {
    return generateFallbackInsights(context);
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `${buildContextPrompt(context)}

Based on this user's financial data, generate 3-5 personalized insights. Format your response as JSON:
[
  {
    "type": "insight|suggestion|warning|celebration",
    "title": "Short title",
    "message": "Detailed message with actionable advice",
    "priority": "low|medium|high"
  }
]

Focus on:
1. Spending patterns and budget health
2. Savings opportunities
3. Mission progress and achievements
4. Behavior improvements`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
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
    console.error('Insights Error:', error);
    return generateFallbackInsights(context);
  }
};

const generateFallbackResponse = (userMessage: string, context: AIFinancialContext): string => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
    return `Great question! 💰 Based on your current savings rate of ${(context.savingsRate * 100).toFixed(1)}%, you're on track! Here are some tips:

1. **Automate savings** - Set aside ${Math.round(context.monthlyBudget * 0.2)} monthly before spending
2. **Track subscriptions** - Review recurring charges for unused services
3. **Use the 50/30/20 rule** - 50% needs, 30% wants, 20% savings

Your ${context.streakDays}-day streak shows consistency - keep it up! 🎉`;
  }

  if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
    const spentPercent = (context.currentSpending / context.monthlyBudget * 100).toFixed(1);
    return `You've spent $${context.currentSpending} of your $${context.monthlyBudget} budget (${spentPercent}%).

${spentPercent < '50' ? '✅ Great pace! You have plenty of room in your budget.' :
  spentPercent < '80' ? '⚠️ You\'re approaching your budget limit. Consider slowing down.' :
  '🔴 Budget alert! You\'re near or over your limit.'}

Level ${context.level} tip: Set category-specific budgets to better track spending patterns!`;
  }

  if (lowerMessage.includes('invest') || lowerMessage.includes('stock')) {
    return `Ready to start investing? 📈 At Level ${context.level}, you can access our Stock Market Game!

**Start with:**
- ${context.pacTokens} PacTokens available for virtual trading
- Practice with virtual money before real investing
- Learn market fundamentals risk-free

Investing tip for beginners: Start small and diversify. Never invest more than you can afford to lose!`;
  }

  if (lowerMessage.includes('mission') || lowerMessage.includes('goal')) {
    const activeMissions = context.activeMissions.filter(m => !m.completed);
    if (activeMissions.length === 0) {
      return `You've completed all your current missions! 🏆 Check back for new challenges, or set personal goals using the app.`;
    }
    return `You have ${activeMissions.length} active missions:\n${activeMissions.map(m =>
      `- **${m.title}**: ${m.progress}/${m.target} (${Math.round(m.progress/m.target*100)}% complete)`
    ).join('\n')}\n\nComplete missions to earn XP and PacTokens! 🎮`;
  }

  return `Thanks for your question! 🤔

Based on your Level ${context.level} profile and ${context.streakDays}-day streak, here's my advice:

**Your Financial Health:**
- Behavior Score: ${context.behaviorScore}/100
- Savings Rate: ${(context.savingsRate * 100).toFixed(1)}%

**Quick Tips:**
1. Keep tracking your expenses daily
2. Set aside money for savings first
3. Review your spending categories weekly

What specific area would you like help with?`;
};

const generateFallbackInsights = (context: AIFinancialContext): AIAdvice[] => {
  const insights: AIAdvice[] = [];

  // Spending insight
  const spentPercent = context.currentSpending / context.monthlyBudget;
  if (spentPercent > 0.8) {
    insights.push({
      type: 'warning',
      title: 'Budget Alert',
      message: `You've used ${Math.round(spentPercent * 100)}% of your monthly budget. Consider reducing discretionary spending.`,
      actionable: true,
      priority: 'high',
    });
  } else if (spentPercent < 0.5) {
    insights.push({
      type: 'celebration',
      title: 'Great Budget Control!',
      message: `You've only used ${Math.round(spentPercent * 100)}% of your budget. Consider saving the extra!`,
      actionable: true,
      priority: 'low',
    });
  }

  // Savings rate insight
  if (context.savingsRate < 0.1) {
    insights.push({
      type: 'suggestion',
      title: 'Boost Your Savings',
      message: `Your savings rate is ${(context.savingsRate * 100).toFixed(1)}%. Aim for 20% for financial security.`,
      actionable: true,
      priority: 'medium',
    });
  }

  // Streak insight
  if (context.streakDays > 7) {
    insights.push({
      type: 'celebration',
      title: `${context.streakDays} Day Streak!`,
      message: `Amazing consistency! You're building strong financial habits.`,
      actionable: false,
      priority: 'low',
    });
  }

  // Mission progress
  const incompleteMissions = context.activeMissions.filter(m => !m.completed);
  if (incompleteMissions.length > 0) {
    const mission = incompleteMissions[0];
    insights.push({
      type: 'mission',
      title: 'Mission Progress',
      message: `${mission.title}: ${mission.progress}/${mission.target} - ${Math.round(mission.progress/mission.target*100)}% complete`,
      actionable: true,
      priority: 'medium',
    });
  }

  return insights;
};

export const generateQuickReply = async (
  type: 'budget' | 'save' | 'invest' | 'mission',
  context: AIFinancialContext
): Promise<string> => {
  const messages: Record<string, string> = {
    budget: 'How can I improve my budget management?',
    save: 'What are the best ways to save money?',
    invest: 'How do I start investing as a beginner?',
    mission: 'What missions should I focus on?',
  };

  return generateAIResponse(messages[type], context, []);
};