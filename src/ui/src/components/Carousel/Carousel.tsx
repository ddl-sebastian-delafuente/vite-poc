import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Carousel as AntCarousel, CarouselProps } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';

const Carousel = ({
  children,
  carouselRef,
  ...rest
}: CarouselProps & { carouselRef?: React.RefObject<CarouselRef> }) => {
  const testId = rest['data-test'] ?? 'domino-carousel';
  return (
    <AntCarousel ref={carouselRef} {...rest} data-test={testId}>
      {children}
    </AntCarousel>
  );
};

export default Carousel;
