import React from 'react';
import styled from 'styled-components';
import { themeHelper } from '../../styled';
import Carousel from './Carousel';

const StyledContent = styled.div`
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  background: ${themeHelper('carousel.backgroundColor')};
`;

const CarouselWrapper: React.FC = () => {
	return (
		<Carousel>
			<div>
				<StyledContent>Slide 1</StyledContent>
			</div>
			<div>
				<StyledContent>Slide 2</StyledContent>
			</div>
			<div>
				<StyledContent>Slide 3</StyledContent>
			</div>
			<div>
				<StyledContent>Slide 4</StyledContent>
			</div>
		</Carousel>
	);
};

export default CarouselWrapper;
