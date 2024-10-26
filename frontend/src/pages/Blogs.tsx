import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";

export const Blogs = () => {
    const { loading, blogs = [] } = useBlogs(); // Ensure blogs defaults to an empty array

    if (loading) {
        return (
            <div>
                <Appbar />
                <div className="flex justify-center">
                    <div>
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div>
                    {blogs.map(blog => (
                        <BlogCard
                            key={blog.id} // Always add a unique key prop when mapping over elements
                            id={blog.id}
                            authorName={blog.author?.name || "Anonymous"} // Ensure blog.author is defined
                            title={blog.title}
                            content={blog.content}
                            publishedDate={"2nd Feb 2024"}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
