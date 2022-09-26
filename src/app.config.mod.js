/**
 * 项目参数配置
 */
export default {

    // 网站用户名
    user: '沫',

    // 后台管理入口
    adminEntrance: 'admin',

    // 前台背景图片
    backgroundImageURL: 'https://tva1.sinaimg.cn/large/007q9ZDily1h3mv7fyyjlj32yo1o0hdu.jpg',

    // 网站用户头像
    avatarImageURL: 'https://tva1.sinaimg.cn/large/007q9ZDily1h3mv7etuivj30jn0jnwq9.jpg',

    // 文章默认封面
    defaultCoverImageURL: 'https://tva1.sinaimg.cn/large/007q9ZDily1h3mv7f5mfbj30zj0k24dl.jpg',

    // 404页面图片
    _404ImageURL: 'https://tva1.sinaimg.cn/large/007q9ZDily1h3mv1t69btj30gc0a0acy.jpg',

    // 网页标题
    title: {
        // 前台
        home: '沫の小站',
        // 后台
        admin: '后台管理',
        // 404页
        _404: '小笨蛋，页面跑偏啦～'
    },

    // 分页列表每页显示数据条数
    pageSize: {
        admin: 20,
        home: 10
    },

    api: {
        'checkUserURL': 'https://mine.mobingc.ml/user/check',
        'uploadImageURL': 'https://mine.mobingc.ml/image/upload',
        'publishArticleURL': 'https://mine.mobingc.ml/article/publish',
        'listArticleURL': 'https://mine.mobingc.ml/article/list',
        'dataArticleURL': 'https://mine.mobingc.ml/article/data',
        'deleteArticleURL': 'https://mine.mobingc.ml/article/delete',
        'archivesArticleURL': 'https://mine.mobingc.ml/article/archives'
    }
    
};
