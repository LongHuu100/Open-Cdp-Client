import React, { useEffect, useState } from 'react';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { PhoneOutlined, MailOutlined, UserAddOutlined, FacebookOutlined, AimOutlined, FundOutlined } from '@ant-design/icons';
import ProductForm from './ProductForm';
import RequestUtils from 'utils/RequestUtils';
import { InAppEvent } from 'utils/FuseUtils';
import { HASH_MODAL_CLOSE } from 'configs';
import { f5List } from 'utils/dataUtils';

const log = (value) => console.log('[container.product.index] ', value);
const TakeNotLead = ({ closeModal, title, data }) => {
    const [record, setRecord] = useState({});

    const onSubmit = async (dataCreate) => {
        const params = {
            orderCode: data?.code,
            note: dataCreate?.note,
            type: dataCreate.type,
            cause: dataCreate?.cause
        }
        const newData = await RequestUtils.Post('/customer-order/take-care-cohoi', params);
        if (newData?.errorCode === 200) {
            f5List('customer-order/fetch-cohoi-not-care');
            InAppEvent.normalSuccess("Cập nhật thành công");
            InAppEvent.emit(HASH_MODAL_CLOSE);
        }
    }
    return <>
        <RestEditModal
            isMergeRecordOnSubmit={false}
            updateRecord={(values) => setRecord(curvals => ({ ...curvals, ...values }))}
            onSubmit={onSubmit}
            record={record}
            closeModal={closeModal}
        >
            <ProductForm />
        </RestEditModal>
    </>
}

export default TakeNotLead;