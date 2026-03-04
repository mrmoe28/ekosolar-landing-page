import { Client } from "@notionhq/client";
import type { Handler } from "@netlify/functions";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  body: string;
}

function getPlainText(prop: any): string {
  if (!prop) return "";
  if (prop.type === "title") return prop.title?.map((t: any) => t.plain_text).join("") ?? "";
  if (prop.type === "rich_text") return prop.rich_text?.map((t: any) => t.plain_text).join("") ?? "";
  if (prop.type === "url") return prop.url ?? "";
  if (prop.type === "date") return prop.date?.start ?? "";
  if (prop.type === "select") return prop.select?.name ?? "";
  return "";
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const handler: Handler = async () => {
  const notionKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_BLOG_DB_ID;

  if (!notionKey || !dbId) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing Notion configuration" }) };
  }

  const notion = new Client({ auth: notionKey });

  try {
    const response = await notion.databases.query({
      database_id: dbId,
      filter: { property: "Status", select: { equals: "Published" } },
      sorts: [{ property: "Published Date", direction: "descending" }],
    });

    const posts: BlogPost[] = response.results.map((page: any, index: number) => {
      const props = page.properties;
      return {
        id: index + 1,
        title: getPlainText(props["Title"]),
        slug: getPlainText(props["Slug"]),
        excerpt: getPlainText(props["Excerpt"]),
        category: getPlainText(props["Category"]),
        readTime: getPlainText(props["Read Time"]),
        date: formatDate(getPlainText(props["Published Date"])),
        image: getPlainText(props["Image URL"]),
        body: getPlainText(props["Body"]),
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
      body: JSON.stringify(posts),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message ?? "Failed to fetch posts" }),
    };
  }
};

export { handler };
