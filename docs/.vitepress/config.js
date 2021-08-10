module.exports = {
    lang: 'zh-CN',
    title: '和光',
    description: '和光的博客',
    themeConfig: {
        nav: [
            { text: 'JavaScript', link: '/javascript/promise-notes', activeMatch: '^/javascript/' },
            { text: 'Interview', link: '/interview/call', activeMatch: '^/interview/' },
        ],
        sidebar: {
            '/javascript/': getJavascriptSideBar(),
            '/interview/': getInterviewSideBar(),
        }
    },
}

function getJavascriptSideBar () {
    return [
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
            text: '手写系列',
            children: [
                { text: 'call, apply, bind', link: '/interview/call-apply-bind' },
            ]
        },
    ]
}
