module.exports = {
    lang: 'zh-CN',
    title: '最和缓的阳光',
    description: '最和缓的阳光的博客',
    themeConfig: {
        nav: [
            { text: 'JavaScript', link: '/javascript/promise-notes', activeMatch: '^/javascript/' },
            { text: 'Interview', link: '/interview/call-apply-bind', activeMatch: '^/interview/' },
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
                { text: '手动实现call, apply, bind', link: '/interview/call-apply-bind' },
            ]
        },
    ]
}
