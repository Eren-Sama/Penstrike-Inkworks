/**
 * Mock data for AI Studio page
 * ONLY rendered when NEXT_PUBLIC_USE_MOCK_DATA=true
 */

export interface AICreditsState {
  creditsUsed: number;
  totalCredits: number;
  isAvailable: boolean;
}

// Mock data for demo mode - shows active credits
export const mockAICreditsState: AICreditsState = {
  creditsUsed: 25,
  totalCredits: 100,
  isAvailable: true,
};

// Empty state for real mode (no AI credits backend yet)
export const emptyAICreditsState: AICreditsState = {
  creditsUsed: 0,
  totalCredits: 0,
  isAvailable: false,
};
