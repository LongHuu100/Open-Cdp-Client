import theme from 'theme';
import mapKeys from 'lodash/mapKeys';
import keyBy from 'lodash/keyBy';
import {
  AudioOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileWordOutlined,
  FileZipOutlined,
  KeyOutlined,
  ManOutlined,
  VideoCameraOutlined,
  WomanOutlined
} from '@ant-design/icons';

export const ACTIVE_TYPES = [
  {
    value: '2',
    text: 'isActive.inactive',
    color: 'red',
    textColor: theme.color.error
  },
  {
    value: '1',
    text: 'isActive.active',
    color: 'green',
    textColor: theme.color.success
  }
];

export const IMAGE_TYPES = ['png', 'jpg', 'jpeg', 'gif', 'tif', 'tiff'];

export const CHANNEL_SOURCE = [
  { 'id': 11, 'name': 'Web' },
  { 'id': 1, 'name': 'Facebook' },
  { 'id': 2, 'name': 'Zalo' },
  { 'id': 3, 'name': 'Hotline' },
  { 'id': 4, 'name': 'Trực tiếp' },
  { 'id': 5, 'name': 'Email' },
  { 'id': 6, 'name': 'MKT0D' },
  { 'id': 7, 'name': 'Giới thiệu' },
  { 'id': 8, 'name': 'Cskh' },
  { 'id': 9, 'name': 'Partner' },
  { 'id': 10, 'name': 'Shopee' }
];
export const CHANNEL_SOURCE_MAP_KEYS = mapKeys(CHANNEL_SOURCE, 'id');

export const CHANNEL_STATUS = [
  { 'id': 1, 'name': 'Chưa liên hệ' },
  { 'id': 2, 'name': 'Đã liên hệ' }
];
export const CHANNEL_STATUS_MAP_KEYS = mapKeys(CHANNEL_STATUS, 'id');

export const DISCOUNT_UNIT_CONST = [
  { text: 'Tiền mặt', value: 'money'},
  { text: 'Phần trăm', value: 'percent'}
]
export const DISCOUNT_MAP_KEYS = mapKeys(DISCOUNT_UNIT_CONST, 'value');

export const PAYMENT_TYPE_CONST = [
  { label: 'Tiền mặt', value: 6 }, 
  { label: 'Chuyển khoản MBbank', value: 1 },
	{ label: 'Chuyển khoản TPbank', value: 7 }, 
  { label: 'COD Viettel', value: 2 },
	{ label: 'Ví Momo', value: 3 }, 
  { label: 'Ví Vnpay', value: 4 },
	{ label: 'Ncc thu hộ', value: 5 }
];

export const GENDERS = [
  {
    value: 'male',
    text: 'gender.male',
    IconCPN: ManOutlined,
    color: theme.color.blue,
  },
  {
    value: 'female',
    text: 'gender.female',
    IconCPN: WomanOutlined,
    color: theme.color.red,
  },
  {
    value: 'other',
    text: 'gender.other',
    IconCPN: KeyOutlined,
    color: theme.color.violet,
  }
];
export const GENDERS_MAPS_KEY = keyBy(GENDERS, 'value');

export const CUSTOMERS_TYPE_TAGS = [
  { text: 'Khách mới', value: 'newCustomer', color: 'red' },
  { text: 'Visitor', value: 'visitor', color: 'purple' },
  { text: 'Member', value: 'member', color: 'green' },
  { text: 'Company', value: 'company', color: 'orange' }
];
export const CUSTOMERS_TYPE_TAGS_MAP_KEYS = mapKeys(
  CUSTOMERS_TYPE_TAGS,
  'value',
);

export const PRODUCT_STATUS = [
  { value: 0, text: 'Ngưng', color: 'red' },
  { value: 1, text: 'Kích hoạt', color: 'green' }
];

export const FILE_TYPES = [
  { value: 'pdf', IconCPN: FilePdfOutlined, color: theme.color.red },
  { value: 'ppt', IconCPN: FilePptOutlined, color: theme.color.pink },
  { value: 'pptx', IconCPN: FilePptOutlined, color: theme.color.pink },
  { value: 'doc', IconCPN: FileWordOutlined, color: theme.color.blue },
  { value: 'docx', IconCPN: FileWordOutlined, color: theme.color.blue },
  { value: 'xlsx', IconCPN: FileExcelOutlined, color: theme.color.green },
  { value: 'xls', IconCPN: FileExcelOutlined, color: theme.color.green },
  { value: 'csv', IconCPN: FileExcelOutlined, color: theme.color.green },
  { value: 'zip', IconCPN: FileZipOutlined, color: theme.color.violet },
  { value: 'zar', IconCPN: FileZipOutlined, color: theme.color.violet },
  { value: 'txt', IconCPN: FileTextOutlined, color: 'currentColor' },
  { value: 'mov', IconCPN: VideoCameraOutlined, color: 'currentColor' },
  { value: 'mp4', IconCPN: VideoCameraOutlined, color: 'currentColor' },
  { value: 'avi', IconCPN: VideoCameraOutlined, color: 'currentColor' },
  { value: 'flv', IconCPN: VideoCameraOutlined, color: 'currentColor' },
  { value: 'wmv', IconCPN: VideoCameraOutlined, color: 'currentColor' },
  { value: 'mp3', IconCPN: AudioOutlined, color: theme.color.lightGreen },
];
