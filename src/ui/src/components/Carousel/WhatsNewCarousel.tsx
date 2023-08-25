import React, { useState } from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import Carousel from './Carousel';
import Modal from '@domino/ui/dist/components/Modal';
import Button from '@domino/ui/dist/components/Button/Button';
import { DominoCommonUserUserUiuxStateDto } from '@domino/api/dist/types';
import { getCurrentUserUIUXState, setCurrentUserUIUXState } from '@domino/api/dist/Users';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { themeHelper } from '../../styled/themeUtils';
import { CarouselRef } from 'antd/lib/carousel';
import IllustrationAutoML from '../../icons/IllustrationAutoML';
import IllustrationModelReg from '../../icons/IllustrationModelReg';
import FlexLayout from '../Layouts/FlexLayout';
import { useRemoteData } from '../../utils/useRemoteData';
import useStore from '../../globalStore/useStore';

const Actions = styled.div`
  display: flex;
  justify-content:flex-end;
`;

const StyledFooter = styled.div`
  width: 100%;
  padding: 10px 24px;
  border-top: 1px solid ${themeHelper('carousel.backgroundColor')};
  margin: 0;
  .ant-btn.domino-button .anticon.anticon-left {
    margin-left: -3px;
  }
  .ant-btn.domino-button .anticon.anticon-right {
    margin-right: -3px;
  }
  .ant-btn-group .ant-btn {
    margin-left: 10px;
    padding: 0 23px;
  }
  .ant-btn .anticon svg {
    width: 12px;
    height: 12px;
  }
`;

const StyledCarousel = styled(Carousel)`
.slick-dots li button {
  background: ${themeHelper('carousel.backgroundColor')};
  opacity: 1;
}
.slick-dots li.slick-active button {
  background: ${themeHelper('carousel.color')};
  opacity: 1;
}
`;

const StyledContent = styled(FlexLayout)`
  height: 60px;
  margin: 0 24px;
  text-align: center;
`;

const StyledSVGContainer = styled(FlexLayout)`
  padding: 22px 0;
  height: 224px;
`;

type HideFlagProps = {
  hideAutoMLCarousel: boolean,
  hideModelRegCarousel: boolean,
}

type Slide = {
  titleIconName: string;
  titleText: string;
  content: JSX.Element;
}

const getSavedState: (currentUserUIUXState: DominoCommonUserUserUiuxStateDto) => HideFlagProps = (currentUserUIUXState) => (
  {
    hideAutoMLCarousel: currentUserUIUXState.stateMap[hideAutoMLId] === 'true',
    hideModelRegCarousel: currentUserUIUXState.stateMap[hideModelRegId] === 'true',
  }
);

const isVisible = (flags: HideFlagProps) => flags && Object.keys(flags).some(flag => flag);

const autoMLSlides = [
  {
    titleIconName: 'NewUsageIcon',
    titleText: 'Transparent AutoML - New Feature in GA',
    content: (
      <div>
        <StyledSVGContainer justifyContent="center" alignItems="center">
          <IllustrationAutoML/>
        </StyledSVGContainer>
        <StyledContent justifyContent="center" alignItems="center" flexDirection="column">
          <div>
            Automate training with full code visibility and customization for experts and non-experts.
          </div>
        </StyledContent>
      </div>
    )
  },
];

const modelRegSlides = [
  {
    titleIconName: 'ExperimentOutlined',
    titleText: 'Model Registry - In Public Preview',
    content: (
      <div>
      <StyledSVGContainer justifyContent="center" alignItems="center">
        <IllustrationModelReg />
      </StyledSVGContainer>
      <StyledContent flexDirection="column" alignContent="center">
        <div>
          Centralized registry with complete lineage tracking and auditability.
        </div>
      </StyledContent>
    </div>
    )
  },
]

export const hideAutoMLId = 'hide-automl-carousel';
export const hideModelRegId = 'hide-model-reg-carousel';

// The test command to clear DB:
// 5.5
// db.user_uiux_state.update({}, {$set: {"stateMap.hide-lca-carousel": "false", "stateMap.hide-em-feature-carousel": "false"}})
// 5.6
// db.user_uiux_state.update({}, {$set: {"stateMap.hide-em-feature-carousel": "false", "stateMap.hide-lca-carousel": "false", "stateMap.hide-feature-store-carousel": "false", "stateMap.hide-scheduled-jobs-carousel": "false"}})
// 5.7
// db.user_uiux_state.update({}, {$set: {"stateMap.hide-automl-carousel": "false", "stateMap.hide-model-reg-carousel": "false"}})

const getCarousalSlides = ({hideAutoMLCarousel, hideModelRegCarousel}: HideFlagProps) => {
  let slidesToShow: Slide[] = [];
  if (!hideAutoMLCarousel) {
    slidesToShow = slidesToShow.concat(autoMLSlides);
  }
  if (!hideModelRegCarousel) {
    slidesToShow = slidesToShow.concat(modelRegSlides);
  }
  return slidesToShow;
};

const getCarouselIdsToClose = ({hideAutoMLCarousel, hideModelRegCarousel}: HideFlagProps) => {
  let slidesIds: string[] = [];
  if (!hideAutoMLCarousel) {
    slidesIds = slidesIds.concat(hideAutoMLId);
  }
  if (!hideModelRegCarousel) {
    slidesIds = slidesIds.concat(hideModelRegId);
  }
  return slidesIds;
}; 

const WhatsNewCarousel = () => {
  const carouselRef: React.RefObject<CarouselRef> = React.createRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visible, setVisible] = useState<boolean>();
  const [slides, setSlides] = useState<any[]>([]);

  const beforeChange = (currentSlide: number, nextSlide: number) => {
    setCurrentSlide(nextSlide);
  };

  const {
    data: currentUserUIUXState,
  } = useRemoteData({
    canFetch: true,
    fetcher: () => getCurrentUserUIUXState({}),
    initialValue: {
      stateMap: {
        [hideAutoMLId]: "true",
        [hideModelRegId]: "true",
      }
    },
  });

  const { whiteLabelSettings } = useStore();

  React.useEffect(() => {
    const savedState = getSavedState(currentUserUIUXState);
    setSlides(getCarousalSlides(savedState));
    setVisible(isVisible(savedState));
  }, [currentUserUIUXState, whiteLabelSettings]);

  const isLastSlide = (slide: number) => R.equals(slide, R.subtract(slides.length, 1));

  const isFirstSlide = currentSlide === 0;

  const hideWhatsNewCarousel = async () => {
    try {
      const slidesToClose = getCarouselIdsToClose(getSavedState(currentUserUIUXState));
      setVisible(false);
      const stateObj = {};
      R.map(slide => stateObj[slide] = 'true', slidesToClose);
      await setCurrentUserUIUXState({ body: { stateMap: stateObj } });
    } catch (err) {
      console.error(err);
    }
  };

  return  (slides.length > 0 ? <Modal
    visible={visible}
    titleIconName={slides[currentSlide].titleIconName}
    titleText={slides[currentSlide].titleText}
    noFooter
    bodyStyle={{ padding: 0 }}
    destroyOnClose
    closable
    onCancel={hideWhatsNewCarousel}
  >
    <StyledCarousel carouselRef={carouselRef} style={{ height: '312px' }} beforeChange={beforeChange}>
      {slides.map(slide => slide.content)}
    </StyledCarousel>
    <StyledFooter>
      <Actions>
        <Button
          icon={< ArrowLeftOutlined />}
          isIconOnlyButton={true}
          btnType="secondary"
          onClick={() => carouselRef.current!.prev()}
          disabled={isFirstSlide ? true : false}
        />
        <Button
          icon={isLastSlide(currentSlide) ? undefined : < ArrowRightOutlined />}
          isIconOnlyButton={isLastSlide(currentSlide) ? false : true}
          btnType={isLastSlide(currentSlide) ? "primary" : "secondary"}
          onClick={() =>
            isLastSlide(currentSlide) ?
              hideWhatsNewCarousel() : carouselRef.current!.next()
          }
        >
          {isLastSlide(currentSlide) && 'Done'}
        </Button>
      </Actions>
    </StyledFooter>
  </Modal> : null);
};

export default WhatsNewCarousel;
