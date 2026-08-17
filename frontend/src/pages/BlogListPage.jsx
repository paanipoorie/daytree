import { Link } from "react-router-dom";
import PublicLayout from "../app/layouts/PublicLayout";
import SEO from "../shared/components/SEO";
import { BLOG_ARTICLES } from "../utils/blogData";

function BlogListPage() {
  return (
    <PublicLayout>
      <SEO 
        title="Productivity & Habit Tracking Blog" 
        description="Read articles and insights on the psychology of habit formation, minimalist productivity tools, and the software engineering behind DayTree." 
      />
      <div className="landing-features" style={{ margin: "40px auto" }}>
        <h1 className="section-title">DayTree Blog</h1>
        <p className="section-subtitle">Insights on discipline, minimal design, and software engineering.</p>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "30px",
          marginBottom: "50px",
          marginTop: "40px"
        }}>
          {BLOG_ARTICLES.map((article) => (
            <article 
              key={article.slug}
              style={{
                border: "3px solid #000",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                boxShadow: "6px 6px 0 #000",
                position: "relative"
              }}
            >
              <div style={{
                borderBottom: "3px solid #000",
                background: "#000",
                height: "160px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
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
              <div style={{ padding: "24px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ 
                  fontSize: "12px", 
                  fontWeight: "bold", 
                  textTransform: "uppercase", 
                  marginBottom: "8px",
                  color: "#666" 
                }}>
                  By {article.author} &bull; {new Date(article.publishedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h2 style={{
                  margin: "0 0 12px 0",
                  fontSize: "20px",
                  fontWeight: "900",
                  fontFamily: "Arial, sans-serif",
                  lineHeight: "1.3",
                  textTransform: "uppercase"
                }}>
                  <Link to={`/blog/${article.slug}`} style={{ textDecoration: "none", color: "#000" }}>
                    {article.title}
                  </Link>
                </h2>
                <p style={{
                  margin: "0 0 20px 0",
                  lineHeight: "1.5",
                  fontSize: "14px",
                  color: "#333",
                  flexGrow: 1
                }}>
                  {article.description}
                </p>
                <Link 
                  to={`/blog/${article.slug}`}
                  className="btn-primary"
                  style={{
                    display: "inline-block",
                    textAlign: "center",
                    textDecoration: "none",
                    padding: "10px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    width: "100%",
                    boxSizing: "border-box"
                  }}
                >
                  READ ARTICLE
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}

export default BlogListPage;
