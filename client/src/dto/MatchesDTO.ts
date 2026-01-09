// dto/MatchesDTO.ts

export interface MatchesDTO {
  matchId: string;
  p1: string;
  p2: string;
  question: {};
  type?: string;   // e.g., JOIN, FINISH
  payload?: string;     // optional, e.g., win ner info or other data
  startTime: number; // not optional need to know when the match started
  p1Code?: string;
  p2Code?: string;
}