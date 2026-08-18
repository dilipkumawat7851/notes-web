const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const aiService = {
  summarize: async (noteContent) => {
    await delay(1500); // Simulate AI processing time
    // Extract text from basic HTML structure
    const plainText = noteContent.replace(/<[^>]*>?/gm, '');
    const firstFewWords = plainText.split(' ').slice(0, 15).join(' ');
    
    return \`Here is a summary of the note: This note primarily discusses "\${firstFewWords}...". Key points include organizing concepts structurally and keeping references accessible for future review. Ensure to follow up on the main action items highlighted.\`;
  },

  improveWriting: async (noteContent) => {
    await delay(2000); // Simulate AI processing time
    
    // In a real app this would return modified HTML/text
    return \`<div>
      <p><em>(AI Improved Version)</em></p>
      \${noteContent}
      <hr />
      <p><strong>AI Suggestions:</strong> The text is clear, but I've enhanced the vocabulary and improved sentence flow. Paragraph transitions are now smoother.</p>
    </div>\`;
  },

  explain: async (noteContent) => {
    await delay(1500);
    return "This document outlines foundational concepts related to the topic. It breaks down complex ideas into manageable parts, lists important references, and establishes a clear framework for understanding the subject matter. To master this, focus on practicing the core examples provided.";
  },

  askNotes: async (question, notes = []) => {
    await delay(2000);
    
    if (!notes.length) {
      return "I couldn't find any information in your notes to answer that question.";
    }
    
    return \`Based on your notes, here is what I found regarding "\${question}": 
    
You have a note titled "\${notes[0].title}" that seems relevant. It mentions several key details about this topic. You might want to review that specific note for complete context.\`;
  },

  chat: async (messages) => {
    await delay(1500);
    const lastMessage = messages[messages.length - 1].content;
    
    return \`I understand you're asking about: "\${lastMessage}". As your AI assistant, I can help you organize this thought, draft a new note, or search your existing knowledge base for related information. What would you like to do?\`;
  }
};

export default aiService;
