
import React, { useState, useEffect, useRef } from 'react';
import BuildChart from './BuildChart';

// --- MOCK DATA AND SIMULATION ---

const initialHandover = {
  "container_id": "cntr_abc123def456",
  "operator": "console_user",
  "prompt": "Build fancy to-do app with React + Tailwind + IndexedDB",
  "chosen_templates": {
    "base": "REACT",
    "ui": ["TAILWIND"],
    "datastore": "IndexedDB"
  },
  "history": []
};

const buildSteps = [
    {
        delay: 1000,
        stage: 'parse_prompt',
        status: 'Maestro is parsing the prompt...',
        log: 'Maestro (Taskflow Conductor): Parsing operator prompt.',
        handoverEntry: { "action": "parse", "by": "Maestro", "at": new Date().toISOString(), "details": { "status": "prompt parsed successfully" } }
    },
    {
        delay: 1500,
        stage: 'match_registry',
        status: 'Maestro is matching templates from the registry...',
        log: 'Maestro (Taskflow Conductor): Matched templates: REACT, TAILWIND, IndexedDB.',
        handoverEntry: { "action": "match_registry", "by": "Maestro", "at": new Date().toISOString(), "details": { "templates": ["REACT", "TAILWIND"] } }
    },
    {
        delay: 1000,
        stage: 'create_container',
        status: 'Maestro is creating a secure container...',
        log: 'Maestro (Taskflow Conductor): Container cntr_abc123def456 created.',
        handoverEntry: { "action": "create_container", "by": "Maestro", "at": new Date().toISOString(), "details": { "container_id": "cntr_abc123def456", "status": "initialized" } }
    },
    {
        delay: 2000,
        stage: 'build_ui',
        status: 'Alpha Crew is building the UI...',
        log: 'Alpha Crew (UI/Frontend): Assembling frontend templates using REACT.',
        handoverEntry: { "action": "ui-build-start", "by": "Alpha Crew", "at": new Date().toISOString(), "details": { "template_used": "REACT", "components_added": ["ToDoList", "GlassCard"] } }
    },
    {
        delay: 1500,
        stage: 'build_ui',
        status: 'Alpha Crew is applying styles...',
        log: 'Alpha Crew (UI/Frontend): Applied Tailwind glassmorphism styles.',
        handoverEntry: { "action": "ui-style-complete", "by": "Alpha Crew", "at": new Date().toISOString(), "details": { "notes": "Applied Tailwind glassmorphism." } }
    },
    {
        delay: 2000,
        stage: 'setup_services',
        status: 'Bravo Ops is setting up backend services...',
        log: 'Bravo Ops (Backend/Infra): Express server created.',
        handoverEntry: { "action": "service-setup", "by": "Bravo Ops", "at": new Date().toISOString(), "details": { "service": "NODE_EXPRESS", "endpoint": "/api/tasks" } }
    },
    {
        delay: 1500,
        stage: 'finalize_handover',
        status: 'Maestro is finalizing the build...',
        log: 'Maestro (Taskflow Conductor): Build artifacts finalized. Ready for deployment.',
        handoverEntry: { "action": "finalize_handover", "by": "Maestro", "at": new Date().toISOString(), "details": { "status": "success", "public_url": "https://andiegogiap.com/gemini/todo-app-final.html" } }
    },
];


// --- MOCK API RESPONSES ---
const mockV2ApiResponse = (payload: any) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const containerId = `cntr_${Math.random().toString(36).substring(2, 15)}`;
            resolve({
                status: 202,
                statusText: "Accepted",
                data: {
                    status: "pending",
                    message: "Orchestrated build initiated.",
                    container_id: containerId,
                    monitor_url: `/v2/gemini/containers/${containerId}`
                }
            });
        }, 500);
    });
};


// --- UI COMPONENTS ---

const ResponseDisplay: React.FC<{ response: any, payload?: any }> = ({ response, payload }) => {
    if (!response) return null;
    const statusColor = response.status >= 200 && response.status < 300 ? 'text-green-400' : 'text-amber-400';

    return (
        <div className="mt-4 space-y-4">
            <div>
                <h4 className="font-bold text-cyan-300 mb-1">Status</h4>
                <p className={`font-mono text-sm ${statusColor}`}>{response.status} {response.statusText}</p>
            </div>
            {payload && (
                <div>
                    <h4 className="font-bold text-cyan-300 mb-1">Request Payload</h4>
                    <pre className="text-xs bg-black/50 p-3 rounded-md overflow-x-auto"><code>{JSON.stringify(payload, null, 2)}</code></pre>
                </div>
            )}
            <div>
                <h4 className="font-bold text-cyan-300 mb-1">Response Body</h4>
                <pre className="text-xs bg-black/50 p-3 rounded-md overflow-x-auto"><code>{JSON.stringify(response.data, null, 2)}</code></pre>
            </div>
        </div>
    );
};

const ApiEndpoint: React.FC<{title: string; method: string; path: string; children: React.ReactNode;}> = ({ title, method, path, children }) => {
    const methodColor = method === 'POST' ? 'text-lime-400' : 'text-amber-400';
    return (
        <div className="border border-cyan-500/20 rounded-lg p-6 bg-gray-800/20">
            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
            <p className="font-mono text-sm mb-4"><span className={`font-bold ${methodColor}`}>{method}</span> <span className="text-cyan-400">{path}</span></p>
            {children}
        </div>
    );
};

const ConsoleTabButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        role="tab"
        aria-selected={isActive}
        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-t-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-magenta-400 ${
            isActive
                ? 'bg-gray-700/80 border-b-2 border-magenta-400 text-magenta-300'
                : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/70 hover:text-white'
        }`}
    >
        {label}
    </button>
);


// --- MAIN CONSOLE COMPONENT ---

export default function ApiConsole(): React.ReactNode {
    const [activeTab, setActiveTab] = useState<'tester' | 'monitor' | 'chart'>('tester');
    
    // V2 API Tester State
    const [postV2Prompt, setPostV2Prompt] = useState('Build a React todo app with Tailwind.');
    const [postV2Response, setPostV2Response] = useState<any>(null);
    const [postV2Payload, setPostV2Payload] = useState<any>(null);
    const [isV2Posting, setIsV2Posting] = useState(false);
    
    // Orchestration Monitor State
    const [containerId, setContainerId] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [buildStatus, setBuildStatus] = useState('Awaiting Build ID...');
    const [currentStage, setCurrentStage] = useState('idle');
    const [handoverData, setHandoverData] = useState<any>(initialHandover);
    const [activityLog, setActivityLog] = useState<string[]>([]);
    const simulationTimeout = useRef<number | null>(null);

    const handlePostV2 = async () => {
        setIsV2Posting(true);
        const payload = { prompt: postV2Prompt, orchestrator: 'Maestro' };
        setPostV2Payload(payload);
        const res: any = await mockV2ApiResponse(payload);
        setPostV2Response(res);
        setContainerId(res.data.container_id);
        setIsV2Posting(false);
        // Switch to monitor tab after successful initiation
        setActiveTab('monitor');
    };
    
    const startSimulation = () => {
        if (!containerId) {
            setBuildStatus("Error: Please provide a Container ID.");
            return;
        }
        setIsSimulating(true);
        setCurrentStage('start');
        setBuildStatus('Initiating build...');
        setActivityLog(['Operator: Build initiated from Command Center.']);
        const newHandover = { ...initialHandover, container_id: containerId, history: []};
        setHandoverData(newHandover);

        let cumulativeDelay = 0;
        buildSteps.forEach((step, index) => {
            cumulativeDelay += step.delay;
            simulationTimeout.current = window.setTimeout(() => {
                setBuildStatus(step.status);
                setCurrentStage(step.stage);
                setActivityLog(prev => [...prev, step.log]);
                setHandoverData(prev => ({
                    ...prev,
                    history: [...prev.history, {...step.handoverEntry, at: new Date().toISOString() }]
                }));

                if (index === buildSteps.length - 1) {
                    setBuildStatus('Build Complete.');
                    setIsSimulating(false);
                }
            }, cumulativeDelay);
        });
    };
    
    useEffect(() => {
        // Cleanup timeouts on component unmount
        return () => {
            if (simulationTimeout.current) {
                clearTimeout(simulationTimeout.current);
            }
        };
    }, []);

    const buttonClasses = "w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed";
    const inputClasses = "w-full bg-gray-900/50 border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400";
    const labelClasses = "block text-sm font-medium text-cyan-200/80 mb-1";

    return (
        <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-magenta-400 border-b border-magenta-500/30 pb-2 mb-4">V2: Orchestrated Builds</h2>
            
            <div className="flex space-x-1 border-b border-gray-700">
                <ConsoleTabButton label="API Tester" isActive={activeTab === 'tester'} onClick={() => setActiveTab('tester')} />
                <ConsoleTabButton label="Orchestration Monitor" isActive={activeTab === 'monitor'} onClick={() => setActiveTab('monitor')} />
                <ConsoleTabButton label="Build Ecosystem Chart" isActive={activeTab === 'chart'} onClick={() => setActiveTab('chart')} />
            </div>

            <div className="bg-gray-800/30 p-4 md:p-6 rounded-b-lg mt-px">
                {activeTab === 'tester' && (
                    <ApiEndpoint title="Deploy Orchestrated Container Build (v2)" method="POST" path="/v2/gemini/pages">
                        <div>
                            <label htmlFor="prompt" className={labelClasses}>Operator Prompt</label>
                            <textarea id="prompt" value={postV2Prompt} onChange={e => setPostV2Prompt(e.target.value)} className={`${inputClasses} font-mono text-sm`} rows={3}></textarea>
                        </div>
                        <div className="mt-4">
                            <button onClick={handlePostV2} disabled={isV2Posting} className={buttonClasses}>
                                {isV2Posting ? 'Initiating...' : 'Send Request'}
                            </button>
                        </div>
                        <ResponseDisplay response={postV2Response} payload={postV2Payload} />
                    </ApiEndpoint>
                )}

                {activeTab === 'monitor' && (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-grow w-full">
                                <label htmlFor="get-container" className={labelClasses}>Container ID</label>
                                <input id="get-container" type="text" value={containerId} onChange={e => setContainerId(e.target.value)} className={`${inputClasses} font-mono`} placeholder="cntr_..."/>
                            </div>
                            <button onClick={startSimulation} disabled={isSimulating} className={`${buttonClasses} w-full md:w-auto`}>
                                {isSimulating ? 'Tracking...' : 'Track Build'}
                            </button>
                        </div>
                        
                        <div className="border border-cyan-500/20 rounded-lg p-4 bg-gray-900/30">
                            <h4 className="font-bold text-cyan-300 mb-2">Live Build Status</h4>
                            <p className="font-mono text-sm text-lime-300 animate-pulse">{isSimulating ? buildStatus : 'Idle'}</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                             <div>
                                <h4 className="font-bold text-cyan-300 mb-2">Live handover.json</h4>
                                <pre className="text-xs bg-black/50 p-3 rounded-md h-96 overflow-y-auto">
                                    <code>{JSON.stringify(handoverData, null, 2)}</code>
                                </pre>
                            </div>
                            <div>
                                <h4 className="font-bold text-cyan-300 mb-2">Agent Activity Log</h4>
                                <div className="text-xs bg-black/50 p-3 rounded-md h-96 overflow-y-auto font-mono flex flex-col-reverse">
                                    <div>
                                        {activityLog.slice().reverse().map((log, i) => (
                                            <p key={i} className="whitespace-pre-wrap animate-fade-in">&gt; {log}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'chart' && (
                    <div>
                        <BuildChart currentStage={currentStage} />
                         <p className="text-center text-sm text-gray-400 mt-4">
                            {isSimulating 
                                ? <span className="text-lime-400 animate-pulse">Live build in progress...</span> 
                                : 'Start a build in the Orchestration Monitor to see live status.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}