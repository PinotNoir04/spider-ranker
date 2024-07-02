import { crawlPage } from "./spider.js"

const main = async () => {
    if (process.argv.length != 3){
        console.log("unexpected input")
        return
    }
    console.log(`Crawling: ${process.argv[2]}`)
    const pages = await crawlPage(process.argv[2])

    console.log(pages)
}

main()