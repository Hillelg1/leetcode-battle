// types/MatchHistory.ts
export interface MatchHistory {
    id: number;
    matchId: string;
    p1: string;
    p2: string;
    questionTitle: string;
    won: string;
    solution: string;
    p1Solution: string | null;
    p2Solution: string | null;
    p1TestcasesSolved: string;
    p2TestcasesSolved: string;
    p1FinishedAt: string;
    p2FinishedAt: string;
}

export type MatchHistoryDTO = {
    wins: Array<MatchHistory | null>;
    loses: Array<MatchHistory | null>;
    winCount: number;
    lossCount: number;
    totalMatches: number;
};