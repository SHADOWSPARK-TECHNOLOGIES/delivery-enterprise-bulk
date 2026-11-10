import { enterpriseAgentPrompt } from 'delivery-ai-agents-common';

export const SUPPORT_PHONE = '+234 803 000 0000';

export function buildEnterprisePrompt(): string {
  return enterpriseAgentPrompt({
    cities: ['Lagos', 'Abuja', 'Port Harcourt', 'Owerri', 'Kano', 'Ibadan'],
    currency: 'NGN (₦)',
    supportPhone: SUPPORT_PHONE,
  });
}
