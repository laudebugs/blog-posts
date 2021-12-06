import {getFilesFromDir, writeFeed} from './helpers'

export const writeFeeds = async () => {
    const devPostData = getFilesFromDir('dev', true)
    const journalPostData = getFilesFromDir('journal', true)
    const fragmentsData = getFilesFromDir('fragments', true)
    const combinedData = [...devPostData, ...journalPostData]

    writeFeed(devPostData, 'dev')
    writeFeed(journalPostData, 'journal')
    writeFeed(fragmentsData, 'fragments')
    
    writeFeed(combinedData, 'feed')
}

