
import React, { forwardRef } from 'react';
import { ActiveTopic } from '../../types';

interface WorkflowSectionProps {
    onCardClick: (topic: ActiveTopic) => void;
}

const agents = [
    {
        icon: '🏛️',
        name: 'LYRA (Architect)',
        role: 'Designs the system architecture.',
    },
    {
        icon: '🏗️',
        name: 'KARA (Builder)',
        role: 'Builds the software components.',
    },
    {
        icon: '🛡️',
        name: 'SOPHIA (Security)',
        role: 'Reviews code for integrity.',
    }
];

const AgentCard: React.FC<{ icon: string, name: string, role: string, onClick: () => void }> = ({ icon, name, role, onClick }) => (
    <div onClick={onClick} className="flex flex-col items-center text-center p-4 z-10 cursor-pointer group">
        <div className="text-5xl p-4 bg-white rounded-full shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-110">
            {icon}
        </div>
        <p className="font-bold mt-3 text-lg text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">{role}</p>
    </div>
);

const WorkflowSection = forwardRef<HTMLElement, WorkflowSectionProps>(({ onCardClick }, ref) => (
    <section id="workflow" ref={ref} className="py-16 md:py-20 text-center bg-gray-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Orchestrated Agent Workflow</h2>
        <p className="max-w-3xl mx-auto mb-12 text-gray-600">The true power of the CUA is how the SYSTEM Orchestrator guides the Operator to create a seamless project pipeline by handing off tasks between specialized agents.</p>
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {agents.map((agent, index) => (
                <React.Fragment key={agent.name}>
                    <AgentCard
                        {...agent}
                        onClick={() => onCardClick({ title: agent.name, description: agent.role, icon: agent.icon })}
                    />
                    {index < agents.length - 1 && (
                        <div className="text-3xl text-gray-400 font-light transform md:-translate-y-6 z-0">→</div>
                    )}
                </React.Fragment>
            ))}
        </div>
        <p className="text-center max-w-3xl mx-auto mt-8 text-purple-700 font-semibold bg-purple-100 p-3 rounded-md">The SYSTEM Orchestrator prompts these handoffs, e.g., "System Suggestion: Code scaffolded. Try: `/connect SOPHIA` to begin security review."</p>
    </section>
));

export default WorkflowSection;
