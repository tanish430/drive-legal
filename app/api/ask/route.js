import { answerQuestion } from '../../../lib/assistant';

export async function POST(request) {
  const body = await request.json();
  const result = answerQuestion({
    question: body.question,
    location: body.location,
    language: body.language,
  });

  return Response.json(result, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
