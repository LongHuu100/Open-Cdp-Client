import { Row, Col } from 'antd';
import FormInput from 'components/form/FormInput';
import FormSelect from 'components/form/FormSelect';
import { SOURCE, STATUS_LEAD } from 'configs/constant';

const resourceData = [
  { id: SOURCE.FACEBOOK, name: 'Facebook' },
  { id: SOURCE.ZALO, name: 'Zalo' },
  { id: SOURCE.HOTLINE, name: 'Hotline' },
  { id: SOURCE.DIRECT, name: 'Direct' },
  { id: SOURCE.EMAIL, name: 'Email' },
  { id: SOURCE.MKT0D, name: 'MKT0D' },
  { id: SOURCE.GIOITHIEU, name: 'Giới thiệu' },
  { id: SOURCE.CSKH, name: 'CSKH' },
  { id: SOURCE.WHATSAPP, name: 'WhatsApp' },
  { id: SOURCE.PARTNER, name: 'PartNer' },
  { id: SOURCE.SHOPEE, name: 'SHOPEE' },
  { id: SOURCE.TIKTOK, name: 'Tiktok' },
]

const statusData = [
  { id: STATUS_LEAD.CREATE_DATA, name: 'Tạo dữ liệu' },
  { id: STATUS_LEAD.DO_NOT_MANUFACTORY, name: 'Không sản xuất' },
  { id: STATUS_LEAD.IS_CONTACT, name: 'Đang liên lạc' },
  { id: STATUS_LEAD.CONTACT_LATER, name: 'Liên hệ sau' },
  { id: STATUS_LEAD.KO_LIEN_HE_DUOC, name: 'Không liên hệ được' },
  { id: STATUS_LEAD.THANH_CO_HOI, name: 'Thành cơ hội' },
]

const LeadFilter = () => {
  return (
    <>
      <Row gutter={16}>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormInput
            name={'customerMobile'}
            placeholder="Số điện thoại"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormInput
            name={'customerEmail'}
            placeholder="Email"
          />
        </Col>
        {/* <Col xl={6} lg={6} md={6} xs={24}>
          <FormSelect
            name="source"
            label="Nguồn"
            placeholder="Chọn Nguồn"
            resourceData={resourceData || []}
            valueProp="id"
            titleProp="name"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormSelect
            name="status"
            label="Trạng thái"
            valueProp="id"
            titleProp='name'
            resourceData={statusData || []}
            placeholder='Lọc theo trạng thái'
          />
        </Col> */}

        {/* <Col xl={6} lg={6} md={6} xs={24}>
          <FormDatePicker
            format='YYYY-MM-DD'
            name='from'
            placeholder="Start date filter"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormDatePicker
            format='YYYY-MM-DD'
            name='to'
            placeholder="End date filter"
          />
        </Col> */}
      </Row>
    </>
  );
}

export default LeadFilter;