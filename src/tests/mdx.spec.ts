import { getFilesFromDir, getImageForPost } from "../helpers"


const devPostData = getFilesFromDir('dev', true)
const journalPostData = getFilesFromDir('journal', true)
const fragmentPostData = getFilesFromDir('fragments', true)
const cuisinePostData = getFilesFromDir('cuisine', true)

const combinedPosts = [...devPostData, ...journalPostData, ...fragmentPostData, ...cuisinePostData]


combinedPosts.forEach(post => {
    describe(`${post.title}`, () => {
        it('title length should be greater than 3', () => {
            expect(post.title.length).toBeGreaterThanOrEqual(3)
        })

        it('slug should not have any whitespace and URL-encoded', () => {
            const slug = post.slug
            const noWhitespace = !slug.match(/\s/g)
            expect(noWhitespace).toBeTruthy
            expect(slug).toMatch(encodeURI(slug))
        })

        it('should have a summary', () => {
            expect(post.summary.length).toBeGreaterThanOrEqual(10)
        })

        it('post should have an image', () => {
            const image = getImageForPost(post.slug)
            expect(image).toBeDefined()
        })

        it('Post should have a valid date', () => {
            const date = post.date
            expect(date).toBeDefined()
            expect(new Date(date)).toBeInstanceOf(Date)
        })

        it('Post should have content', () => {
            expect(post.content.length).toBeGreaterThanOrEqual(50)
        })
    })
})