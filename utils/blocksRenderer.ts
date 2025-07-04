import { h, Fragment, Comment } from 'vue';

import { Block } from '~/utils/block';

import type {
  ComponentsContextValue,
  BlocksRendererProps,
  BlocksComponents,
  ModifiersComponents,
} from '~/types/renderer/Blocks';

export const defaultComponents: ComponentsContextValue = {
  blocks: {
    paragraph: (props) => h('p', { style: 'font-size: 1.5rem' }, props.children),
    quote: (props) => h('blockquote', {}, props.children),
    code: (props) => h('pre', {}, [h('code', {}, props.plainText)]),
    heading: ({ level, children }) => {
      switch (level) {
        case 1:
          return h('h1', { class: 'text-h1 mb-4' }, children);
        case 2:
          return h('h2', { class: 'text-h2 mb-2' }, children);
        case 3:
          return h('h3', { class: 'text-h3 mb-1' }, children);
        case 4:
          return h('h4', { class: 'text-h4 mb-1' }, children);
        case 5:
          return h('h5', { class: 'text-h5 mb-1' }, children);
        case 6:
          return h('h6', { class: 'text-h6 mb-1' }, children);
      }
    },
    link: (props) => h('a', { href: props.url }, props.children),
    list: (props) => {
      const isUl = props.format === 'ordered';
      return h(isUl ? 'ol' : 'ul', {}, props.children);
    },

    'list-item': (props) => h('li', {}, props.children),
    image: ({ image }) =>
      h('img', {
        src: image.url,
        alt: image.alternativeText || undefined,
      }),
  },
  modifiers: {
    bold: (props) => h('strong', { class: 'font-weight-bold ma-1' }, props.children),
    italic: (props) => h('em', {}, props.children),
    underline: (props) => h('u', {}, props.children),
    strikethrough: (props) => h('del', {}, props.children),
    code: (props) => h('code', {}, props.children),
  },
  missingBlockTypes: [],
  missingModifierTypes: [],
};

export const BlocksRenderer = (props: BlocksRendererProps) => {
  const blocks: BlocksComponents = {
    ...defaultComponents.blocks,
    ...props.blocks,
  };

  const modifiers: ModifiersComponents = {
    ...defaultComponents.modifiers,
    ...props.modifiers,
  };

  const componentsContext: ComponentsContextValue = {
    blocks,
    modifiers,
    missingBlockTypes: [],
    missingModifierTypes: [],
  };

  if (!props.content) throw new Error('BlocksRenderer content is empty');

  const divs = props.content.map((content) => Block({ content, componentsContext }));

  if (componentsContext.missingBlockTypes.length)
    divs.unshift(h(Comment, `missingBlockTypes: ${componentsContext.missingBlockTypes}`));

  if (componentsContext.missingModifierTypes.length)
    divs.unshift(h(Comment, `missingModifierTypes: ${componentsContext.missingModifierTypes}`));

  return h(Fragment, divs);
};
