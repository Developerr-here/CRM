import { GoogleGenerativeAI } from "@google/generative-ai";
import Lead from "../models/Lead.js";
import Task from "../models/Task.js"; // Ensure this model exists
import { searchWeb } from "../utils/searchTool.js";

/**
 * Autonomous Agent Logic
 * 1. Researches the company via Web Search
 * 2. Scores the lead based on findings
 * 3. Automatically creates a follow-up task for the salesperson
 */
export const internalAiLogic = async (leadId) => {
  try {
    const lead = await Lead.findById(leadId).populate("customer");
    if (!lead) return console.log("❌ Lead not found");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Define the tool for the AI
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      tools: [{
        functionDeclarations: [{
          name: "searchWeb",
          description: "Search the internet for company news, LinkedIn profiles, or industry trends to enrich lead data.",
          parameters: {
            type: "OBJECT",
            properties: { query: { type: "string", description: "The search query, e.g., 'Tesla company news 2026'" } },
            required: ["query"]
          }
        }]
      }]
    });

    const chat = model.startChat();
    
    // Start the Reasoning Loop
    const initialPrompt = `
      Goal: Research and enrich this lead for our sales team.
      Customer: ${lead.customer?.name}
      Company: ${lead.customer?.company}
      Notes: ${lead.notes}

      Step 1: Use 'searchWeb' to find 1-2 recent facts about this company or industry.
      Step 2: Based on your findings, provide a conversion score (0-100).
      Step 3: Write a personalized 'Ice Breaker' for a salesperson.
      Step 4: Suggest a specific 'Next Task' title and description.

      Return ONLY a JSON object:
      {
        "score": number,
        "summary": "strategic insight string",
        "task_title": "string",
        "task_desc": "string"
      }
    `;

    let result = await chat.sendMessage(initialPrompt);
    let call = result.response.functionCalls()?.[0];

    // Check if the AI wants to use the search tool
    if (call && call.name === "searchWeb") {
      console.log(`📡 Agent is searching the web for: ${call.args.query}...`);
      const searchData = await searchWeb(call.args.query);
      
      // Feed the search results back to the AI to get the final analysis
      result = await chat.sendMessage([{
        functionResponse: { name: "searchWeb", response: { content: searchData } }
      }]);
    }

    // Process the final response
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const data = JSON.parse(text);

    // Update Lead with AI insights
    lead.aiScore = data.score;
    lead.aiSummary = data.summary;
    lead.lastAiUpdate = new Date();
    await lead.save();

    // AUTONOMOUS ACTION: Create the Task in the database
    const newTask = await Task.create({
      title: data.task_title || `Follow up with ${lead.customer?.name}`,
      description: data.task_desc || "Automated follow-up suggested by AI Agent.",
      status: "pending",
      priority: data.score > 80 ? "high" : "medium",
      lead: lead._id,
      customer: lead.customer?._id,
      organization: lead.organization,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Due in 24 hours
    });

    console.log(`✅ Agent Complete: Lead scored ${data.score} and Task created: "${newTask.title}"`);
  } catch (error) {
    console.error("❌ Agentic Error:", error.message);
  }
};

export const analyzeLead = async (req, res) => {
  try {
    await internalAiLogic(req.params.leadId);
    res.json({ success: true, message: "Autonomous analysis and task creation triggered" });
  } catch (error) {
    res.status(500).json({ message: "AI Error", error: error.message });
  }
};

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import Lead from "../models/Lead.js";
// import Task from "../models/Task.js"
// import {searchWeb} from "../utils/searchTool.js"

// export const internalAiLogic = async (leadId) => {
//   try {
//     // 1. Fetch deep lead data including customer and organization details
//     const lead = await Lead.findById(leadId).populate("customer");
//     if (!lead) return console.log("❌ AI Error: Lead not found");

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

//     // 2. Build a high-context data package for the AI
//     const leadContext = {
//       customerName: lead.customer?.name,
//       company: lead.customer?.company || "Not specified",
//       industry: lead.customer?.industry || "Unknown",
//       dealValue: `$${lead.value.toLocaleString()}`,
//       status: lead.status,
//       source: lead.source || "Direct Outreach",
//       notes: lead.notes || "No specific notes provided by the salesperson.",
//       daysInPipeline: Math.floor((new Date() - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24))
//     };

//     // 3. The "Strategy Prompt"
//     const prompt = `
//       You are a Senior Sales Strategist for a B2B SaaS company. 
//       Analyze the following lead data and provide a conversion probability score and a strategic summary.

//       DATA:
//       - Customer: ${leadContext.customerName}
//       - Company: ${leadContext.company} (${leadContext.industry} industry)
//       - Source: ${leadContext.source}
//       - Deal Value: ${leadContext.dealValue}
//       - Current Status: ${leadContext.status}
//       - Salesperson's Notes: "${leadContext.notes}"

//       INSTRUCTIONS:
//       1. Score (0-100): Be realistic. High value doesn't mean high probability. 
//       2. Summary: Provide 2-3 sentences of tactical advice. If notes are missing, suggest specific discovery questions to ask. 
      
//       Return ONLY valid JSON:
//       {
//         "score": number,
//         "summary": "string"
//       }
//     `;

//     const result = await model.generateContent(prompt);
//     let text = result.response.text().replace(/```json|```/g, "").trim();
    
//     const data = JSON.parse(text);

//     lead.aiScore = data.score;
//     lead.aiSummary = data.summary;
//     lead.lastAiUpdate = new Date();
//     await lead.save();

//     console.log(`✅ AI Strategy Generated for: ${lead.customer?.name}`);
//   } catch (error) {
//     console.error("❌ AI Error:", error.message);
//   }
// };

// export const analyzeLead = async (req, res) => {
//   try {
//     await internalAiLogic(req.params.leadId);
//     res.json({ success: true, message: "Strategic analysis complete" });
//   } catch (error) {
//     res.status(500).json({ message: "AI Error", error: error.message });
//   }
// };