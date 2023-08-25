import * as React from 'react';
import * as R from 'ramda';
import StyledHeading from '../components/styled/elements/FormHeader';
import styled from 'styled-components';
import FlexLayout from '../components/Layouts/FlexLayout';
import InfoTooltipIcon from '../icons/InfoTooltipIcon';
import { FormSelect } from './BaseImageSelector';
import { Option, OptionProp } from '../components/Select/Select';
import { httpRequest } from '@domino/api/dist/httpRequest';
import { Spin } from 'antd';
import { themeHelper } from '../styled';
import { selectFormFieldWidth } from './CreateEnvironment';
import { CreateEnvironmentFormSection } from './styled/CreateEnvironmentFormSection';
import { CreateEnvironmentInputRow } from './styled/CreateEnvironmentInputRow';
import { StyledInput } from './BaseImageSelector';

enum EnvironmentVisibility  {
  PRIVATE= 'Private',
  ORGANIZATION = 'Organization',
  GLOBAL = 'Global',
}

export type UserForEnvironment = {
  id: string;
  userName: string;
};

export type Collaborator = {
  id: string;
  username: string;
};

export interface EnvironmentSharingFieldsProps {
  canTransferOwnership: boolean;
  canCreateGlobalEnvironment: boolean;
  visibility: string;
  selected: boolean[];
  usersForEnvironment: UserForEnvironment[];
  isUsersForEnvironmentEmpty: boolean;
  ownerOrViewerId: string;
  ownerOrViewerUserName: string;
}

export interface EnvironmentSharingFieldsStateProps {
  isPrivate?: boolean;
  organization?: boolean;
  global?: boolean;
  selectedOrganization: string;
  options: OptionProp[];
  selectedCollaborator: string;
  fetching: boolean;
}

const DisplayDiv = styled.div<{ display: boolean }>`
  display: ${props => props.display ? 'block' : 'none'};
`;

const StyledLabel = styled(FlexLayout)`
  margin-bottom: ${themeHelper('margins.tiny')};
  margin-right: 0;
`;

const StyledDiv = styled.div`
  margin-right: 0;
  flex-basis: 95%;
`;

const getStyledLabel = (title: string, label: string) => {
  return (
    <StyledLabel justifyContent="flex-start" itemSpacing={16}>
      {label}
      <InfoTooltipIcon title={title} />
    </StyledLabel>
  );
};

class EnvironmentSharingFields extends
  React.Component<EnvironmentSharingFieldsProps, EnvironmentSharingFieldsStateProps> {
  constructor(props: EnvironmentSharingFieldsProps) {
    super(props);
    const defaultOrg = R.find((x: any[]) => x[1], R.zip(props.usersForEnvironment, props.selected));
    this.state = {
      isPrivate: this.checkedIf(EnvironmentVisibility.PRIVATE),
      organization: this.checkedIf(EnvironmentVisibility.ORGANIZATION),
      global: this.checkedIf(EnvironmentVisibility.GLOBAL),
      selectedOrganization: defaultOrg ? (defaultOrg[0] as UserForEnvironment).id :
        !R.isEmpty(this.getOrganizationOptions(props.usersForEnvironment)) ?
          this.getOrganizationOptions(props.usersForEnvironment)[0].value : '',
      options: [{value: props.ownerOrViewerId, label: props.ownerOrViewerUserName}],
      selectedCollaborator: props.ownerOrViewerId,
      fetching: false
    };
  }

  checkedIf = (expected: string) => {
    return this.props.visibility === expected ? true : undefined;
  }

  onChange = (e: any) => {
    const { value } = e.target;
    this.setState({
      isPrivate: value === EnvironmentVisibility.PRIVATE,
      organization: value === EnvironmentVisibility.ORGANIZATION,
      global: value === EnvironmentVisibility.GLOBAL,
    });
  }

  getOrganizationOptions = (usersForEnvironment: UserForEnvironment[]) => {
    const sortedUsersForEnvironment =
      R.sort((a, b) => { return a.userName.localeCompare(b.userName); }, usersForEnvironment);
    return R.map(x => { return { label: x.userName, value: x.id }; }, sortedUsersForEnvironment);
  }

  onOrganizationSelect = (value: string) => {
    this.setState({
      selectedOrganization: value
    });
  }

  /**
   *  value of options is  with `${collaborator.username} ${collaborator.id}`
   *  because it is used to search in Select.
   *  Note search in antd Select searches on value instead of label.
   */
  getCollaboratorOptions = (collaborators: Collaborator[]) => {
    return R.map(collaborator => ({
      label: collaborator.username, value: `${collaborator.username} ${collaborator.id}`}), collaborators);
  }

  getCollaborators =  async(query: string) => {
    const headers = {
      accept: '*/*',
      'Content-Type': 'application/json'
    };
    return await httpRequest('GET',
      '/searchForCollaborators',
      undefined,
      { query: query },
      headers,
      null,
      true,
    );
  }

  handleCollaboratorChange = (value: string) => {
    this.setState({selectedCollaborator: value});
  }

  handleCollaboratorSearch = async (value: string) => {
    this.setState({options: [], fetching: true});
    const data = await this.getCollaborators(value);
    this.setState({options: this.getCollaboratorOptions(data), fetching: false});
  }

  render() {
    const {
      canCreateGlobalEnvironment,
      canTransferOwnership,
      isUsersForEnvironmentEmpty,
      usersForEnvironment,
    } = this.props;

    const organizationField = (
      <FormSelect
        name="organizationOwnerId"
        disabled={!this.state.organization}
        options={this.getOrganizationOptions(usersForEnvironment)}
        onSelect={this.onOrganizationSelect}
        defaultValue={this.state.selectedOrganization}
        value={this.state.selectedOrganization}
        inputValue={this.state.selectedOrganization}
        style={{width: selectFormFieldWidth}}
      />
    );

    return (
      <CreateEnvironmentFormSection className="form-group">
        <StyledHeading>Visibility</StyledHeading>
        <StyledDiv>
          <CreateEnvironmentInputRow>
            <StyledInput
              type="radio"
              name="visibility"
              id="environment-sharing-private"
              value="Private"
              checked={this.state.isPrivate}
              onClick={this.onChange}
            />
            <StyledDiv>
              {getStyledLabel('Available only to one user', 'Private')}
              <DisplayDiv display={this.state.isPrivate || false}>
                {canTransferOwnership &&
                  <FormSelect
                    value={this.state.selectedCollaborator}
                    inputValue={R.split(' ', this.state.selectedCollaborator)[1]}
                    name="userOwnerId"
                    showSearch={true}
                    id="userOwnerId"
                    disabled={!this.state.isPrivate}
                    onSearch={this.handleCollaboratorSearch}
                    onChange={this.handleCollaboratorChange}
                    notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                    style={{width: selectFormFieldWidth}}
                    placeholder="Username"
                  >
                    {this.state.options.map( d => <Option key={d.value} value={d.value}>{d.label}</Option>)}
                  </FormSelect>
                }
              </DisplayDiv>
            </StyledDiv>
          </CreateEnvironmentInputRow>
        </StyledDiv>
        {!isUsersForEnvironmentEmpty &&
          <CreateEnvironmentInputRow>
            <StyledInput
              type="radio"
              name="visibility"
              id="environment-sharing-org"
              value="Organization"
              checked={this.state.organization}
              onClick={this.onChange}
            />
            <StyledDiv>
              {getStyledLabel(
                'Available to projects owned by the organization',
                'Available to an Organization')
              }
              <DisplayDiv display={this.state.organization || false}>
                {organizationField}
              </DisplayDiv>
            </StyledDiv>
          </CreateEnvironmentInputRow>
        }
        {canCreateGlobalEnvironment &&
          <CreateEnvironmentInputRow>
            <StyledInput
              type="radio"
              name="visibility"
              id="environment-sharing-global"
              value="Global"
              checked={this.state.global}
              onClick={this.onChange}
            />
            <StyledDiv>
              {getStyledLabel('Available to all projects', 'Globally Accessible')}
            </StyledDiv>
          </CreateEnvironmentInputRow>
        }
      </CreateEnvironmentFormSection>
    );
  }
}

export default EnvironmentSharingFields;
