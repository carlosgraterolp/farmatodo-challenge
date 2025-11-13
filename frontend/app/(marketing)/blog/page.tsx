import { type Metadata } from "next";
import { BlogCard } from "@/components/blog/blog-card";
import seoData from "@/lib/next-metadata";
import { BlogPostRows } from "@/components/blog/blog-post-rows";
import { allBlogs } from "content-collections";
import CTA from "@/components/cta";

export const metadata: Metadata = {
  title: "Blog | " + seoData.title,
  description: seoData.description,
  openGraph: {
    images: seoData.openGraph.images,
  },
};

export default async function ArticlesIndex() {
  return (
    <div className="mt-16 lg:mt-32 max-w-6xl mx-auto px-4 py-4">
      {allBlogs.slice(0, 1).map((blog, index) => (
        <BlogCard blog={blog} key={blog.title + index} />
      ))}

      <BlogPostRows blogs={allBlogs} />
      <CTA />
    </div>
  );
}
