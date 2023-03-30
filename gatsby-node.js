const path = require(`path`)

// Define the template for blog post
const blogPost = path.resolve(`./src/templates/blog-post-contentful.js`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    query projectPages {
      allContentfulPost {
        edges {
          node {
            title
            slug
          }
        }
      }
    }
  `)
  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allContentfulPost.edges;
  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostSlug = index === 0 ? null : posts[index - 1].node.slug
      const nextPostSlug = index === posts.length - 1 ? null : posts[index + 1].node.slug


      createPage({
        path: post.node.slug,
        component: blogPost,
        context: {
          slug: post.node.slug,
          previousPostSlug,
          nextPostSlug,
        },
      })
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
