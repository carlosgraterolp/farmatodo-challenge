import { BlogLayout } from "@/components/blog/blog-layout";
import CTA from "@/components/cta";
import { notFound } from "next/navigation";
import { allBlogs } from "content-collections";
import { MDXContent } from "@content-collections/mdx/react";
import { components } from "@/components/mdx-components";

export default async function BlogPage({ params }: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blogSlug = slug.split('/').pop();
  if (!blogSlug) return notFound();
  const blog = allBlogs.find((blog) => blog.slug.includes(blogSlug));

  if (!blog) {
    notFound();
  }

  return (
    <div>
      <BlogLayout blog={blog}>
        <MDXContent components={components} code={blog.body} />
      </BlogLayout>
      <div className="py-20">
        <CTA />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return allBlogs.map((post) => ({
    slug: post.slug,
  }));
}
