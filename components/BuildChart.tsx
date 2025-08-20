
import React from 'react';

interface BuildChartProps {
    currentStage: string;
}

const workflowStages = [
    { id: 'parse_prompt', label: 'Parse Prompt', agent: 'Maestro', group: 'start' },
    { id: 'match_registry', label: 'Match Registry', agent: 'Maestro', group: 'start' },
    { id: 'create_container', label: 'Create Container', agent: 'Maestro', group: 'start' },
    { id: 'build_ui', label: 'Build UI', agent: 'Alpha Crew', group: 'build' },
    { id: 'setup_services', label: 'Setup Services', agent: 'Bravo Ops', group: 'build' },
    { id: 'datastore_integration', label: 'Data Integration', agent: 'Bravo Ops', group: 'build' },
    { id: 'finalize_handover', label: 'Finalize & Deploy', agent: 'Maestro', group: 'end' },
];

const Arrow: React.FC = () => (
    <div className="text-2xl text-cyan-400/50 mx-2 self-center">→</div>
);

const StageCard: React.FC<{ label: string, agent: string, isActive: boolean }> = ({ label, agent, isActive }) => {
    const baseClasses = "flex flex-col items-center justify-center p-3 rounded-lg border-2 w-36 h-24 text-center transition-all duration-500";
    const activeClasses = isActive ? "bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105" : "bg-gray-800/50 border-gray-600";

    return (
        <div className={`${baseClasses} ${activeClasses}`}>
            <p className="text-sm font-bold text-white">{label}</p>
            <p className={`text-xs mt-1 font-mono ${isActive ? 'text-cyan-300' : 'text-gray-400'}`}>{agent}</p>
        </div>
    );
};


const BuildChart: React.FC<BuildChartProps> = ({ currentStage }) => {
    return (
        <div className="p-4 bg-gray-900/50 rounded-lg border border-cyan-500/20">
            <h3 className="text-lg font-bold text-white text-center mb-6">Build Ecosystem Workflow</h3>
            
            <div className="flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:flex-wrap justify-center">
                <div className="flex items-center">
                    <div className="flex flex-col items-center p-3 rounded-lg border-2 border-magenta-500 bg-magenta-900/30 w-36 h-24 justify-center">
                        <p className="text-sm font-bold text-white">Operator Prompt</p>
                        <p className="text-xs mt-1 font-mono text-magenta-300">Human / IDE</p>
                    </div>
                    <Arrow />
                </div>

                {workflowStages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center">
                        <StageCard 
                            label={stage.label} 
                            agent={stage.agent} 
                            isActive={currentStage === stage.id} 
                        />
                        {/* Don't show arrow for the last item */}
                        {index < workflowStages.length - 1 && <Arrow />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuildChart;
