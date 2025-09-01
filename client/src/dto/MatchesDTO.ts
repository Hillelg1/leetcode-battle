// dto/MatchesDTO.ts

export interface MatchesDTO {
  matchId: string;
  p1: string;
  p2: string;
  question: {};
  type?: string;   // e.g., JOIN, FINISH
  payload?: string;     // optional, e.g., winner info or other data
}