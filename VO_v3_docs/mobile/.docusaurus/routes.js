import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/',
    component: ComponentCreator('/', '3c8'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'd3c'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/about',
        component: ComponentCreator('/about', '5bb'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/audio',
        component: ComponentCreator('/audio', '238'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/audioBible',
        component: ComponentCreator('/audioBible', 'ab7'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/bibleStories',
        component: ComponentCreator('/bibleStories', '65b'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/bookmarks',
        component: ComponentCreator('/bookmarks', 'd28'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/category/features',
        component: ComponentCreator('/category/features', '4e2'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/category/user-login-features',
        component: ComponentCreator('/category/user-login-features', 'c76'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/commentary',
        component: ComponentCreator('/commentary', 'e46'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/compare',
        component: ComponentCreator('/compare', '80a'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/dictionary',
        component: ComponentCreator('/dictionary', 'c65'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/highlights',
        component: ComponentCreator('/highlights', '8f1'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/history',
        component: ComponentCreator('/history', 'b98'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/notes',
        component: ComponentCreator('/notes', '1f6'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/parallelBible',
        component: ComponentCreator('/parallelBible', '15d'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/readBible',
        component: ComponentCreator('/readBible', 'b2d'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/readingPlans',
        component: ComponentCreator('/readingPlans', '97f'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/searchBible',
        component: ComponentCreator('/searchBible', '314'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/signIn',
        component: ComponentCreator('/signIn', '1e4'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/signLanguageBible',
        component: ComponentCreator('/signLanguageBible', 'de0'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/signOut',
        component: ComponentCreator('/signOut', '876'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/signUp',
        component: ComponentCreator('/signUp', '26a'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/songs',
        component: ComponentCreator('/songs', '648'),
        exact: true
      },
      {
        path: '/videos',
        component: ComponentCreator('/videos', '4a5'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/websiteNavigation',
        component: ComponentCreator('/websiteNavigation', '4fe'),
        exact: true,
        sidebar: "vachan"
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
