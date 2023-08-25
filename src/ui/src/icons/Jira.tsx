import * as React from 'react';
import Icon, { IconProps, generateId } from './Icon';

const [id1, id1Ref, id1UrlRef] = generateId();
const [id2, id2Ref, id2UrlRef] = generateId();

void id1Ref;
void id2Ref;

class Jira extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 89,
    width: 87,
    viewBox: '0 0 87 89',
    primaryColor: '#D1D1D1',
    secondaryColor: '#7E7E7E'
  };

  renderContent() {
    const {
      primaryColor, secondaryColor
    } = this.props;

    return (
      <g>
        <defs>
          <linearGradient x1="19.5068816%" y1="51.7576%" x2="72.7325855%" y2="17.99%" id={id1}>
            <stop stopColor="#C7C7C7" offset="0%" />
            <stop stopColor={secondaryColor} offset="100%" />
          </linearGradient>
          <linearGradient x1="19.9861895%" y1="51.7576%" x2="72.3752619%" y2="17.99%" id={id2}>
            <stop stopColor={secondaryColor} offset="0%" />
            <stop stopColor="#C7C7C7" offset="100%" />
          </linearGradient>
        </defs>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" opacity="0.768298921" strokeLinecap="round" strokeLinejoin="round">
          <g transform="translate(-385.000000, -175.000000)">
            <g transform="translate(385.000000, 165.000000)">
              <g>
                <g transform="translate(0.000000, 10.000000)">
                  <g>
                    <g>
                      <g>
                        <path d="M85.0111622,41.8829939 L43.0198736,0 L1.02858502,41.8829939 C-0.339923547,43.2564239 -0.339923547,45.4742444 1.02858502,46.8476745 L43.0198736,88.7168044 L85.0111622,46.8476745 C86.3796708,45.4742444 86.3796708,43.2564239 85.0111622,41.8829939 Z M43.0337734,57.4799379 L29.8817849,44.3618682 L43.0337734,31.2437984 L56.1857619,44.3618682 L43.0337734,57.4799379 Z" fill={primaryColor} />
                        <path d="M43.0198736,31.3325277 C34.408949,22.7451969 34.3658596,8.83133634 42.922575,0.194095304 L14.0582553,28.8009704 L29.7205473,44.4228695 L43.0198736,31.3325277 Z" fill={id1UrlRef} />
                        <path d="M56.2066116,44.3272083 L43.0198736,57.4799379 C47.1755977,61.6221564 49.5104942,67.2418839 49.5104942,73.1018371 C49.5104942,78.9617904 47.1755977,84.5815179 43.0198736,88.7237363 L71.8619537,59.9560395 L56.2066116,44.3272083 Z" fill={id2UrlRef} />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    );
  }
}

export default Jira;
