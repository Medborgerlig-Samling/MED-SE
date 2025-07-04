import type { StrapiNode, ComponentsContextValue, GetPropsFromNode } from '~/types/renderer/Blocks';

import type { VNode } from 'vue';
import { h } from 'vue';
import { Text } from '~/utils/text';
import { name } from '../package.json';

type BlockComponentProps = GetPropsFromNode<StrapiNode>;

interface BlockProps {
  content: StrapiNode;
  componentsContext: ComponentsContextValue;
}

const voidTypes = ['image'];

/**
 * Add props that are specific to a block type, and not present in that node type
 */
const augmentProps = (content: StrapiNode) => {
  const { children: childrenNodes, type, ...props } = content;

  if (type === 'code') {
    // Builds a plain text string from an array of nodes, regardless of links or modifiers
    const getPlainText = (children: typeof childrenNodes): string => {
      return children.reduce((currentPlainText, node) => {
        if (node.type === 'text') return currentPlainText.concat(node.text);

        if (node.type === 'link') return currentPlainText.concat(getPlainText(node.children));

        // If type is not accounted for skip it.
        return currentPlainText;
      }, '');
    };

    return {
      ...props,
      plainText: getPlainText(content.children),
    };
  }

  return props;
};

export const Block = ({ content, componentsContext }: BlockProps) => {
  const { children: childrenNodes, type, ...props } = content;

  // Get matching component from the context
  const { blocks, missingBlockTypes } = componentsContext;

  const BlockComponent = blocks[type] as (props: BlockComponentProps) => VNode | undefined;

  if (!BlockComponent) {
    // Only warn once per missing block
    if (!missingBlockTypes.includes(type)) {
      console.warn(`[${name}] No component found for block type "${type}"`);
      missingBlockTypes.push(type);
    }

    // Don't throw an error, just ignore the block
    return null;
  }

  // Handle void types separately as they should not render children
  if (voidTypes.includes(type)) {
    return BlockComponent(props);
  }

  // Handle empty paragraphs separately as they should render a <br> tag
  if (
    type === 'paragraph' &&
    childrenNodes.length === 1 &&
    childrenNodes[0].type === 'text' &&
    childrenNodes[0].text === ''
  ) {
    return h('br');
  }

  const augmentedProps = augmentProps(content);

  const theChildren: any = childrenNodes.map((childNode) => {
    if (childNode.type === 'text') {
      const { type: _type, ...childNodeProps } = childNode;

      return Text({ componentsContext, ...childNodeProps });
      /* return <Text props={childNodeProps} key={index} />; */
    }

    return Block({ content: childNode, componentsContext });
  });
  if (type === 'paragraph') {
    return [BlockComponent({ children: theChildren, ...augmentedProps }), h('br')];
  }

  return BlockComponent({ children: theChildren, ...augmentedProps });
};
