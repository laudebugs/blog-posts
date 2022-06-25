import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import {uniq} from 'lodash'
import {FeedAuthor, RSSFeed} from 'feed-core'
import { FeedDescriptions } from './descriptions'

export function getFilesFromDir(dir: string, includeSource: boolean) {
  const postsDirectory = path.join(process.cwd(), `${dir}`)
  const filenames = fs.readdirSync(postsDirectory)
  return filenames
    .filter((filename)=>/^(?!_).+.mdx/gm.test(filename))
    .map(filename => {
    const fullPath = path.join(process.cwd(), `${dir}/`, filename)
    const post = fs.readFileSync(fullPath, 'utf-8')
    const { data, content } = matter(post)

    data.image = getImageForPost(data.slug)
    data.date = new Date(data.publishedOn)
    if (includeSource) data.content = marked.parse(content)
    return data
  })
  .sort((a, b) => {
    return b.date - a.date
  }).reverse()
}

export function getImageForPost(slug: string) {
  const imagesPath = 'assets/'
  const images = fs.readdirSync(imagesPath)
  const image = images.find(_image => _image.includes(slug))
  const baseImageUrl = 'https://raw.githubusercontent.com/laudebugs/blog-posts/main/assets/'
  return baseImageUrl + image ?? ''
}

export type Post = {
  [key: string]: any;
}
export function createFeed(posts: Post[], section: string) {

  let title = "Lau de Bugs' Blog",
    rssLink = 'https://www.laudebugs.me/api/rss',
    description = FeedDescriptions.feed,
    link='https://laudebugs.me'
  if (section){
    rssLink += `?section=${section}`
    title = `Lau de Bugs' Blog - ${section}`
    description = FeedDescriptions[section]
    link+=`/${section}`
  }
  const feed = new RSSFeed(title, description, rssLink)
  feed.link=link
  feed.updatedAt = new Date()
  const author = new FeedAuthor('Laurence B. Ininda','laudebugs@gmail.com', 'https://www.laudebugs.me/')
  feed.author = author
  feed.description = description
  feed.feedImage = 'https://www.laudebugs.me/icons/icon-128x128.png'

  let categories: any[]= []
  posts.forEach((post: any) => {
    categories.push(...post.tags)
    feed.addItem({
      title: post.title,
      link: `https://www.laudebugs.me/${post.type + (post.type === 'fragment'?  's/':'/') + post.slug}`,
      description: post.summary,
      content: post.content,
      date: post.date,
      image: {
        url: post.image,
        width: 1280,
        height: 720,
        thumbnail: post.image,
        description: post.imageDescription,
        credit: post.imageCredit
      },
      authors: [author],
      contributors: [author],
    })
  })

  categories = uniq(categories)
  categories.forEach(category => feed.addCategory(category))

  return feed
}

export function writeFeed(data, section: string) {
  data.sort((a, b) => b.date - a.date).reverse()

  data.map((post, index: number) => {
    post.no = index + 1
    return post
  })

  data.sort((a, b) => b.no - a.no)
  const feed = createFeed(data, section)

  const feedStore = {
    rss: feed.generateRSS(),
    json: '{}',
    atom: 'feed.atom1()'
  }
  fs.writeFile(
    `out/${section}.json`,
    JSON.stringify(feedStore, null, 4),
    'utf8',
    err => {
      if (err) {
        console.log(`Error updating the ${section} Rss Feeds: `, err.message)
      } else {
        console.log(`Successfully Updated ${section} Rss Feeds`)
      }
    }
  )
}

