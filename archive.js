const fs = require('fs')

const { getFilesFromDir } = require('./helpers/helpers')
const devPostData = getFilesFromDir('dev', false)
const journalPostData = getFilesFromDir('journal', false)

const combinedData = [...devPostData, ...journalPostData]

combinedData.sort((a, b) => b.date - a.date).reverse()

combinedData.map((post, index) => {
  post.no = index + 1
  return post
})

combinedData.sort((a, b) => b.no - a.no)

fs.writeFile(
  './posts/archive.json',
  JSON.stringify(combinedData, null, 4),
  'utf8',
  err => {
    if (err) {
      console.log('Error updating archive: ', err.message)
    } else {
      console.log('Successfully Updated archive✅')
    }
  },
  4
)
