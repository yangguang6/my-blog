module.exports = {
    lang: 'zh-CN',
    title: '最和缓的阳光',
    description: '最和缓的阳光的博客',
    themeConfig: {
        nav: [
            { text: 'Translation', link: '/translation/implementing-promise', activeMatch: '^/translation/' },
            { text: 'JavaScript', link: '/javascript/promise-notes', activeMatch: '^/javascript/' },
            { text: 'Interview', link: '/interview/new', activeMatch: '^/interview/' },
        ],
        sidebar: {
            '/translation/': getTranslationSideBar(),
            '/javascript/': getJavascriptSideBar(),
            '/interview/': getInterviewSideBar(),
        }
    },
}

function getTranslationSideBar () {
    return [
        { text: '【译】通过实现 Promise 来加深理解', link: '/translation/implementing-promise' },
    ]
}

function getJavascriptSideBar () {
    return [
        {
            text: '包管理器',
            children: [
                { text: '是时候使用 pnpm 了！', link: '/javascript/pnpm-intro' },
            ]
        },
        {
            text: 'Promise',
            children: [
                { text: 'Promise基础概念及使用总结', link: '/javascript/promise-notes' },
                { text: 'Promise与事件循环', link: '/javascript/promise-and-event-loop' },
            ]
        },
    ]
}

function getInterviewSideBar () {
    return [
        {
            text: '手写实现系列',
            children: [
                { text: '实现new操作', link: '/interview/new' },
                { text: '实现call, apply, bind', link: '/interview/call-apply-bind' },
                { text: '实现Promise相关', link: '/interview/promise-implemented' },
            ]
        },
        {
            text: '浏览器',
            children: [
                { text: '浏览器缓存', link: '/interview/browser-cache' },
            ],
        },
        { text: 'Coding', link: '/interview/coding' },
        { text: '数据结构与算法', link: '/interview/algorithm' },
    ]
}
