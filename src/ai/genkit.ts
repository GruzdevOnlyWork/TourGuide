import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
// import { firebase } from '@genkit-ai/firebase'; // Remove if not using Firestore in Genkit flows directly

export const ai = genkit({
  plugins: [googleAI() /* , firebase() */], // Remove firebase() if not used
  model: 'googleai/gemini-2.0-flash',
});
