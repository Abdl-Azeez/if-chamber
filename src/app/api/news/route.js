// src/app/api/news/route.js
import { authenticateToken } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";
import News from "@/models/News";

export async function GET(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  if (id) {
    const newsItem = await News.findById(id);
    return Response.json({ news: newsItem }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  }
  
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const total = await News.countDocuments();
  const news = await News.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
    
  return Response.json({ news, total }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}

export async function POST(req) {
  // const auth = authenticateToken(req);
  // if (auth.error)
  //   return Response.json({ message: auth.error }, { status: 401 });

  await connectToDatabase();
  
  const body = await req.json();

  const { title, description, date, image, visible, showInHero, source } = body; 

  const news = new News({
    title, description, date, image, visible, showInHero: showInHero, source
  });
 
  await news.save();
  return Response.json({ message: "News added successfully!", news });
}

export async function PUT(req) {
  await connectToDatabase();
  await authenticateToken(req);
  const body = await req.json();
  const { id, ...updateData } = body;
  await News.findByIdAndUpdate(id, updateData);
  return Response.json({ message: "News updated successfully!" });
}

export async function DELETE(req) {
  await connectToDatabase();
  await authenticateToken(req);
  const body = await req.json();
  await News.findByIdAndDelete(body.id);
  return Response.json({ message: "News deleted successfully!" });
}
