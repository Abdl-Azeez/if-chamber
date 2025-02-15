import Parser from "rss-parser";

export async function GET(req) {
  try {
    const parser = new Parser({
      headers: { "User-Agent": "Mozilla/5.0" }, // Prevents access issues
    });

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 3;
    const page = parseInt(searchParams.get("page")) || 1;
    const startIndex = (page - 1) * limit;

    const feed = await parser.parseURL(
      "https://news.google.com/rss/search?q=Islamic+Finance&hl=en-US&gl=US&ceid=US:en"
    );

    // Extract source from title (format: "Title - Source")
    const extractSource = (title) => {
      const parts = title.split(" - ");
      return parts.length > 1 ? parts.pop().trim() : "Unknown Source"; // Get the last part as the source
    };

    // Extract title without source
    const extractTitle = (title) => {
      const parts = title.split(" - ");
      return parts.length > 1 ? parts.slice(0, -1).join(" - ").trim() : title;
    };

    // Format and sort articles by date (latest first)
    const latestNews = feed.items
      .map((item) => ({
        title: extractTitle(item.title),
        link: item.link,
        date: new Date(item.pubDate),
        source: extractSource(item.title),
        description: item.contentSnippet || "",
      }))
      .sort((a, b) => b.date - a.date) // Sort by latest date
      .slice(startIndex, startIndex + limit); // Apply pagination

    return Response.json(latestNews);
  } catch (error) {
    console.error("RSS Fetch Error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch RSS feed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
