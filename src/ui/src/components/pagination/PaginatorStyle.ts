const PaginatorStyle = `
  display: inline-flex;
  align-items: center;
  justify-content: center;

  .ant-pagination-total-text {
    flex-grow: 1;
    height: auto;
  }

  .ant-pagination-item-link {
    border: 0;
  }

  .ant-pagination-item {
    color: #333333;
    font-size: 14px;
    text-align: center;
    letter-spacing: 0;
    border-radius: 2px;
    border: 2px solid transparent;
    line-height: 28px;

    &.ant-pagination-item-active {
      background: #FFFFFF;
      border: 2px solid #D8E0EA;
      color: #4473FF;
      font-weight: 500;
    }
  }
`;

export default  PaginatorStyle;
