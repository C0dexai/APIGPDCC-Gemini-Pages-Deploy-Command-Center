
import React, { forwardRef } from 'react';

const LifecycleStep: React.FC<{ title: string; description: string; className: string }> = ({ title, description, className }) => (
    <div className="w-full md:w-3/4 lg:w-1/2 p-6 rounded-lg text-center bg-white shadow-md">
        <p className={`font-bold text-lg ${className}`}>{title}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
);

const FlowArrow: React.FC = () => (
    <div className="text-4xl text-gray-400">↓</div>
);

const LifecycleSection = forwardRef<HTMLElement>((props, ref) => (
    <section id="lifecycle" ref={ref} className="py-16 md:py-20 bg-gray-50 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-4">The Interaction Lifecycle</h2>
        <p className="text-center max-w-3xl mx-auto mb-12 text-gray-600">Every task in CUA follows a structured lifecycle. This core loop ensures that every action is clear, context-aware, and contributes to the overall project workflow.</p>
        <div className="flex flex-col items-center space-y-4">
            <LifecycleStep 
                title="1. Operator Initiates Task"
                description="The Operator sends a clear, actionable prompt to a specific AI Agent, such as `/connect KARA build a login form`."
                className="text-blue-600"
            />
            <FlowArrow />
            <LifecycleStep 
                title="2. Agent Executes & Responds"
                description="The selected Agent (e.g., KARA, the Builder) uses its tools to perform the task and presents the output directly to the Operator."
                className="text-green-600"
            />
            <FlowArrow />
            <LifecycleStep 
                title="3. Multi-Layered Guidance is Generated"
                description="Instantly, the system provides a three-tiered set of hints to guide the Operator's next steps, from immediate actions to long-term strategy."
                className="text-purple-600"
            />
        </div>
    </section>
));

export default LifecycleSection;
