import { OfflineStoreType, OnlineStoreType } from '../../../../proxied-api/types';
import { DataSourceType } from '../../../../data/data-sources/CommonData';
import SnowflakeLogo from '../../../../icons/SnowflakeLogo';
import RedshiftLogo from '../../../../icons/RedshiftLogo';
import DefaultDataSourceIcon from '../../../../icons/DataSource';
import AmazonS3Logo from '../../../../icons/AmazonS3Logo';
import PalantirLogo from '../../../../icons/PalantirLogo';

export const dataSourceType = (value: string) => {
  switch(value) {
    case DataSourceType.SnowflakeConfig:
      return SnowflakeLogo;
    case DataSourceType.RedshiftConfig:
      return RedshiftLogo;
    case DataSourceType.S3Config:
      return AmazonS3Logo;
    case DataSourceType.PalantirConfig:
      return PalantirLogo;
    default:
      return DefaultDataSourceIcon;
  }
}

export const offlineStoreType = (value: string) => {
  switch(value) {
    case OfflineStoreType.Snowflake:
      return SnowflakeLogo;
    case OfflineStoreType.Redshift:
      return RedshiftLogo;
    default:
      return DefaultDataSourceIcon;
  }
}

export const onlineStoreType = (value: string) => {
  switch(value) {
    case OnlineStoreType.Snowflake:
      return SnowflakeLogo;
    default:
      return DefaultDataSourceIcon;
  }
}
