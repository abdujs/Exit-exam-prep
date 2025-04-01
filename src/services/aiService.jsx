import axios from 'axios';

export const generateQuestions = async (pdfUrls) => {
  try {
    const response = await axios.post('https://your-ai-api-endpoint.com/generate-questions', {
      pdfUrls,
      questionCount: 100,
    });
    return response.data.questions; // Return the generated questions
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};