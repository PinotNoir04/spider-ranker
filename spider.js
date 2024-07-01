import {JSDOM} from 'jsdom'

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

export {normalizeURL,getUrlsFromHtml}