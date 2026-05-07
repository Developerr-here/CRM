import { internalAiLogic } from '../controllers/aiController.js';

export const triggerAiAnalysis = async (leadId) => {
    try {
        // Wait 1 second to ensure MongoDB has finished the write and indexing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(`🤖 AI Workflow: Analyzing Lead ${leadId}...`);
        await internalAiLogic(leadId);
        console.log(`✅ AI Workflow: Lead ${leadId} scored.`);
    } catch (error) {
        console.error("❌ AI Workflow Error:", error.message);
    }
}