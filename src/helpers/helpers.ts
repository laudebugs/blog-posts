import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Feed } from 'feed'
import { marked } from 'marked'
import {uniq} from 'lodash'

export function getFilesFromDir(dir: string, includeSource: boolean) {
  const postsDirectory = path.join(process.cwd(), `${dir}`)
  const filenames = fs.readdirSync(postsDirectory)
  return filenames.map(filename => {
    const fullPath = path.join(process.cwd(), `${dir}/`, filename)
    const post = fs.readFileSync(fullPath, 'utf-8')
    const { data, content } = matter(post)
    data.image = getImageForPost(data.slug)
    data.date = new Date(data.publishedOn)
    if (includeSource) data.content = marked.parse(content)
    return data
  })
}

export function getImageForPost(slug: string) {
  const imagesPath = 'assets/'
  const images = fs.readdirSync(imagesPath)
  const image = images.find(_image => _image.includes(slug))
  const baseImageUrl = 'https://raw.githubusercontent.com/lbugasu/blog-posts/main/assets/'
  return baseImageUrl + image ?? ''
}

export type Post = {
  [key: string]: any;
}
export function createFeed(posts: Post[]) {
  const feed = new Feed({
    title: "Lau de Bugs' Blog",
    description: 'Life and Software Development Blog',
    id: 'https://www.laudebugs.me/',
    link: 'https://www.laudebugs.me/api/rss',
    language: 'en', // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: 'https://www.laudebugs.me/images/logos/logo_light.png',
    favicon: 'https://www.laudebugs.me/favicon.ico',
    copyright: 'All rights reserved 2021, Lau de Bugs',
    updated: new Date(), // optional, default = today
    generator: 'awesome', // optional, default = 'Feed for Node.js'
    feedLinks: {
      json: 'https://www.laudebugs.me/api/rss/json',
      atom: 'https://www.laudebugs.me/api/rss/atom'
    },
    author: {
      name: 'Laurence B. Ininda',
      email: 'lbugasu@gmail.com',
      link: 'https://www.laudebugs.me/'
    }
  })

  let categories: any[]= []
  posts.forEach((post: any) => {
    categories.push(...post.tags)
    feed.addItem({
      title: post.title,
      id: post.url,
      link: `https://www.laudebugs.me/${post.type + post.type!=='fragment'?'':'s'}${post.type!=='fragment'?'/':'#'}${post.slug}`,
      description: post.summary,
      content: post.content,
      author: [
        {
          name: 'Laurence B. Ininda',
          email: 'lbugasu@gmail.com',
          link: 'https://www.laudebugs.me/'
        }
      ],
      contributor: [
        {
          name: 'Laurence B. Ininda',
          email: 'lbugasu@gmail.com',
          link: 'https://www.laudebugs.me/'
        }
      ],
      date: new Date(post.publishedOn),
      image: `https://raw.githubusercontent.com/lbugasu/blog-posts/main/assets/${post.image}`
    })
  })

  categories = uniq(categories)
  categories.forEach(category => feed.addCategory(category))

  return feed
}

export function writeFeed(data, fileName) {
  data.sort((a, b) => b.date - a.date).reverse()

  data.map((post, index: number) => {
    post.no = index + 1
    return post
  })

  data.sort((a, b) => b.no - a.no)
  const feed = createFeed(data)

  const feedStore = {
    rss: feed.rss2(),
    json: JSON.stringify(feed.json1(), undefined, 4),
    atom: feed.atom1()
  }
  fs.writeFile(
    `out/${fileName}.json`,
    JSON.stringify(feedStore, null, 4),
    'utf8',
    err => {
      if (err) {
        console.log(`Error updating the ${fileName} Rss Feeds: `, err.message)
      } else {
        console.log(`Successfully Updated ${fileName} Rss Feeds`)
      }
    }
  )
}

