import { execSync } from "child_process"

export const getLastCommitDate =  (type: 'dev' | 'journal' | 'fragment', filename: string) => {
  let date =  execSync(`git log -1 --format="%ad" --date=short ${type}/${filename}.mdx`, {stdio: 'pipe'}).toString().trim()
  return new Date(date).toDateString()
}
