import type { UseSeoMetaInput } from '@unhead/vue';

export const AppName = import.meta.env.VITE_APPNAME;
export const SiteUrl = import.meta.env.VITE_SITEURL;

export function getInitHead() {
  return [
    {
      titleTemplate: '%s - ' + AppName,
      meta: [
        {
          name: 'keywords',
          content: '前端, 动画, 个人网站, 技术能力, 项目经历, 个人介绍',
        },
        {
          name: 'description',
          content:
            AppName +
            '是一个基于 Vue 3 的动效流个人网站模板，展示了项目经历、个人介绍以及动画，SSR等相关技术能力',
        },
      ],
    },
  ];
}

export const CommonSeoMeta: UseSeoMetaInput = {
  author: 'ysx',
  colorScheme: 'light dark',
  ogTitle: '动效流简历模板 | ' + AppName,
  ogDescription: '充分利用动效流简历模板，快速构建专业的个人简历。',
  ogImage: `${SiteUrl}/images/site-cover.png`,
  ogImageAlt: 'Code on a computer screen showing JavaScript',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogType: 'website',
  ogUrl: SiteUrl,
  ogSiteName: AppName,
  ogLocale: 'zh_CN',
};

export function getSeoMeta(data?: UseSeoMetaInput): UseSeoMetaInput {
  return { ...CommonSeoMeta, ...(data || {}) };
}
