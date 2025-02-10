import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    return Response.json({ message: 'MongoDB Connected Successfully' });
  } catch (error) {
    return Response.json({ message: 'MongoDB Connection Failed', error: error.message }, { status: 500 });
  }
}
