const { getFilesFromDir, writeFeed } = require('./helpers/helpers')

const devPostData = getFilesFromDir('dev', true)
const journalPostData = getFilesFromDir('journal', true)
const combinedData = [...devPostData, ...journalPostData]

writeFeed(devPostData, 'dev')
writeFeed(journalPostData, 'journal')
writeFeed(combinedData, 'feed')
