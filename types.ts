import React from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum Page {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  OFFICES = 'OFFICES',
  SERVICES = 'SERVICES',
  TYPE_A = 'TYPE_A',
  TYPE_B = 'TYPE_B',
  TYPE_C = 'TYPE_C',
  TYPE_D = 'TYPE_D',
  PHIL_IMPACT = 'PHIL_IMPACT',
  PROJECTS = 'PROJECTS',
  CONTACT = 'CONTACT',
  IVA = 'IVA', // Intelligent Virtual Assistant
}
