import React from 'react';
import { Navigate } from 'react-router-dom';
import FuseUtils from 'utils/FuseUtils';

import { LoginConfig } from './AuthConfig';
import { HomeConfig } from './HomeConfig';
import { ProductConfig } from './ProductConfig';
import { LeadConfig } from './LeadConfig';
import { LeadNotTakeConfig } from './LeadNotTakeConfig'
import { LeadTookCareConfig } from './LeadTookCareConfig';
import { CohoiConfig } from './CohoiConfig';
import { ListKhoConfig } from './KhoConfig';
import { ListInstockConfig } from './TrongkhoConfig';
import { ListWareHouseConfig } from './ListKhoConfig';
import { ListCustomerRetailConfig } from './CustomerRetailConfig';
import { WareHouseConfig } from './WareHouseConfig';
import { ListAcountConfig } from './ListAcountConnfig';
import { ListAcountGroupConfig } from './ListUserGroupConfig';
import { CohoiNotTakeConfig } from './CohoiNotTakeConfig';
import { DuyetTienConfig } from './DuyetTienConfig';
import { ListUserSystemConfig } from './ListUserSysTemConfig';
import { NewfeedConfig } from './NewFeedConfig';
import { CohoiTakeConfig } from './CohoiTakeConfig';
import { CardOrderConfig } from './CardOrderConfig';
import { CongnoConfig } from './ConnoConfig';
import { OrderTakeConfig } from './OrderTakeCareConfig';
import { DragDropConfig } from './DragDropOrderConfig';
import { OrderConfig } from './OrderConfig';

const routeConfigs = [
    LoginConfig,
    ProductConfig,
    HomeConfig,
    LeadConfig,
    LeadNotTakeConfig,
    LeadTookCareConfig,
    CohoiConfig,
    ListKhoConfig,
    ListInstockConfig,
    ListWareHouseConfig,
    ListCustomerRetailConfig,
    WareHouseConfig,
    ListAcountConfig,
    ListAcountGroupConfig,
    CohoiNotTakeConfig,
    DuyetTienConfig,
    ListUserSystemConfig,
    NewfeedConfig,
    CohoiTakeConfig,
    CardOrderConfig,
    OrderConfig,
    OrderTakeConfig,
    CongnoConfig,
    DragDropConfig
];

const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
    { element: () => <Navigate to="/error-404"/> }
];

export default routes;
