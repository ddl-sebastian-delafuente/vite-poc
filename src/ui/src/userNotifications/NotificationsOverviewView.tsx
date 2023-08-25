import * as React from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { CheckOutlined } from '@ant-design/icons';
// eslint-disable-next-line no-restricted-imports
import { Pagination, Button, Tag } from 'antd';

import { themeHelper } from '..';
import Select from '@domino/ui/dist/components/Select';
import Card from '@domino/ui/dist/components/Card';
import * as colors from '@domino/ui/dist/styled/colors';
import { error } from '@domino/ui/dist/components/toastr';
import FinishedNotificationsIcon from '../icons/FinishedNotificationsIcon';
import { mixpanel } from '../mixpanel';
import {
  DSPNotificationsOpenScreen,
  DSPNotificationsMarkAllAsReadEvent,
  Locations
} from '../mixpanel/types';



import { displayUserNotifications, markUserNotificationsRead } from '@domino/api/dist/Users';
import {DominoNotificationsPriority, DominoNotificationsUserNotification} from '@domino/api/dist/types';

const { Option } = Select;

const SpanRight = styled.span`
  display: block;
  float: right;
`

const Title = styled.span`
  font-weight: ${themeHelper('fontWeights.normal')};
  font-size: ${themeHelper('fontSizes.large')};
  line-height: 24px;
`

const Hr = styled.hr`
  height: 1px;
  background-color: ${colors.antgrey4};
  border: none;
`

const SpanSubject = styled.span`
  font-weight: ${themeHelper('fontWeights.medium')};
  font-size: ${themeHelper('fontSizes.tiny')};
  line-height: 16px;
  color: ${colors.boulder};
`

const SpanText = styled.span`
  font-weight: ${themeHelper('fontWeights.normal')};
  font-size: ${themeHelper('fontSizes.small')};
  line-height: 22px;
  color: ${colors.mineShaftColor};
  white-space: pre-wrap;
`

const SpanTime = styled.span`
  font-weight: ${themeHelper('fontWeights.normal')};
  font-size: ${themeHelper('fontSizes.small')};
  line-height: 22px;
  color: ${colors.boulder};
`

const SpanOrigin = styled.span`
  font-weight: ${themeHelper('fontWeights.normal')};
  font-size: ${themeHelper('fontSizes.small')};
  line-height: 22px;
  color: ${colors.waikawaGrayLighter};
`

interface DotProps {
  priority : number
}

const Dot = styled.span<DotProps>`
  height: 10px;
  width: 10px;
  background-color: ${(props) => [ colors.white, colors.cabaret, colors.coldPurple, colors.greylight3 ][props.priority]};
  border-radius: 50%;
  display: inline-block;
`

const LargeDot = styled.span`
  height: 24px;
  width: 24px;
  line-height: 24px;
  background-color: ${colors.coldPurple};
  border-radius: 50%;
  display: inline-block;
  color: ${colors.secondaryBackground};
  font-size: 12px;
  text-align: center;
`

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`

const Td1 = styled.td`
  border: 0px ;
  width : 16px;
  vertical-align: top;
`

const Td2 = styled.td`
  border: 0px ;
`

const SpanButton = styled.span`
  float: right;
`

interface TrProps {
  opacity: number
}

const Tr = styled.tr<TrProps>`
  opacity: ${(props) => props.opacity};

  &:hover {
    background-color: transparent;
  }
`

const FinishedPanel = styled.div`
  border: 1px solid ${colors.greylight3};
  border-radius: ${themeHelper('borderRadius.standard')};
  background-color: ${colors.aliceBlueLightest};
  width: 380px;
  height: 200px;
  align: center;
  margin: auto;
  padding: 30px;
  text-align: center;
`

const NonePanel = styled.div`
  border: 1px solid ${colors.greylight3};
  border-radius: ${themeHelper('borderRadius.standard')};
  background-color: ${colors.aliceBlueLightest};
  width: 380px;
  height: 200px;
  align: center;
  margin: auto;
  line-height: 200px;
`

const PanelContent = styled.div`
  text-align: center;
`

const defaultPriority = 'All'

export const NotificationsOverviewView: React.FunctionComponent = () => {

  const [items, setItems] = React.useState<DominoNotificationsUserNotification[]>([])
  const [pagination, setPagination] = React.useState({count:0})
  const [page, setPage] = React.useState(1)
  const [priority, setPriority] = React.useState(defaultPriority)

  const [markAllAsReadDisabled, setMarkAllAsReadDisabled] = React.useState(true)

  const index = () => (( page - 1 ) * pageSize )

  const pageSize = 10

  const listItems = items.map((item : DominoNotificationsUserNotification) =>
    <Tr opacity={item.read ? 0.5 : 1} key={item?.notification?.id}>
      <Td1><Dot priority={item.notification && item.notification.priority == 'Critical' ? 1 : 2}/></Td1>
      <Td2>
        <SpanSubject>{item.notification?.title?.toUpperCase()}</SpanSubject>&nbsp;&nbsp;
        { item.expired ? <Tag color={colors.grey70} >Expired</Tag> : null }
        <br/>
        <SpanText
          dangerouslySetInnerHTML={{ __html: item.notification?.message ? DOMPurify.sanitize(item.notification?.message) : "" }}>
        </SpanText>
        <br/><br/>
        <LargeDot>{item.notification?.origin?.initials}</LargeDot>&nbsp;&nbsp;
        <SpanOrigin>{item.notification?.origin?.name}</SpanOrigin>&nbsp;&nbsp;
        <SpanTime>{moment( item.notification?.created ).format('MM/DD/YYYY h:mma')}</SpanTime>
        <Hr/>
      </Td2>
    </Tr>
  );

  React.useEffect(() => {
    mixpanel.track(() =>
      new DSPNotificationsOpenScreen({
        location: Locations.NotificationsDSP
      })
    );
  }, []);

  React.useEffect(() => {
    getDataFromBackEnd()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priority, page]);

  const getDataFromBackEnd = () => {

    const parameters: {
      offset: number,
      limit: number,
      priority?: DominoNotificationsPriority
      expired?: boolean,
      defaultSort: boolean
    } = {
      offset: index(),
      limit: pageSize,
      defaultSort: true
    }
    if(priority == 'Critical' || priority == 'Default'){
      parameters.priority = priority as DominoNotificationsPriority
    }
    if(priority == 'Expired'){
      parameters.expired = true
    }

    displayUserNotifications(parameters)
      .then(data => {
          const theItems = data.notifications
          if(theItems){
            setItems(theItems)
            setMarkAllAsReadDisabled( theItems.filter(x => !x.read).length == 0 )
          }
          setPagination({count: data.pagination && data.pagination.totalCount ? data.pagination.totalCount : 0})
        }
      );
  }

  const markAllAsRead = () => {

    const visibleIds = { ids: items.map(item => item.notification && item.notification.id ? item.notification.id : '')}

    mixpanel.track(() =>
      new DSPNotificationsMarkAllAsReadEvent({
        location: Locations.NotificationsDSP
      })
    );

    markUserNotificationsRead({body: visibleIds})
      .then(() => getDataFromBackEnd())
      .catch(err => {
        error('failed to mark messages as read')
        console.warn(err)
      })
  }

  const onPriorityChange = (value: string) => {
    setPage(1)
    setPriority(value);
  }

  return <div>
      <br/>
      <Title>Notifications</Title>
      <br/><br/>
      <Card width="100%">
        <SpanText>Priority</SpanText> <SpanButton><Button onClick={markAllAsRead} disabled={markAllAsReadDisabled} type="link"><CheckOutlined /> Mark all as read</Button></SpanButton>
        <br/>
        <Select defaultValue={defaultPriority} style={{ width: 180 }} onChange={onPriorityChange}>
          <Option value="All"><Dot priority={0}/>&nbsp;&nbsp;All</Option>
          <Option value="Critical"><Dot priority={1}/>&nbsp;&nbsp;Critical</Option>
          <Option value="Default"><Dot priority={2}/>&nbsp;&nbsp;Default</Option>
          <Option value="Expired"><Dot priority={3}/>&nbsp;&nbsp;Expired</Option>
        </Select>
        <br/><br/>
        <Table><tbody>{listItems}</tbody></Table>
        {((pagination.count > 0)&&((pagination.count - index()) <= pageSize)) ?
           <FinishedPanel><FinishedNotificationsIcon/><br/><PanelContent>That's all the notifications from last 30 days</PanelContent></FinishedPanel> : ''}
        {(pagination.count == 0) ?
           <NonePanel><PanelContent>You have no notifications &#127881;</PanelContent></NonePanel> : ''}
      </Card>
      <br/>
      <SpanRight>
        <Pagination
          simple
          current={page}
          pageSize={pageSize}
          total={pagination.count == 0 ? 1 : pagination.count}
          onChange={setPage}
        />
      </SpanRight>
      <br/>
      <br/>
  </div>;

};
