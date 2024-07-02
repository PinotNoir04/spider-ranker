import {JSDOM} from 'jsdom'

const crawlPage = async (base,curr=base,pages={}) => {
    const baseUrl = new URL(base)
    const currUrl = new URL(curr)
    if (baseUrl.hostname!=currUrl.hostname){
        return pages
    }
    const normCurr = normalizeURL(curr)

    if (pages[normCurr]>0){
        pages[normCurr]++
        return pages
    }
    pages[normCurr] = 1

    let html=""
    try{
        html = await getHtml(curr)
    } catch(err) {
        console.log(`${err}`)
        return pages
    }

    const nextPages = getUrlsFromHtml(html,base)

    for (let page of nextPages){
        pages = await crawlPage(baseUrl,page,pages)
    }

    return pages
}

const getHtml = async (url) => {
    let content
    try{
        content = await fetch(url)
    } catch(err){
        throw new Error(`${err}`)
    }
    if (!content.ok){
        throw new Error(`${content}`)
    }
    if (!content.headers.get("content-type").includes("text/html")){
        throw new Error("invalid type")
    }
    return content.text()
}

const getUrlsFromHtml = (htmlBody, baseUrl) => {
    const dom = new JSDOM(htmlBody)
    const res = []
    const a_list = dom.window.document.querySelectorAll('a')

    for (let tag of  a_list){
        if (tag.hasAttribute('href')){
            const url = new URL(tag.getAttribute("href"),baseUrl).href
            res.push(url)
        }
    }
    return res
}

const normalizeURL = (url) => {
    const urlObj = new URL(url)
    let resUrl = `${urlObj.hostname}${urlObj.pathname}`

    if (resUrl.slice(-1)=="/"){
        resUrl = resUrl.slice(0,-1)
    }

    return resUrl
}

export {normalizeURL,getUrlsFromHtml,crawlPage}