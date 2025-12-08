import { getBlogPosts } from '@/lib/mdx';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Blog | Knitted',
    description: 'Insights on tailoring, fashion technology, and running a modern atelier.',
};

export default function BlogPage() {
    const posts = getBlogPosts().sort((a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    );

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col font-sans">
            <Navbar />

            <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full flex-grow">
                <div className="max-w-2xl mb-16">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        The Knitted Blog
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Thoughts on the future of tailoring, updates from our team, and stories from the ateliers we serve.
                    </p>
                </div>

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                        >
                            {post.metadata.image && (
                                <div className="aspect-[16/9] w-full bg-muted overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={post.metadata.image}
                                        alt={post.metadata.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="text-sm text-primary font-medium mb-3">
                                    {new Date(post.metadata.publishedAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </div>
                                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {post.metadata.title}
                                </h2>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                                    {post.metadata.summary}
                                </p>
                                <div className="mt-auto flex items-center text-sm font-semibold text-primary">
                                    Read Article
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
