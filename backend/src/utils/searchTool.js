import axios from 'axios';

export const searchWeb = async (query) => {
  try {
    // Using Tavily as an example (Very popular in 2026 for Agents)
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: process.env.TAVILY_API_KEY,
      query: query,
      search_depth: "smart",
      include_answer: true
    });
    
    return response.data.results.map(r => r.content).join("\n\n");
  } catch (error) {
    console.error("Search Tool Error:", error.message);
    return "Could not find recent web data for this query.";
  }
};