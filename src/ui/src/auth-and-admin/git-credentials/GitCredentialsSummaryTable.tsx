import * as React from "react";
import styled from 'styled-components';
import { themeHelper } from '../../styled/themeUtils';

const CredentialsTable  = styled.table`
  width: 100%;
`

const RowContainer = styled.div`
  border: 1px solid #ced3d7;
  background-color: #f8f9fb;
  border-radius: ${themeHelper('borderRadius.standard')};
  margin-bottom:20px;
  padding:10px;
`

const ButtonContainer = styled.td`
  padding-left:10px;
`

const TitleCellRow = styled.tr`
  width:100%;
  height:24px;
`

const TitleCell = styled.td`
  width:100%;
  font-size:16px;
  line-height:19px;
`

const CredentialsInfoTable = styled.table`
  width: 100%;
  color: #818181;
`

const CredentialsInfoRow = styled.tr`
  margin:4px 0px;
  font-size: 12px;
`

const CredentialsInfoCell = styled.td`
  width:50%;
`

const spLabelProvider = {
  'github': 'GitHub',
  'githubEnterprise': 'GitHub Enterprise (on prem)',
  'bitbucket': 'Bitbucket',
  'gitlab': 'GitLab Cloud',
  'gitlabEnterprise': 'GitLab Enterprise',
  'bitbucketServer': 'Bitbucket Server',
  'unknown': 'Other'
}


const GitCredentialRow = ({
  domain,
  id,
  schemaType,
  protocol,
  name,
  gitServiceProvider,
  onDelete,
  user
}: any) => (
  <RowContainer className={'row-container'}>
  <TitleCellRow className={'title-cell-row'}>
    <TitleCell>{name}</TitleCell>
  </TitleCellRow>
  <tr>
    <CredentialsInfoTable className={'credentials-info-table'}>
      {(gitServiceProvider || schemaType) && (
        <CredentialsInfoRow className={'credentials-info-table-top-row'}>
          {gitServiceProvider && (<CredentialsInfoCell>
            <strong>GIT SERVICE:</strong> {spLabelProvider[gitServiceProvider]}
          </CredentialsInfoCell>)}
          {schemaType && (<CredentialsInfoCell>
            <strong>TYPE:</strong>  {schemaType}
          </CredentialsInfoCell>)}
        </CredentialsInfoRow>
      )}
      {(domain || protocol) && (
        <CredentialsInfoRow className={'credentials-info-table-bottom-row'}>
          {domain && <CredentialsInfoCell>
            <strong>DOMAIN:</strong> {domain}
          </CredentialsInfoCell>}
          {/*Temporarily disbaled. Requires API work*/}
          {/*{login && <td>*/}
          {/*  <strong>LOGIN:</strong> {login}*/}
          {/*</td>}*/}
          {protocol && <CredentialsInfoCell>
            <strong>PROTOCOL:</strong> {protocol}
          </CredentialsInfoCell>}
        </CredentialsInfoRow>
      )}
    </CredentialsInfoTable>
    <ButtonContainer className={'credentials-info-table-delete-button-container'}>
        <button className="btn btn-danger btn-sm" onClick={()=> {
          onDelete(user.id, id)
        }
        }>Delete</button>
    </ButtonContainer>
  </tr>
  </RowContainer>
)

const GitCredentialsSummaryTable = ({
  onDelete,
  credentials,
   ...props
}: any) => (
  <CredentialsTable>
    <tbody>
      {
        credentials.map((dataItem: any, index: number) => (
          <GitCredentialRow
            key={index}
            onDelete={onDelete}
            {...dataItem}
            {...props}
          />
        ))
      }
    </tbody>
  </CredentialsTable>
);

export default GitCredentialsSummaryTable;
