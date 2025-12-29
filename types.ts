export interface RoastResponse {
  score: number;
  oneLiner: string;
  sections: {
    title: string;
    content: string;
    severity: 'critical' | 'bad' | 'nitpick';
  }[];
  verdict: string;
}

export enum RoastState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  ROASTED = 'ROASTED',
  ERROR = 'ERROR'
}

export interface RoastRequest {
  image: File | null;
  url: string;
}