import { useParams, Link, Navigate } from "react-router-dom";
import PublicLayout from "../app/layouts/PublicLayout";
import SEO from "../shared/components/SEO";
import { BLOG_ARTICLES } from "../utils/blogData";

function BlogPostPage() {
  const { slug } = useParams();
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return <Navigate to="/404" replace />;
  }

  // Get related articles
  const relatedArticles = BLOG_ARTICLES.filter((a) => 
    article.related && article.related.includes(a.slug)
  );

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.description,
    "image": `https://daytree.paanipoorie.com${article.coverImage}`,
    "datePublished": article.publishedDate,
    "dateModified": article.updatedDate,
    "author": {
      "@type": "Organization",
      "name": "Paanipoorie Team",
      "url": "https://daytree.paanipoorie.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "DayTree",
      "logo": {
        "@type": "ImageObject",
        "url": "https://daytree.paanipoorie.com/favicon-96x96.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://daytree.paanipoorie.com/blog/${article.slug}`
    }
  };

  return (
    <PublicLayout>
      <SEO 
        title={article.title} 
        description={article.description} 
      />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(articleJsonLd)}
      </script>

      <div style={{ margin: "40px auto", maxWidth: "800px" }}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "20px", fontSize: "14px", fontWeight: "bold" }}>
          <Link to="/" style={{ color: "#000", textDecoration: "none" }}>HOME</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <Link to="/blog" style={{ color: "#000", textDecoration: "none" }}>BLOG</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#666" }}>{article.title.toUpperCase()}</span>
        </nav>

        <article style={{
          border: "3px solid #000",
          background: "#fff",
          boxShadow: "8px 8px 0 #000",
          marginBottom: "40px"
        }}>
          {/* Cover Image */}
          <div style={{
            background: "#000",
            borderBottom: "3px solid #000",
            height: "350px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <img 
              src={article.coverImage} 
              alt={article.title} 
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "grayscale(100%) contrast(120%)"
              }}
            />
          </div>

          <div style={{ padding: "40px" }}>
            <header style={{ marginBottom: "30px", borderBottom: "2px solid #000", paddingBottom: "20px" }}>
              <h1 style={{
                margin: "0 0 15px 0",
                fontSize: "32px",
                fontWeight: "900",
                fontFamily: "Arial, sans-serif",
                textTransform: "uppercase",
                lineHeight: "1.2"
              }}>
                {article.title}
              </h1>
              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>
                <span>Published on {new Date(article.publishedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                {article.updatedDate && article.updatedDate !== article.publishedDate && (
                  <span style={{ marginLeft: "15px" }}>&bull; Updated on {new Date(article.updatedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                )}
                <span style={{ marginLeft: "15px" }}>&bull; By {article.author}</span>
              </div>
            </header>

            {/* Article Content */}
            <div 
              className="blog-content"
              style={{
                lineHeight: "1.7",
                fontSize: "16px",
                color: "#111"
              }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div style={{
            border: "3px solid #000",
            background: "#fff",
            boxShadow: "8px 8px 0 #000",
            padding: "30px",
            marginBottom: "40px"
          }}>
            <h2 style={{
              margin: "0 0 20px 0",
              fontSize: "20px",
              fontWeight: "900",
              textTransform: "uppercase",
              fontFamily: "Arial, sans-serif",
              borderBottom: "2px solid #000",
              paddingBottom: "10px"
            }}>
              Related Articles
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px"
            }}>
              {relatedArticles.map((rel) => (
                <div key={rel.slug} style={{
                  border: "2px solid #000",
                  padding: "16px",
                  background: "#f9f9f9"
                }}>
                  <h3 style={{
                    margin: "0 0 10px 0",
                    fontSize: "16px",
                    fontWeight: "bold",
                    textTransform: "uppercase"
                  }}>
                    <Link to={`/blog/${rel.slug}`} style={{ textDecoration: "none", color: "#000" }}>
                      {rel.title}
                    </Link>
                  </h3>
                  <p style={{ margin: "0 0 15px 0", fontSize: "13px", color: "#555", lineHeight: "1.4" }}>
                    {rel.description}
                  </p>
                  <Link to={`/blog/${rel.slug}`} style={{ fontSize: "13px", fontWeight: "bold", color: "#000", textDecoration: "underline" }}>
                    READ MORE
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Link to="/blog" className="btn-primary" style={{ display: "inline-block", padding: "12px 24px", textDecoration: "none" }}>
            BACK TO ALL ARTICLES
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

export default BlogPostPage;
