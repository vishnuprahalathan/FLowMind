import React, { useState } from 'react';
import AIPanel from './components/AIPanel';
import { Layout, Blocks, Globe, Database, Settings } from 'lucide-react';

export default function App() {
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [provisionedResources, setProvisionedResources] = useState([]);
  const [resourceName, setResourceName] = useState("");
  const [env, setEnv] = useState("Production");

  const handleProvision = (e) => {
    e.preventDefault();
    if (!resourceName.trim()) return;
    
    setShowSuccess(true);
    setProvisionedResources(prev => [{
      id: Date.now(),
      name: resourceName,
      env: env,
      time: new Date().toLocaleTimeString()
    }, ...prev]);
    
    setResourceName("");
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="flex h-screen overflow-hidden antialiased bg-[#050505]">
      
      {/* Mock Dummy App Interface (To be "analyzed" by the Agent) */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${isAgentPanelOpen ? 'mr-[450px]' : ''}`}>
        
        {/* Fake Header */}
        <header className="h-16 border-b border-white/10 flex items-center px-6 justify-between bg-black/20 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Blocks size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
              CloudOps Portal
            </h1>
          </div>
          <button 
            onClick={() => setIsAgentPanelOpen(!isAgentPanelOpen)}
            className="px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium border border-white/10 flex items-center gap-2"
          >
            {isAgentPanelOpen ? 'Hide Agent' : 'Launch FlowMind'}
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          </button>
        </header>

        {/* Fake main content - e.g. a complex dashboard the agent must read */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-light text-white tracking-wide">Infrastructure Provisioning</h2>
              <div className="text-sm px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full">System Healthy</div>
            </div>

            {showSuccess && (
              <div className="p-4 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
                🚀 Resource <strong>{provisionedResources[0]?.name}</strong> Provisioned Successfully.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <Globe className="text-blue-400 mb-4" size={24} />
                <h3 className="font-medium text-lg mb-2">Network Layer</h3>
                <p className="text-gray-400 text-sm">Configure VPCs, load balancers, and DNS routing rules.</p>
              </div>
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <Database className="text-purple-400 mb-4" size={24} />
                <h3 className="font-medium text-lg mb-2">Storage Clusters</h3>
                <p className="text-gray-400 text-sm">Provision NVMe block storage and S3-compatible buckets.</p>
              </div>
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <Settings className="text-orange-400 mb-4" size={24} />
                <h3 className="font-medium text-lg mb-2">Compute Nodes</h3>
                <p className="text-gray-400 text-sm">Deploy auto-scaling container fleets and serverless functions.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* A complex form the user might want the AI to fill */}
              <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent">
                <h3 className="text-xl font-medium mb-6">Create New Resource</h3>
                
                <form className="space-y-5" onSubmit={handleProvision}>
                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 font-medium">Resource Name</label>
                      <input 
                        type="text" 
                        value={resourceName}
                        onChange={(e) => setResourceName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600" 
                        placeholder="e.g. prod-db-primary" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 font-medium">Environment</label>
                      <select 
                        value={env}
                        onChange={(e) => setEnv(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-purple-500 transition-colors appearance-none"
                      >
                        <option value="Production">Production</option>
                        <option value="Staging">Staging</option>
                        <option value="Development">Development</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button type="button" onClick={() => setResourceName("")} className="px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
                    <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-gray-200 transition-colors">Provision Resource</button>
                  </div>
                </form>
              </div>

              {/* RECENT DEPLOYMENTS LIST */}
              <div className="p-8 rounded-2xl border border-white/10 bg-black/20">
                <h3 className="text-xl font-medium mb-6">Recent Deployments</h3>
                <div className="space-y-4">
                  {provisionedResources.length === 0 ? (
                    <div className="text-gray-600 italic text-sm py-8 text-center border-2 border-dashed border-white/5 rounded-xl">
                      No resources deployed yet.
                    </div>
                  ) : (
                    provisionedResources.map(res => (
                      <div key={res.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between animate-in slide-in-from-right-4">
                        <div>
                          <p className="font-medium text-white">{res.name}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">{res.env} • {res.time}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            
          </div>
        </main>
      </div>

      {/* FlowMind Agent Panel (Absolute positioning on the right) */}
      <AIPanel isOpen={isAgentPanelOpen} />
      
    </div>
  );
}
