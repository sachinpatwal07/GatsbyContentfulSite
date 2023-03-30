import * as React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import { INLINES, BLOCKS, MARKS } from "@contentful/rich-text-types"
import Img from "gatsby-image"

const BlogPostContentfulTemplate = ({
  data: { previous, next, site, contentfulPost: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`

  const options = {
    renderMark: {
      [MARKS.BOLD]: text => <b className="font-bold">{text}</b>,
    },
    renderNode: {
      [INLINES.HYPERLINK]: (node, children) => {
        const { uri } = node.data
        return (
          <a href={uri} className="underline">
            {children}
          </a>
        )
      },
      [BLOCKS.HEADING_2]: (node, children) => {
        return <h2>{children}</h2>
      },
    },
  }


  console.log("post.img", post.image.url)
  const imgUrl=typeof(post.image.url);
  console.log(imgUrl)

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.title}</h1>
        </header>
        <Img src={imgUrl}  alt="pic" />
        <div>{renderRichText(post.content, options)}</div>
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={`/${previous.slug}`} rel="prev">
                ← {previous.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={`/${next.slug}`} rel="next">
                {next.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export const Head = ({ data: { contentfulPost: post } }) => {
  return <Seo title={post.title} description={post.subtitle} />
}

export default BlogPostContentfulTemplate

export const pageQuery = graphql`
  query ContentfulBlogPostBySlug(
    $slug: String!
    $previousPostSlug: String
    $nextPostSlug: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulPost(slug: { eq: $slug }) {
      author
      subtitle
      title
      content {
        raw
      }
      image {
        url
      }
    }
    previous: contentfulPost(slug: { eq: $previousPostSlug }) {
      slug
      title
    }
    next: contentfulPost(slug: { eq: $nextPostSlug }) {
      slug
      title
    }
  }
`
