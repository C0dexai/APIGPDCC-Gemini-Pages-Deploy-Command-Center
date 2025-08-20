export interface ActiveTopic {
    title: string;
    description: string;
    icon?: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export type SectionId = 'header' | 'components' | 'lifecycle' | 'guidance' | 'workflow';

export interface Scenario {
    title: string;
    description: string;
    prompt: string;
}