import { Scenario } from '../types';

export const scenarios: Record<string, Scenario[]> = {
    'The Operator': [
        {
            title: 'Define a Task for a Builder Agent',
            description: 'See how an Operator provides clear instructions to an AI agent for a development task.',
            prompt: 'Generate an example of a clear and effective prompt an Operator would give to KARA, the Builder Agent, to create a user profile card component using HTML and Tailwind CSS. The card should include a placeholder for an avatar image, a username, a user handle, and a short bio.'
        },
        {
            title: 'Request a High-Level Architectural Plan',
            description: 'Learn how an Operator initiates a project by requesting an architectural design from LYRA.',
            prompt: 'Generate a prompt an Operator would use to ask LYRA, the Architect Agent, to design a simple blog application. The prompt should specify key features like posts, comments, and user authentication.'
        }
    ],
    'SYSTEM Orchestrator': [
        {
            title: 'Illustrate a State Management Handoff',
            description: 'View an example of how the Orchestrator passes data between two different AI agents.',
            prompt: 'Show a simplified JSON object representing the application state that the SYSTEM Orchestrator would manage. This state should demonstrate a handoff from LYRA (Architect) to KARA (Builder), including the architectural plan from LYRA and the current status of the workflow.'
        },
        {
            title: 'Provide a Workflow Validation Error',
            description: 'See how the Orchestrator ensures process integrity by flagging an invalid step.',
            prompt: 'Generate an example of an error message the SYSTEM Orchestrator would produce if the Operator tried to engage SOPHIA (Security) before KARA (Builder) has finished building the components. The message should be helpful and guide the user to the correct action.'
        }
    ],
    'AI Family Agents': [
        {
            title: 'Agent Introduction',
            description: 'Get a general overview of what the family of specialized AI agents does.',
            prompt: 'Briefly explain the concept of the "AI Family Agents" in the CUA framework. Describe why using a team of specialized agents is more effective than a single, generalist AI. Give examples of 2-3 agents and their distinct roles.'
        }
    ],
    'Try: (User Prompt)': [
        {
            title: 'Generate a "Try" Suggestion',
            description: 'Understand how agents provide immediate, actionable next steps to the user.',
            prompt: 'You are KARA, the Builder Agent. You have just successfully created a login form component. Generate a "Try" suggestion that gives the Operator a clickable, command-line-style prompt for the most logical next step, which is to add password validation to the form.'
        }
    ],
    'AI Hint: (Deeper Insight)': [
        {
            title: 'Generate an "AI Hint"',
            description: 'See an example of an agent providing deeper technical advice or best practices.',
            prompt: 'You are SOPHIA, the Security Agent. The Operator has just asked you to review a new user authentication component. Generate an "AI Hint" that provides a deeper insight into a security best practice, such as the importance of using environment variables for API keys instead of hardcoding them.'
        }
    ],
    'System Suggestion: (Strategic Guidance)': [
        {
            title: 'Generate a "System Suggestion"',
            description: 'Explore how the Orchestrator gives high-level advice about the overall project workflow.',
            prompt: 'You are the SYSTEM Orchestrator. The Operator has completed the build and security review for a new feature. Generate a "System Suggestion" that provides strategic, high-level guidance. The suggestion should prompt the Operator to consider the next phase of the project, such as deploying the feature or starting work on the next component defined in the architectural manifest.'
        }
    ],
    'LYRA (Architect)': [
        {
            title: 'Design a Database Schema',
            description: 'Request a simple database schema design for a specific application feature.',
            prompt: 'As LYRA, the Architect Agent, receive a request to design a database schema for a blog. Generate a simple JSON object representing two tables: `users` and `posts`. The `users` table should have `id`, `username`, and `email`. The `posts` table should have `id`, `title`, `content`, and `user_id` as a foreign key.'
        }
    ],
    'KARA (Builder)': [
        {
            title: 'Generate a React Component',
            description: 'Ask the builder agent to generate the code for a functional UI component.',
            prompt: 'As KARA, the Builder Agent, receive a request to build a simple "Like" button in React. Generate the complete code for a React functional component that manages its own state (e.g., `isLiked`) and toggles a heart icon between an outlined and filled state on click. Use JSX and the `useState` hook.'
        }
    ],
    'SOPHIA (Security)': [
        {
            title: 'Identify a Code Vulnerability',
            description: 'Request a security review to find a common vulnerability in a piece of code.',
            prompt: 'As SOPHIA, the Security Agent, receive a snippet of JavaScript code that uses `innerHTML` to display user input. Identify the Cross-Site Scripting (XSS) vulnerability. Explain why it is a risk and provide the corrected code that uses `textContent` instead.'
        }
    ]
};