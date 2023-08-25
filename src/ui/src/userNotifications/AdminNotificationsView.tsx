import * as React from 'react';
import {
  BellOutlined,
  ContainerFilled,
  DeleteFilled,
  InfoCircleOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import {
  // eslint-disable-next-line no-restricted-imports
  Menu, Dropdown, Modal, Input, DatePicker, TimePicker, Tooltip, Form, Table
} from 'antd';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import { difference, map, sort } from 'ramda';

import { error } from '@domino/ui/dist/components/toastr';
import Select from '../components/Select/Select';
import Button from '../components/Button/Button';
import { themeHelper } from '../styled';
import * as colors from '@domino/ui/dist/styled/colors';
import { mixpanel } from '../mixpanel';
import {
  AdminNotificationsDeleteButtonEvent,
  AdminNotificationsExpireButtonEvent,
  AdminNotificationsCreateMessageEvent,
  AdminNotificationsOpenScreen,
  Locations
} from '../mixpanel/types';

import { displayAdminNotifications, createAdminNotification, deleteAdminNotification, updateAdminNotifications } from '@domino/api/dist/Admin';
import { listUsers } from '@domino/api/dist/Users';
import { getAllOrganizations } from '@domino/api/dist/Organizations';
import {
  DominoNotificationsCreateNotificationRequest
} from '@domino/api/dist/types'
import { httpRequest } from '@domino/api/dist/httpRequest';


type DisplayAdminNotificationsParameters = {
  priority?: "Critical" | "Default" | undefined,
  expired?: boolean,
  sort?: "title" | "end" | "start" | "priority" | "message" | "created" ,
  dir?: "desc" | "asc",
  offset?: number,
  limit?: number
}

const getTimezoneInfo = (tzName: string) => {
  const now = momentTimezone.tz(+new Date(), tzName);
  const gmtOffset = now.format('Z');
  const zoneAbbreviation = now.format('z');
  return `(GMT${gmtOffset}) ${/^[A-Z]+$/.test(zoneAbbreviation) ? zoneAbbreviation : ''} - ${tzName}`;
};

const unsupportedTimezonesByCronParser = ['PST8PDT', 'EST5EDT', 'GMT0', 'MST7MDT', 'CST6CDT'];
const timezonesList = momentTimezone.tz.names();
const timezonesForSchedule = difference(timezonesList, unsupportedTimezonesByCronParser);
const timezonesSorted = sort((tz1, tz2) => {
  const tz1Offset = momentTimezone.tz(tz1).utcOffset();
  const tz2Offset = momentTimezone.tz(tz2).utcOffset();
  return tz1Offset - tz2Offset;
}, timezonesForSchedule);
const timezoneOptions = map(tzName => ({label: getTimezoneInfo(tzName), value: tzName}), timezonesSorted);

const TimezoneSelectionWrapper = styled.div`
  margin-left: ${({renderOnNewLine}: {renderOnNewLine: boolean}) => renderOnNewLine ? 0 : '4px'};
  margin-top: ${({renderOnNewLine}: {renderOnNewLine: boolean}) => renderOnNewLine ? themeHelper('margins.tiny') : 0};
`;

const NotificationButton = styled(Button)`
  border-radius: ${themeHelper('borderRadius.standard')};
`;

interface TimezoneDropdownProps {
  renderOnNewLine: boolean;
  timeZone: string;
  setTimeZone: (tz: string) => void;
}

const TimezoneDropdown: React.FC<TimezoneDropdownProps> = (props) => (
  <TimezoneSelectionWrapper renderOnNewLine={props.renderOnNewLine}>
    <Select
      showSearch={true}
      value={props.timeZone}
      options={timezoneOptions}
      onSelect={props.setTimeZone}
      getPopupContainer={
        <T extends Element & { parentNode: any }>(trigger?: T) => trigger ? trigger.parentNode : undefined}
      style={{width: 280}}
      dropdownStyle={{ zIndex: 2500 }}
      data-test={'schedule-timezone'}
    />
  </TimezoneSelectionWrapper>
);

const { TextArea } = Input;
const { Option } = Select;

const localTimezoneAbbr = new Date().toLocaleTimeString(undefined,{timeZoneName:'short'}).split(' ')[2]

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  grid-template-columns: 180px 180px;
`

const SpanButton = styled.span`
  float: right;
  display: inline-block;
  vertical-align: top;
`

const GridModal = styled.div`
  display: grid;
  grid-template-columns: repeat(14, [col-start] 1fr);
  grid-gap: 5px;
`

const DivModal1 = styled.div`
  grid-column: col-start / span 8;
`

const DivModal2 = styled.div`
  grid-column: col-start / span 4 ;
`

const DivModal3 = styled.div`
  grid-column: 5 / span 3 ;
`

const DivModal4 = styled.div`
  grid-column: 8 / span 8 ;
`

const SpanWithMargin = styled.span`
  margin-left: 7px;
`

interface DotProps {
    priority : number
}

const Dot = styled.span<DotProps>`
  height: 10px;
  width: 10px;
  background-color: ${(props) => [ colors.white, colors.cabaret, colors.coldPurple][props.priority]};
  border-radius: 50%;
  display: inline-block;
`
const defaultPriority = 'All'

const allUsersAndOrganizations = '["all","All users & organizations"]'

type Item = { key: string | null | undefined ; title: string | undefined; message: string | undefined; priority: string; created: string; start: string; end: string; }

const AdminNotificationsView: React.FunctionComponent<{maxNotificationsString:string}> = ({maxNotificationsString}) => {

    const [items, setItems] = React.useState<Item[]>([])
    const [pagination, setPagination] = React.useState({count:0})
    const [priority, setPriority] = React.useState(defaultPriority)
    const [type, setType] = React.useState('Active')
    const [page, setPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(10)

    const [sortOrder, setSortOrder] = React.useState('none')
    const [sortField, setSortField] = React.useState(undefined)

    const [modalVisible, setModalVisible] = React.useState(false)

    const [recipientItems, setRecipientItems] = React.useState<any[]>([])

    const [createNotificationDisabled, setCreateNotificationDisabled] = React.useState(true)

    const [addNotificationDisabled, setAddNotificationDisabled] = React.useState<any>(false)

    const maxNotifications = Number(maxNotificationsString)

    const getRoles = async (): Promise<{name: string, displayName: string}[]> => {
      return await httpRequest('GET',
      '/admin/authz/rolesproviders/Global/roles',
        undefined,
        {},
        { accept: "application/json"},
        null,
        true
        ).catch( err => {
            console.warn("Error getting roles", err)
            return [];
          }
        );
    };

    React.useEffect(() => {
      mixpanel.track(() =>
        new AdminNotificationsOpenScreen({
          location: Locations.NotificationsAdmin
        })
      );
    }, []);

    React.useEffect(()=>{


      listUsers({listOnlyUsers:true})
        .then(responseUsers => {

          getAllOrganizations({})
            .then(responseOrgs => {

              getRoles()
                .then(roleNames => {
                // //TODO: get the list of role names from the back-end
                // function getRoleNames(){
                //   return [
                //       {role:'Practitioner', description: 'Practitioner'},
                //       {role:'Librarian', description: 'Project library administrator'},
                //       {role:'ReadOnlySupportStaff', description: 'Read-only support staff'},
                //       {role:'SysAdmin', description: 'System administrator'},
                //       {role:'SupportStaff', description: 'Support staff'},
                //       {role:'ProjectManager', description: 'Project Manager'},
                //       {role:'LimitedAdmin', description: 'Limited Admin'},
                //       {role:'LicenseReviewer', description: 'License Reviewer'},
                //       {role:'CloudAdmin', description: 'Cloud Admin'}
                //   ]
                // }

                const items = [['all', 'All users & organizations']]
                  .concat(responseUsers.map(x => ['user', `${x.fullName} (${x.userName})`, x.id]))
                  .concat(responseOrgs.map(x => ['org', `${x.name} (Organization)`, x.id]))
                  .concat(roleNames.map(x => ['role', `${x.displayName} (Role)`, x.name]))
                  .sort((a, b) => a[1] < b[1] ? -1 : 1)

                setRecipientItems(items.map(x => <Option key={`${JSON.stringify(x)}`}>{x[1]}</Option>))
              })
            })
            .catch(orgsErr => {
              console.warn(orgsErr);
              error("failed to get list of organizations")
            });

        })
        .catch(usersErr => {
          console.warn(usersErr);
          error("failed to get list of users")
        });


    }, [])

    const index = () => (( page - 1 ) * pageSize )

    React.useEffect(() => {
      getDataFromBackEnd();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ pageSize, page, priority, type, sortOrder, sortField ] );

    React.useEffect(() => {
      setPage(1)
    }, [ sortOrder, sortField ] );

    const onPageChange = (newPage: number, size: number) => {
      setPage(newPage)
      setPageSize(size)
    }

    function onDelete(key: string){
      if (confirm('Are you sure you want to delete this notification?')){
        mixpanel.track(() =>
          new AdminNotificationsDeleteButtonEvent({
            location: Locations.NotificationsAdmin
          })
        );
        deleteAdminNotification({id:key})
        .then(() => getDataFromBackEnd())
        .catch(err => {
          error('failed to delete notification')
          console.warn(err)
        })
      }
    }

    function onExpire(key: string){
      if (confirm('Are you sure you want to expire this notification?')){
        mixpanel.track(() =>
          new AdminNotificationsExpireButtonEvent({
            location: Locations.NotificationsAdmin
          })
        );
        updateAdminNotifications( { id: key, body: { expired: true } } )
        .then(() => getDataFromBackEnd())
        .catch(err => {
          error('failed to mark notification expired')
          console.warn(err)
        })
      }
    }

    const menu = (key: string) => {
      return (
        <Menu
          items={[{
            key: 'delete',
            label: (
              <a onClick={onDelete.bind(null, key)}>
                <DeleteFilled/> Delete
              </a>
            )
          }, {
            key: 'expire',
            label: (
              <a onClick={onExpire.bind(null, key)}>
                <ContainerFilled/> Expire
              </a>
            )
          }]}
        />
      );
    };

    function getDataFromBackEnd() {

      // @ts-ignore
      function formatDate(x){
        const dateTime = moment(x).format('MM/DD/YYYY h:mma')
        return `${dateTime} ${localTimezoneAbbr}`
      }

      const parameters: DisplayAdminNotificationsParameters = {
        expired : type == 'Expired',
        sort : sortField,
        dir : sortOrder == 'descend' ? 'desc' : sortOrder == 'ascend' ? 'asc' : undefined,
        offset : index(),
        limit : pageSize
      }

      if(priority != 'All'){
        parameters.priority = priority as "Critical" | "Default" | undefined
      }

      displayAdminNotifications(parameters)
        .then(res => {

          setAddNotificationDisabled( res.pagination?.totalCount && res.pagination?.totalCount >= maxNotifications )

          function getRecipientNames(limitedAudience:any){
            if(typeof limitedAudience === 'undefined') {
              return ['All users & organizations']
            }

            return limitedAudience.users.map((x:any) => x.name)
              .concat( limitedAudience.orgs.map((x:any) => x.name) )
              .concat( limitedAudience.roles.map((x:any) => x.name) )
              .sort()
          }

          if(res.notifications){
          const theItems = res.notifications.map(x => { return {
            title : x.notification?.title,
            message : x.notification?.message,
            priority: x.notification?.priority as string,
            recipients : getRecipientNames( x.limitedAudience ).join(', '),
            created : x.notification ? formatDate( x.notification.created ) : '',
            start : x.timeframe ? formatDate( x.timeframe.start ) : '',
            end : x.timeframe?.end ? formatDate( x.timeframe.end ) : 'No end date',
            key : x.notification?.id
          }})
          setItems(theItems)
          setPagination({count: res.pagination && res.pagination.totalCount ? res.pagination.totalCount : 0})
        }

        })

    }

    const columns = [
        {
          title: 'TITLE',
          dataIndex: 'title',
          sorter: true,
          ellipsis : true,
        },
        {
          title: 'MESSAGE',
          dataIndex: 'message',
          sorter: true,
          ellipsis : true,
        },
        {
          title: 'PRIORITY',
          dataIndex: 'priority',
          sorter: true,
          width: 100,
          render: (text: string) => <span><Dot priority={text == 'Critical' ? 1 : 2}/><SpanWithMargin>{text}</SpanWithMargin></span> ,
        },
        {
          title: 'RECIPIENTS',
          dataIndex: 'recipients',
          sorter: true,
          windth: 220,
          ellipsis : true
        },
        {
            title: 'CREATED',
            dataIndex: 'created',
            sorter: true,
            width: 220,
        },
        {
            title: 'START DATE',
            dataIndex: 'start',
            sorter: true,
            width: 220,
        },
        {
            title: 'END DATE',
            dataIndex: 'end',
            sorter: true,
            width: 220,
        },
        {
            title: '',
            width: 40,
            dataIndex: 'key',
            render: (text: string) => { return <Dropdown overlay={menu(text)} placement="bottomRight">
                                        <NotificationButton type="link"><MoreOutlined /></NotificationButton>
                                     </Dropdown>
          },
        }

      ];

      // @ts-ignore
      function onColumnChange(pagination, filters, sorter) {
        setSortOrder( sorter.order ? sorter.order : 'none' )
        setSortField( sorter.field )
      }

      const onPriorityChange = (value: string) => {
        setPage(1)
        setPriority(value);
      }

      const onTypeChange = (value: string) => {
        setPage(1)
        setType(value);
      }

      const onModalOK = () => {

        // @ts-ignore
        const formatDate = (date, time, timezoneCity) => {
          return momentTimezone.tz(`${date} ${time}`, timezoneCity).utc().format()
        }

        function getRecipients(keyRecipients: string[]) {
          const parsedRecipients = keyRecipients.map(x => JSON.parse(x))

          const all = parsedRecipients.filter(x => x[0] === 'all').length == 1

          if(all) {
            return undefined
          }

          const orgs = parsedRecipients.filter(x => x[0] === 'org').map(x => x[2])
          const users = parsedRecipients.filter(x => x[0] === 'user').map(x => x[2])
          const roles = parsedRecipients.filter(x => x[0] === 'role').map(x => x[2])

          return {
            orgs : orgs,
            users : users,
            roles : roles
          }

        }

        const recipients = getRecipients(modalRecipients)

    const notification:DominoNotificationsCreateNotificationRequest = {
      title: modalTitle,
      message: modalText,
      priority: modalPriority == 'Critical' ? 'Critical' : 'Default',
      start: formatDate( modalStartDate, modalStartTime, timeZone ),
      end: modalEndType == 'none' ? undefined : formatDate( modalEndDate, modalEndTime, timeZone ),
      targetUsers: recipients?.users,
      targetOrgs: recipients?.orgs,
      targetRoles: recipients?.roles
    }

        mixpanel.track(() =>
          new AdminNotificationsCreateMessageEvent({
            location: Locations.NotificationsAdmin,
            priority: notification.priority,
            start: notification.start ? notification.start : "",
            end: notification.end ? notification.end : "None"
          })
        );

        createAdminNotification({ body : notification})
          .then(
            () => {
              getDataFromBackEnd()
              resetFields()
            }
          )
          .catch(async err => {
              if(err?.status === 400 && err.headers.get("Content-Type") === "application/json"){
                  const errorBody = await err.body?.json();
                  error(errorBody?.errors?.map((i: { message: string; }) => i.message).join(", ") || 'Failed to create notification');
              }else{
                  error('Failed to create notification')
              }
              console.warn(err)
          })

      }

      const onModalCancel = () => {
        resetFields()
      }

      function resetFields(){
        setCreateNotificationDisabled(true)
        setModalPriority(defaultModalPriority)
        setModalVisible(false)
        setModalTitle('')
        setModalText('')
        setModalEndType('none')
        setModalRecipients([allUsersAndOrganizations])
      }

      const createNotification = () => {
        setModalVisible(true)
      }

      const defaultModalPriority = 'Default'

      const [modalPriority, setModalPriority] = React.useState(defaultModalPriority)
      const [modalRecipients, setModalRecipients] = React.useState<string[]>([allUsersAndOrganizations])
      const [modalTitle, setModalTitle] = React.useState('')
      const [modalText, setModalText] = React.useState('')
      const [modalStartDate, setModalStartDate] = React.useState(moment().format('YYYY-MM-DD'))
      const [modalStartTime, setModalStartTime] = React.useState(moment().format('HH:mm'))

      const [modalEndType, setModalEndType] = React.useState('none')
      const [modalEndDate, setModalEndDate] = React.useState()
      const [modalEndTime, setModalEndTime] = React.useState()

      const [timeZone, setTimeZone] = React.useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);

      const onModalPriorityChange = (value: string) => {
        setModalPriority(value)
      }

      const onModalTitleChange = (e: any) => {
        setModalTitle(e.target.value)
      }

      const onModalTextChange = (e: any) => {
        setModalText(e.target.value)
      }

      const onModalStartDateChange = (value: any) => {
        setModalStartDate(value == null ? null : value.format('YYYY-MM-DD'))
      }

      const onModalStartTimeChange = (value: any) => {
        setModalStartTime(value == null ? null : value.format('HH:mm'))
      }

      const onModalEndTypeChange = (value: string) => {
        setModalEndType(value)
      }

      const onModalEndDateChange = (value: any) => {
        setModalEndDate(value.format('YYYY-MM-DD'))
      }

      const onModalEndTimeChange = (value: any) => {
        setModalEndTime(value.format('HH:mm'))
      }

      React.useEffect(() => {
        setCreateNotificationDisabled(
          (modalRecipients.length == 0)
          || (modalStartTime == null)
          || (modalStartDate == null)
          || (modalTitle.trim().length === 0)
        )
      }, [ modalRecipients, modalStartTime, modalStartDate, modalTitle ] );

      const onModalRecipientsChange = (value: any) => {

        if(value.length == 0){
          value = [allUsersAndOrganizations]
        }
        else if((value.filter((x:string) => { return x == allUsersAndOrganizations }).length == 1)
                && (value.length > 1)){
          value = value.filter((x:string) => { return x != allUsersAndOrganizations })
        }

        setModalRecipients(value)
      }

      return <span>
        <div>
          <SpanButton>
            <Tooltip
              placement='topLeft'
              title={addNotificationDisabled ? `There is a limit of ${maxNotifications} notifications. Delete some in order to create more.` : ''}>
              <NotificationButton onClick={createNotification} disabled={addNotificationDisabled} type='primary'><PlusOutlined /> Create Notification</NotificationButton>
            </Tooltip>
          </SpanButton>
          <Modal
            destroyOnClose={true}
            title={<div><BellOutlined /> New notification</div>}
            visible={modalVisible}
            maskClosable={false}
            onOk={onModalOK}
            onCancel={onModalCancel}
            width={600}
            footer={[
              <NotificationButton key="back" btnType="link" onClick={onModalCancel} style={{ marginRight: '10px' }}>
                Cancel
              </NotificationButton>,
              <NotificationButton key="submit" type="primary" disabled={createNotificationDisabled} onClick={onModalOK}>
                Create notification
              </NotificationButton>,
            ]}
          >
          <div>
          <Form
            layout="vertical"
          >
          <Form.Item label='Priority' name="priority">
            <Select
              defaultValue={defaultModalPriority}
              options={[
                {value: "Critical", label: <span><Dot priority={1}/>&nbsp;&nbsp;Critical</span>},
                {value: "Default", label: <span><Dot priority={2}/>&nbsp;&nbsp;Default</span>}
              ]}
              onSelect={onModalPriorityChange}
              style={{width: '100%'}}
            />
          </Form.Item>

          <Form.Item
            label='Recipients'
            valuePropName="option"
            name="recipients"
            tooltip={{ title: 'Choose the users, organizations or roles who will receive the message', icon: <InfoCircleOutlined/> }}
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              value={modalRecipients}
              defaultValue={allUsersAndOrganizations}
              placeholder="Select users, organizations or roles"
              onChange={onModalRecipientsChange}
              filterOption = {(input, option) =>
                !!( option && option.props.children && option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0 )
              }
            >
              {recipientItems}
            </Select>
          </Form.Item>

          <Form.Item
            label='Notification title'
            name="notificationTitle"
          >
            <Input placeholder="Enter a title here" maxLength={100} onChange={onModalTitleChange}/>
          </Form.Item>

          <Form.Item
            label='Main text'
            name="mainText"
          >
            <TextArea placeholder="Enter message text here." maxLength={1000} rows={3} autoSize={{ minRows: 2, maxRows: 6 }} onChange={onModalTextChange} />
          </Form.Item>

          <GridModal>
          <DivModal1>
          <Form.Item
            label='Timezone'
            name="timezone"
          >
            <TimezoneDropdown
              renderOnNewLine={false}
              timeZone={timeZone}
              setTimeZone={setTimeZone}
            />
          </Form.Item>
          </DivModal1>
          <DivModal2>
          <Form.Item
            label='Start'
            name="startDate"
          >
            {/* @ts-ignore */}
            <DatePicker onChange={onModalStartDateChange} defaultValue={moment()} />
          </Form.Item>
          </DivModal2>
          <DivModal3>
          <Form.Item
            label={<span style={{fontWeight:"normal"}}></span>}
            name="startTime"
          >
            {/* @ts-ignore */}
            <TimePicker onChange={onModalStartTimeChange} defaultValue={moment()} minuteStep={15} format={'hh:mm a'} use12Hours style={{ width: 110 }}/>
          </Form.Item>
          </DivModal3>
          <DivModal4>

          <Form.Item
            label='End'
            name="end"
          >
          <Select onChange={onModalEndTypeChange} defaultValue="none" style={{ width: '100%' }}>
            <Option value="none">No end date</Option>
            <Option value="specific">Specific end date</Option>
          </Select>
          </Form.Item>
          <DatePicker onChange={onModalEndDateChange} disabled={modalEndType==='none'} />
          &nbsp;
          <TimePicker onChange={onModalEndTimeChange} disabled={modalEndType==='none'} minuteStep={15} format={'hh:mm a'} use12Hours style={{ width: 110 }}/>
          </DivModal4>
          </GridModal>

          </Form>

          </div>

        </Modal>
        </div>
        <Grid>
        <div>Type<br/>
        <Select defaultValue="Active" style={{ width: 180 }} onChange={onTypeChange}>
          <Option value="Active">Active notifications</Option>
          <Option value="Expired">Expired</Option>
        </Select>
        </div>
        <div>Priority<br/>
        <Select defaultValue={defaultPriority} style={{ width: 180 }} onChange={onPriorityChange}>
          <Option value="All"><Dot priority={0}/>&nbsp;&nbsp;All</Option>
          <Option value="Critical"><Dot priority={1}/>&nbsp;&nbsp;Critical</Option>
          <Option value="Default"><Dot priority={2}/>&nbsp;&nbsp;Default</Option>
        </Select>
        </div>
        </Grid>
        <br/>
        <Table columns={columns} dataSource={items} onChange={onColumnChange} size="middle"
          pagination={ {current:page, pageSize:pageSize,  total:pagination.count, onChange:onPageChange }} >
        </Table>
      </span>
}

export default AdminNotificationsView
