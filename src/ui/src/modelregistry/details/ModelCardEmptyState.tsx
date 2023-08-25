import React from 'react'
import styled from 'styled-components'
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout'
import Card from '@domino/ui/dist/components/Card/Card'
import EmptyExperimentsIcon from '@domino/ui/dist/icons/EmptyExperiments'
import { colors, themeHelper } from '@domino/ui/dist/styled'
import { ExternalLink } from '@domino/ui/dist/components/Icons'
import Link from '@domino/ui/dist/components/Link/Link'

const Wrapper = styled(FlexLayout)`
  padding: 90px 0;
`
const IconTitle = styled.div`
  margin-top: ${themeHelper('margins.small')};
  font-size: 18px;
`
const CardWrapper = styled.div`
  padding: ${themeHelper('paddings.small')};
  flex-grow: 1;
  flex-basis: 560px;
`
const CardTitle = styled.div`
  padding-bottom:  ${themeHelper('paddings.small')};
  color: ${colors.mineShaft};
`
const Header = styled.div`
  font-weight: ${themeHelper('fontWeights.bold')};
`
const Content2 = styled(FlexLayout)`
  background-color: ${colors.aliceBlueLightest};
  height: 180px;
`
const CodeWrapper = styled.div`
  padding: ${themeHelper('margins.medium')};
  white-space: pre-wrap;
  color: ${colors.neutral900};
  font-size: ${themeHelper('fontSizes.tiny')};
  line-height: 16px;
`
const StyledLink = styled(Link)`
  margin-top: ${themeHelper('paddings.small')};
`
const StyledSpan = styled.span`
  margin-left: ${themeHelper('margins.tiny')};
`

const ModelCardEmptyState = () => {
  return (
    <Wrapper flexDirection="column" alignContent="center">
      <FlexLayout flexDirection="column" alignContent="center" padding="0 0 40px 0">
          <EmptyExperimentsIcon />
          <IconTitle>Your registered model doesn't have any versions yet.</IconTitle>
          <p>
            Register a model version along with its parameters and metrics to see it here.
            <br />
            Check out <Link href={`https://docs.dominodatalab.com`}>the docs</Link> for more on how to do this.
          </p>
      </FlexLayout>
      <FlexLayout itemSpacing={0} style={{width: '100%'}}>
       <CardWrapper>
         <Card width="auto">
           <CardTitle>
             <Header>How to register a model version</Header>
             <p>In notebook code or using the MLFlow API, register a model and specify a model version.</p>
           </CardTitle>
           <Content2 justifyContent="flex-start">
             <CodeWrapper className="prettyprint">
               <code>
                 {`import mlflow\n\nexperiment_id = mlflow.create_experiment(\n  "my-experiment-name",\n  tags={"version": "v1", "priority": "P1"},\n)\n\nwith mlflow.start_run(experiment_id=experiment_id):\n  mlflow.log_param("hello", "mlflow")`}
               </code>
             </CodeWrapper>
           </Content2>
           <StyledLink href={'https://www.mlflow.org/docs/latest/tracking.html#logging-functions'} openInNewTab={true}>View logging functions <StyledSpan><ExternalLink /></StyledSpan></StyledLink>
         </Card>
       </CardWrapper>
      </FlexLayout>
    </Wrapper>
  )
}

export default ModelCardEmptyState
