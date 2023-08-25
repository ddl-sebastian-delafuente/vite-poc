import * as React from 'react';

import Tag from '../components/Tag/Tag';
import { highlightText } from './search.utils';

export interface KeyValueTagsProps {
  searchTerm?: RegExp;
  tags: { [key: string]: string };
}

export const KeyValueTags = ({
  searchTerm,
  tags,
}: KeyValueTagsProps) => {
  return (
    <>
      {Object.keys(tags).map((key) => (
        <Tag key={key}>{highlightText(key, searchTerm)}: {highlightText(tags[key], searchTerm)}</Tag>
      ))}
    </>
  )
}
