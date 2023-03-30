import { graphql } from "gatsby"
import * as React from "react"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import { INLINES, BLOCKS, MARKS } from "@contentful/rich-text-types"

const Page = ({ data }) => {
  const { content } = data.allContentfulPost.edges[0].node
  console.log("content: ", (content.raw))
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

  return <div>{renderRichText(content, options)}</div>
}

export default Page

export const query = graphql`
  query projectPages {
    allContentfulPost {
      edges {
        node {
          title
          content {
            raw
          }
        }
      }
    }
  }
`
