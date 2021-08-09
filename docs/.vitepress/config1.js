const fs = require('fs')
const path = require('path')

const nav = [
    { text: 'JavaScript', link: '/javascript/', activeMatch: '^/javascript/' },
    { text: 'CSS', link: '/css/', activeMatch: '^/interview/' },
]
const sidebar = nav.reduce((pre, { text, link }) => {
    const fileNames = fs.readdirSync(path.join(__dirname, `..${link}`)).map((fileName) => {
        const title = fileName.split('.')[0]
        return { text: title === 'index' ? text : title, link: title === 'index' ? link : `${link}${title}` }
    })
    pre[link] = fileNames
    return pre
}, {})

console.log('sidebar', sidebar)

module.exports = {
    lang: 'zh-CN',
    title: '最和缓的阳光',
    description: '最和缓的阳光的博客',
    themeConfig: {
        nav,
        sidebar,
    },
}
