import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'ongoing' | 'upcoming';
}

export async function generateScheduleWithAI(description: string, tournamentData: {
  name: string;
  startDate: string;
  endDate: string;
  type: string;
  maxParticipants: number;
}): Promise<TimelineEvent[]> {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `You are a tournament schedule generator. Based on the following information, generate a detailed tournament schedule with timeline events.

Tournament Details:
- Name: ${tournamentData.name}
- Type: ${tournamentData.type}
- Start Date: ${tournamentData.startDate}
- End Date: ${tournamentData.endDate}
- Max Participants: ${tournamentData.maxParticipants}
- Additional Description: ${description}

Generate a realistic tournament schedule with 5-8 events including:
1. Registration period
2. Team formation/verification
3. Opening ceremony (if applicable)
4. Match/competition phases
5. Finals
6. Award ceremony

Return ONLY a valid JSON array with this exact structure (no markdown, no code blocks, just the raw JSON):
[
  {
    "title": "Event Title",
    "description": "Brief description of this phase",
    "startDate": "DD MMM YYYY",
    "endDate": "DD MMM YYYY",
    "status": "upcoming"
  }
]

Make sure all dates are between ${tournamentData.startDate} and ${tournamentData.endDate}.
All events should have status "upcoming" since this is a new schedule.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to extract JSON from the response
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Find JSON array
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    const events = JSON.parse(jsonText);
    
    // Add IDs and validate
    return events.map((event: any, index: number) => ({
      id: `event-${Date.now()}-${index}`,
      title: event.title || 'Untitled Event',
      description: event.description || '',
      startDate: event.startDate || tournamentData.startDate,
      endDate: event.endDate || tournamentData.endDate,
      status: event.status || 'upcoming'
    }));
  } catch (error) {
    console.error('Error generating schedule:', error);
    throw new Error('Failed to generate schedule with AI');
  }
}
