import { createAgent, MockLLM, type Agent, type AgentResult } from 'delivery-ai-agents-common';
import { buildTools } from '@/ai/tools';
import { buildEnterprisePrompt } from '@/ai/prompts';

let shared: Agent | null = null;

export function getAgent(): Agent {
  if (shared) return shared;
  const tools = buildTools();
  const systemPrompt = buildEnterprisePrompt();
  shared = createAgent({ systemPrompt, tools, llm: new MockLLM(tools, { systemPrompt }), maxToolRounds: 2 });
  return shared;
}

export async function chat(userId: string, message: string): Promise<AgentResult> {
  return getAgent().handle(userId, message);
}
