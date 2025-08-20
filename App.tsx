
import React, { useState } from 'react';
import ApiSpec from './components/ApiSpec';
import ApiConsole from './components/ApiConsole';

// Markdown content remains the source of truth for the API spec
const markdownContent = `
# Gemini Pages Deploy v1

**Purpose**
Enable any client (IDE plugin, SPA, backend job, WordPress, CI) to publish or update static agent pages by POSTing HTML to the orchestrator endpoint. Keep secrets server-side. Support dev proxies without leaking tokens.

---

## Contract

* **Endpoint (direct):** \`POST https://api.andiegogiap.com/v1/gemini/pages\`
* **Auth:** \`Authorization: Bearer <API_BEARER_TOKEN>\` (server-side only)
* **Content-Type:** \`application/json\`
* **Idempotency:** Same \`slug\` overwrites the existing page file.
* **Publish path:** \`https://andiegogiap.com/gemini/<slug>.html\`

### Request (JSON)

\`\`\`json
{
  "slug": "agent-dashboard",           // kebab-case; becomes agent-dashboard.html
  "title": "Agent Dashboard v2",       // optional; used in <title> if your template does
  "html": "<!doctype html> ... </html>"// full HTML string (caller is responsible for safety)
}
\`\`\`

### Success Response (JSON)

\`\`\`json
{
  "status": "success",
  "message": "Deployment successful",
  "endpoint": "https://api.andiegogiap.com/v1/gemini/pages",
  "path": "/www/wwwroot/andiegogiap.com/gemini/agent-dashboard.html",
  "public_url": "https://andiegogiap.com/gemini/agent-dashboard.html",
  "content_hash": "<sha256-of-html>"
}
\`\`\`

### Error Response (JSON)

\`\`\`json
{
  "error": "Unauthorized | html required (string) | ...",
  "statusCode": 401
}
\`\`\`

---

## Environment & Security

* **Never** ship the bearer token to browsers or client apps. Inject it **server-side** (proxy or backend).
* Required env vars (server/CI):

\`\`\`
API_BASE_URL=https://api.andiegogiap.com
API_BEARER_TOKEN=***secret***
\`\`\`

* Optional:

\`\`\`
PAGES_DIR=/www/wwwroot/andiegogiap.com/gemini   # already configured on server
\`\`\`

---

## Routing Rules

* **Direct (backend/CI):** call \`https://api.andiegogiap.com/v1/gemini/pages\` with Bearer header.
* **Dev proxy (SPAs):** route \`/orch/*\` → \`https://api.andiegogiap.com/*\` and inject the Bearer at the dev server (Vite \`server.proxy\`) or at Nginx (\`/gemini/orch/*\`).

  * Frontend calls \`/orch/v1/gemini/pages\` with **no** token; proxy adds \`Authorization\`.

---

## Client Examples

### cURL (backend/CI)

\`\`\`bash
curl -i "$API_BASE_URL/v1/gemini/pages" \\
  -X POST \\
  -H "Authorization: Bearer $API_BEARER_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "slug":"agent-dashboard",
    "title":"Agent Dashboard v2",
    "html":"<!doctype html><html><head><meta charset=\\"utf-8\\"><title>Agent Dashboard v2</title></head><body><h1>Updated</h1></body></html>"
  }'
\`\`\`

### Node (server)

\`\`\`js
import fetch from "node-fetch";
const res = await fetch(process.env.API_BASE_URL + "/v1/gemini/pages", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${process.env.API_BEARER_TOKEN}\`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    slug: "agent-dashboard",
    title: "Agent Dashboard v2",
    html: "<!doctype html>...</html>"
  })
});
if (!res.ok) throw new Error(\`HTTP \${res.status}: \${await res.text()}\`);
const out = await res.json();
console.log("Published:", out.public_url);
\`\`\`

### Frontend (SPA via dev/edge proxy)

\`\`\`ts
// Vite dev proxy or Nginx edge injects the bearer
async function deployPage(slug: string, title: string, html: string) {
  const res = await fetch("/orch/v1/gemini/pages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, title, html })
  });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}
\`\`\`

### WordPress (WPGetAPI)

* API: Base \`https://api.andiegogiap.com\`, headers include \`Authorization: Bearer <token>\` and \`Content-Type: application/json\`.
* Endpoint: \`POST /v1/gemini/pages\`

\`\`\`php
$response = wpgetapi_endpoint('andiegogiap_api','gemini_pages', array(
  'body' => array(
    'slug' => 'agent-dashboard',
    'title' => 'Agent Dashboard v2',
    'html' => '<!doctype html>...</html>'
  )
));
\`\`\`

---

## Output Discipline (for assistants/agents)

When an agent performs a deploy:

* **Speak:** short confirmation + public URL.
* **Artifacts:** include \`public_url\` and \`content_hash\`.
* **Telemetry:** only on error (status code + hint).

Example agent reply:

\`\`\`
Deployed **agent-dashboard** → https://andiegogiap.com/gemini/agent-dashboard.html
\`\`\`

---

## Validation & Safety

* Ensure \`html\` is a **complete** document (\`<!doctype html>\`, \`<html>\`, \`<head>\`, \`<body>\`).
* Keep \`slug\` to \`[a-z0-9-]\` only; system will sanitize.
* If overwriting, agents should mention “updated existing page”.

---

## Quick Tests

* Health: \`curl -I https://andiegogiap.com/gemini/agent-dashboard.html\` → \`200\`
* JSON shape: ensure \`public_url\` present on success.
* 401 test: call without token server-side → expect 401 (never do this in a browser).

---

## Versioning

* Add request header \`X-CI-Version: 2025-08-11\` so clients can detect server changes.
* Keep these instructions under the tag: \`Gemini Pages Deploy v1\`.

---

## Failure Playbook

* **404**: route not mounted — ensure API exposes \`POST /v1/gemini/pages\`.
* **401**: missing/invalid bearer — fix proxy or server env.
* **403/405**: wrong method or blocked by WAF — confirm POST and path.
* **5xx**: check server logs and directory write permissions.

---

## Optional (CI Command)

Define a CI job named “Deploy Agent Page”:

* Inputs: \`slug\`, \`title\`, \`html_path\`
* Step: read \`html_path\`, POST to \`/v1/gemini/pages\` with bearer
* Output: echo \`public_url\`

---

# V2: Orchestrated Builds with Containers & Agents

The next evolution of the platform introduces a powerful, container-based build process orchestrated by a family of specialized AI agents. This system enables modular, context-aware, and scalable development workflows. The original "Gemini Pages Deploy v1" endpoint can be seen as the final step in this more complex pipeline, used by an agent to publish the final build artifacts.

## Containers API

Create and manage sandboxed containers for use with the Code Interpreter tool.

### Create Container
**POST** \`/v1/containers\`

**Request Body**
- \`name\` (string, required): Name of the container to create.
- \`expires_after\` (object, optional): Container expiration time.
- \`file_ids\` (array, optional): IDs of files to copy to the container.

**Example Request**
\`\`\`bash
curl https://api.openai.com/v1/containers \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
        "name": "My Container"
      }'
\`\`\`

**Example Response**
\`\`\`json
{
    "id": "cntr_682e30645a488191b6363a0cbefc0f0a025ec61b66250591",
    "object": "container",
    "created_at": 1747857508,
    "status": "running",
    "expires_after": { "anchor": "last_active_at", "minutes": 20 },
    "last_active_at": 1747857508,
    "name": "My Container"
}
\`\`\`

### List Containers
**GET** \`/v1/containers\`

### Retrieve Container
**GET** \`/v1/containers/{container_id}\`

### Delete Container
**DELETE** \`/v1/containers/{container_id}\`

---

## Container Files API

Create and manage files within a specific container.

### Create Container File
**POST** \`/v1/containers/{container_id}/files\`

Upload a file to a container. Use a \`multipart/form-data\` request.

**Example Request**
\`\`\`bash
curl https://api.openai.com/v1/containers/{container_id}/files \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -F file="@example.txt"
\`\`\`

**Example Response**
\`\`\`json
{
  "id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
  "object": "container.file",
  "created_at": 1747848842,
  "bytes": 880,
  "container_id": "cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04",
  "path": "/mnt/data/example.txt",
  "source": "user"
}
\`\`\`

### List Container Files
**GET** \`/v1/containers/{container_id}/files\`

### Retrieve Container File
**GET** \`/v1/containers/{container_id}/files/{file_id}\`

### Retrieve Container File Content
**GET** \`/v1/containers/{container_id}/files/{file_id}/content\`

### Delete Container File
**DELETE** \`/v1/containers/{container_id}/files/{file_id}\`

---

## 🛠️ SYSTEM OPERATOR HANDOVER MODULE (Spec Draft)

This specification formalizes how each agent hands down their work, how a \`handover.json\` file grows as a context-aware memory, and how the Operator can scale and manage the entire ecosystem. It's a modular orchestration spec where every agent is plug-and-play, leaving breadcrumbs for the next agent and for the Operator.

### 1. 🎯 Core Principle

Every agent is a **Taskflow Worker**. Each Worker:
1.  Takes a slice of the orchestration prompt (context).
2.  Performs work (build, patch, debug, enhance).
3.  Writes back into the \`handover.json\`.
4.  Passes enriched context to the next Worker.

This guarantees that the Operator and LLM always have a chain of custody for orchestration.

### 2. 📂 Directory Placement

\`\`\`
/webdev
  /handover
    /modules
      alpha-agent.yaml
      bravo-agent.yaml
      taskflow-agent.yaml
    orchestration.yaml   # Master Orchestration Contract
\`\`\`

### 3. 📒 Orchestration Contract (orchestration.yaml)

\`\`\`yaml
system_operator:
  registry: ./templates/registry.json
  containers_dir: ./containers

  agents:
    - id: AlphaAgent
      role: "UI/UX specialist"
      affinity: Alpha
      module: ./handover/modules/alpha-agent.yaml

    - id: BravoAgent
      role: "Backend & Ops"
      affinity: Bravo
      module: ./handover/modules/bravo-agent.yaml

    - id: TaskflowAgent
      role: "Coordinator"
      affinity: Both
      module: ./handover/modules/taskflow-agent.yaml

  workflow:
    - step: parse_prompt
      agent: TaskflowAgent
    - step: match_registry
      agent: TaskflowAgent
    - step: create_container
      agent: TaskflowAgent
    - step: build_ui
      agent: AlphaAgent
    - step: setup_services
      agent: BravoAgent
    - step: datastore_integration
      agent: BravoAgent
    - step: finalize_handover
      agent: TaskflowAgent
\`\`\`

### 4. 🧩 Agent Module Example (alpha-agent.yaml)

\`\`\`yaml
agent:
  name: AlphaAgent
  affinity: Alpha
  capabilities:
    - "Assemble frontend templates"
    - "Apply UI libraries (Tailwind, ShadCN)"
    - "Enhance UX with animations and components"
  inputs:
    - container_id
    - chosen_templates.ui
    - prompt_context
  outputs:
    - updated_src_files
    - ui_notes
    - handover_entry
  handover_schema:
    action: "ui-update"
    by: "AlphaAgent"
    details:
      template_used: string
      components_added: array
      notes: string
\`\`\`

### 5. 📜 Handover.json (Evolving Context)

This file acts as the living project diary, growing with each agent's contribution.

\`\`\`json
{
  "container_id": "container_a1b2c3d4",
  "operator": "andoy",
  "prompt": "Build fancy to-do app with React + Tailwind + IndexedDB",
  "chosen_templates": {
    "base": "REACT",
    "ui": ["TAILWIND"],
    "datastore": "IndexedDB"
  },
  "history": [
    {
      "action": "create",
      "by": "TaskflowAgent",
      "at": "2025-08-16T10:00:00Z",
      "details": { "container": "initialized" }
    },
    {
      "action": "ui-update",
      "by": "AlphaAgent",
      "at": "2025-08-16T10:05:00Z",
      "details": {
        "template_used": "REACT",
        "components_added": ["ToDoList", "GlassCard"],
        "notes": "Applied Tailwind glassmorphism."
      }
    },
    {
      "action": "service-setup",
      "by": "BravoAgent",
      "at": "2025-08-16T10:10:00Z",
      "details": {
        "service": "NODE_EXPRESS",
        "endpoint": "/api/tasks",
        "notes": "Express server created."
      }
    }
  ]
}
\`\`\`

### 6. 📈 Operator Scaling

With this structure, the Operator (via IDE + LLM) can:
- See \`handover.json\` as the living project diary.
- Manage agents like modules (e.g., swap \`AlphaAgent v1\` for \`AlphaAgent v2\`).
- Extend the ecosystem by adding new agent modules into \`/handover/modules/\`.
- Ensure context is portable—move a container to another domain or LLM, and it retains its history.

### 7. 🔮 Future Adaptation

- Agents can start to learn orchestration heuristics from history patterns.
- The Operator can promote an Agent to a "Supervisor" role (AI co-orchestrator).
- The system can evolve into a multi-agent orchestration fabric where each agent has its own domain, memory, and autonomy.

---

# 🚦 Command Center Design for Gemini Pages Deploy API

## 1. 🎯 Goal

Create a **Command Center** that lets the Operator:

* Test the **Gemini Pages Deploy API** endpoints directly.
* Orchestrate builds from multiple IDEs.
* Assign and monitor **AI Family agents** as Taskflow Workers.
* Escalate/debug when API chain processes encounter errors.

---

## 2. 🔑 API Testing Strategy

Before orchestration logic grows, the API itself must be **battle tested**.

### Endpoints to Stabilize

* **POST /v1/gemini/pages** → Deploy static page (v1 simple publish).
* **POST /v2/gemini/pages** → Deploy orchestrated container build (v2 AI-driven).
* **GET /v1/gemini/pages/\\:slug** → Fetch deployed page status.
* **GET /v2/gemini/containers/\\:id** → Fetch container build details + handover.json.

### Testing Recommendations

* Create a **Test Panel** in the Command Center for sending raw API calls.
* Show:

  * Request payload
  * Response (JSON viewer)
  * Status codes
* Integrate a **history log** of all tests for debugging regression.

---

## 3. 🏗️ Command Center Architecture

### Core Panels

1. **API Console**

   * Send test requests to \`/v1\` and \`/v2\` endpoints.
   * Inspect headers, payloads, response.
   * Save test cases as “scenarios.”

2. **IDE Orchestration Hub**

   * Connect multiple IDEs (React IDE, Container Manager IDE, SDK Explorer IDE).
   * Allow builds to be triggered via the API.
   * Merge artifacts into the Operator’s workspace.

3. **Agent Monitor**

   * URL: \`https://andiegogiap.com/agent/<AI Family name>\`
   * Displays active Agent roles + assigned taskflows.
   * Real-time handover.json inspector.

4. **Escalation / Debug Panel**

   * Highlight broken builds.
   * Show last failed \`handover.json\` entry.
   * Manual “Send to LLM Debug” button.

---

## 4. ⚙️ Domain-Aware Orchestration

* **Alpha Crew (UI/Frontend)**

  * React/Vue/Tailwind/SHADCN tasks.
* **Bravo Ops (Backend/Infra)**

  * Node.js/Datastore/Express tasks.
* **Maestro (Taskflow Conductor)**

  * Assigns Alpha + Bravo tasks.
  * Writes orchestration history to \`handover.json\`.

---

## 5. 📡 API Ingest Flow (End-to-End)

1. **Operator Prompt** → Command Center.
2. **Maestro** parses prompt → maps to Registry.
3. **API Call** to \`/v2/gemini/pages\` with container + task config.
4. **Alpha Agent** executes frontend build tasks.
5. **Bravo Agent** executes backend/service tasks.
6. **handover.json** updated at each step.
7. **GET /v2/gemini/containers/\\:id** used by Agent Monitor for status.

---

## 6. 🧩 Debug & Escalation Loop

* When API call or Agent task fails:

  * Entry logged in \`handover.json\` as \`status: error\`.
  * Escalation triggered to Debug Panel.
  * Operator can forward context to LLM for real-time fix suggestions.

---

## 7. 🚀 Roadmap

* Phase 1: Build **API Console** for direct endpoint testing.
* Phase 2: Add **Agent Monitor** hooked to \`/agent/<AI Family name>\` URLs.
* Phase 3: Integrate **Maestro** for orchestration + logging.
* Phase 4: Enable **multi-IDE merge** workflows into Command Center.
* Phase 5: Full **LLM Debug integration** for self-healing orchestration.
`;

export default function App(): React.ReactNode {
    const [activeTab, setActiveTab] = useState<'spec' | 'console'>('spec');

    const tabButtonStyle = (isActive: boolean) => 
        `px-4 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 ${
            isActive 
                ? 'bg-gray-900/80 border-b-2 border-cyan-400 text-cyan-300' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70 hover:text-white'
        }`;

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start p-4 md:py-10">
            <div className="w-full max-w-6xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white uppercase tracking-wider" style={{textShadow: '0 0 8px var(--neon-cyan)'}}>
                        Command Center
                    </h1>
                    <p className="text-cyan-200/80 mt-2">Gemini Pages Deploy API</p>
                </header>
                
                <div className="flex justify-center border-b border-cyan-500/30 mb-px">
                    <button
                        onClick={() => setActiveTab('spec')}
                        className={tabButtonStyle(activeTab === 'spec')}
                        aria-selected={activeTab === 'spec'}
                        role="tab"
                    >
                        API Specification
                    </button>
                    <button
                        onClick={() => setActiveTab('console')}
                        className={tabButtonStyle(activeTab === 'console')}
                        aria-selected={activeTab === 'console'}
                        role="tab"
                    >
                        Inference Console
                    </button>
                </div>

                <main
                    className="w-full bg-gray-900/70 backdrop-blur-sm p-4 md:p-8 rounded-b-2xl border border-t-0 border-cyan-500/30 shadow-2xl shadow-cyan-500/10"
                    role="tabpanel"
                >
                    {activeTab === 'spec' && <ApiSpec content={markdownContent} />}
                    {activeTab === 'console' && <ApiConsole />}
                </main>
            </div>
        </div>
    );
}
