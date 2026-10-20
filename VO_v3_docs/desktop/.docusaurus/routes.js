import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'd73'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', 'e87'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '4eb'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '904'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', 'c49'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '3e9'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '6a5'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '74a'),
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
        component: ComponentCreator('/audioBible', '0ca'),
        exact: true,
        sidebar: "vachan"
      },
      {
        path: '/bibleStories',
        component: ComponentCreator('/bibleStories', '504'),
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
        component: ComponentCreator('/commentary', '50a'),
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
        path: '/infographics',
        component: ComponentCreator('/infographics', 'c26'),
        exact: true
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
        component: ComponentCreator('/readBible', '509'),
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
        component: ComponentCreator('/signLanguageBible', '1bd'),
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
        path: '/studyBible',
        component: ComponentCreator('/studyBible', '8c3'),
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
