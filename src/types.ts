export interface City {
  id: string;
  name: string;
  nameUrdu: string;
  lat: number;
  lng: number;
  pollution: 'Low' | 'Moderate' | 'High';
}

export type Language = 'en' | 'ur';

export interface AstroEvent {
  id: string;
  name: string;
  nameUrdu: string;
  date: Date;
  type: 'Eclipse' | 'Meteor Shower' | 'Planet' | 'Moon' | 'Other';
  descriptionEn?: string;
  descriptionUr?: string;
  altitude: number;
  azimuth: number;
  visibility: 'Excellent' | 'Good' | 'Poor';
  peakTime: Date;
  startTime: Date;
  endTime: Date;
  moonInterference: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface DarkSkySite {
  name: string;
  nameUrdu: string;
  region: string;
  bortle: number;
  lat: number;
  lng: number;
  description: string;
}
