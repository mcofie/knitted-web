import { getBlogPosts, getBlogPost } from '@/lib/mdx';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Props = {
    params: Promise<{ slug: string }>;
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).slug;
    const post = getBlogPost(slug);

    if (!post) {
        return {
            title: 'Post Not Found | Knitted',
        };
    }

    return {
        title: `${post.metadata.title} | Knitted`,
        description: post.metadata.summary,
        openGraph: {
            title: post.metadata.title,
            description: post.metadata.summary,
            type: 'article',
            publishedTime: post.metadata.publishedAt,
            authors: [post.metadata.author || 'Knitted Team'],
        },
    };
}

export async function generateStaticParams() {
    const posts = getBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPost({ params }: Props) {
    const slug = (await params).slug;
    const post = getBlogPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col font-sans">
            <Navbar />

            <article className="pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto w-full flex-grow">
                <Link
                    href="/blog"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back to Blog
                </Link>

                <div className="mb-10 text-center">
                    <div className="text-sm text-primary font-medium mb-4">
                        {new Date(post.metadata.publishedAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                        {post.metadata.title}
                    </h1>
                    {post.metadata.author && (
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <span>By {post.metadata.author}</span>
                        </div>
                    )}
                </div>

                {post.metadata.image && (
                    <div className="rounded-2xl overflow-hidden mb-12 aspect-[16/9] bg-muted border border-border/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={post.metadata.image}
                            alt={post.metadata.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="prose prose-lg dark:prose-invert prose-slate prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
                    <MDXRemote source={post.content} />
                </div>
            </article>

            <Footer />
        </main>
    );
}
