
import React, { forwardRef } from 'react';
import InfoCard from '../InfoCard';
import { ActiveTopic } from '../../types';

interface GuidanceSectionProps {
    onCardClick: (topic: ActiveTopic) => void;
}

const guidanceLayers = [
    {
        title: 'Try: (User Prompt)',
        source: 'Source: AI Agent',
        description: 'An immediate, clickable prompt for the most logical next step. This is designed to maintain momentum and keep the project moving forward.',
        titleColor: 'text-blue-600'
    },
    {
        title: 'AI Hint: (Deeper Insight)',
        source: 'Source: AI Agent',
        description: 'A deeper technical or conceptual insight from the specialist agent. This offers valuable context, best practices, and learning opportunities.',
        titleColor: 'text-green-600'
    },
    {
        title: 'System Suggestion: (Strategic Guidance)',
        source: 'Source: SYSTEM Orchestrator',
        description: 'High-level advice about the overall workflow. It may suggest using a different tool, engaging another agent, or leveraging a manifest to be more efficient.',
        titleColor: 'text-purple-600'
    }
];

const GuidanceSection = forwardRef<HTMLElement, GuidanceSectionProps>(({ onCardClick }, ref) => (
    <section id="guidance" ref={ref} className="py-16 md:py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Three Layers of Guidance</h2>
        <p className="text-center max-w-3xl mx-auto mb-12 text-gray-600">The CUA's unique hint system is designed to empower the Operator. It provides support at every level, ensuring you are never stuck and can always optimize your workflow.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guidanceLayers.map((layer) => (
                <InfoCard
                    key={layer.title}
                    {...layer}
                    onClick={() => onCardClick({ title: layer.title, description: layer.description })}
                />
            ))}
        </div>
    </section>
));

export default GuidanceSection;
