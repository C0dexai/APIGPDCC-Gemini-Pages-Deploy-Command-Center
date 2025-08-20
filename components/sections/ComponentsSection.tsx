
import React, { forwardRef } from 'react';
import InfoCard from '../InfoCard';
import { ActiveTopic } from '../../types';

interface ComponentsSectionProps {
    onCardClick: (topic: ActiveTopic) => void;
}

const components = [
    {
        icon: '👤',
        title: 'The Operator',
        description: 'The human user. The Operator is the strategic director who initiates tasks, provides core objectives, and guides the overall direction of the project.',
        borderColor: 'border-blue-500'
    },
    {
        icon: '⚙️',
        title: 'SYSTEM Orchestrator',
        description: 'The silent supervisor AI. The Orchestrator manages application state, parses all interactions, and ensures the entire workflow runs efficiently and adheres to protocol.',
        borderColor: 'border-purple-500'
    },
    {
        icon: '🤖',
        title: 'AI Family Agents',
        description: 'A team of specialized AIs (e.g., Architect, Builder, Security). Each agent possesses a unique skill set and dedicated tools to execute specific, targeted tasks.',
        borderColor: 'border-green-500'
    }
];

const ComponentsSection = forwardRef<HTMLElement, ComponentsSectionProps>(({ onCardClick }, ref) => (
    <section id="components" ref={ref} className="py-16 md:py-20">
        <h2 className="text-3xl font-bold text-center mb-4">The Core Components</h2>
        <p className="text-center max-w-3xl mx-auto mb-12 text-gray-600">The CUA ecosystem is built upon three distinct roles that work in concert. Understanding each role is the first step to mastering the system's workflow.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {components.map((comp) => (
                <InfoCard
                    key={comp.title}
                    {...comp}
                    onClick={() => onCardClick({ title: comp.title, description: comp.description, icon: comp.icon })}
                />
            ))}
        </div>
    </section>
));

export default ComponentsSection;
