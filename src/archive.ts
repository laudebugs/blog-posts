import fs from 'fs'
import {getFilesFromDir} from './helpers'

const devPostData = getFilesFromDir('dev', false)
const journalPostData = getFilesFromDir('journal', false)

let combinedData = [...devPostData, ...journalPostData]

combinedData = combinedData
  .sort((a, b) => {
    return b.date - a.date
  })

combinedData = combinedData.reverse()

combinedData = combinedData.map((post, index) => {
  post.no = index + 1
  return post
})

combinedData.sort((a, b) => b.no - a.no)

fs.writeFile(
  './out/archive.json',
  JSON.stringify(combinedData, null, 4),
  'utf8',
  err => {
    if (err) {
      console.log('Error updating archive: ', err.message)
    } else {
      console.log('Successfully Updated archive✅')
    }
  },
)
