import { ChatCompletionCreateParams } from "openai/resources/chat";
import OpenAI from "openai";

export interface CriterionStatus {
  id: number;
  name: string;
  fulfilled: boolean;
  reason: string;
  score: number;
}

export class O1CriteriaTracker {
  private criteria: CriterionStatus[] = [
    { id: 1, name: "Awards", fulfilled: false, reason: "", score: 0 },
    { id: 2, name: "Membership", fulfilled: false, reason: "", score: 0 },
    { id: 3, name: "Published Material", fulfilled: false, reason: "", score: 0 },
    { id: 4, name: "Judging", fulfilled: false, reason: "", score: 0 },
    { id: 5, name: "Original Contributions", fulfilled: false, reason: "", score: 0 },
    { id: 6, name: "Scholarly Articles", fulfilled: false, reason: "", score: 0 },
    { id: 7, name: "Display of Work", fulfilled: false, reason: "", score: 0 },
    { id: 8, name: "High Salary", fulfilled: false, reason: "", score: 0 },
  ];

  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async updateCriteria(userMessage: string, aiReply: string): Promise<CriterionStatus[]> {
    const conversation = `User: ${userMessage}\nAI: ${aiReply}`;
    const updatedCriteria = await this.analyzeCriteria(conversation);
    this.criteria = updatedCriteria;
    return this.criteria;
  }

  private async analyzeCriteria(conversation: string): Promise<CriterionStatus[]> {
    const prompt: ChatCompletionCreateParams = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert in O-1 visa applications. Analyze the given conversation and update the status of each O-1 visa criterion. For each criterion, provide:
          1. Whether it's fulfilled (true/false)
          2. A brief reason for your decision
          3. A compatibility score from 1-100, where 1 is not compatible at all and 100 is perfectly compatible
          
          Respond in a structured JSON format.`
        },
        {
          role: "user",
          content: `Based on this conversation, update the O-1 visa criteria statuses:\n\n${conversation}`
        }
      ]
    };

    const response = await this.openai.chat.completions.create(prompt);
    const analysis = JSON.parse(response.choices[0].message.content || "{}");

    return this.criteria.map(criterion => ({
      ...criterion,
      ...analysis[criterion.name]
    }));
  }

  getCriteria(): CriterionStatus[] {
    return this.criteria;
  }

  getScoreColor(score: number): string {
    if (score < 50) return "red";
    if (score < 75) return "yellow";
    return "green";
  }
}