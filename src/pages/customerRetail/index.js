import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './Filter';
import useGetList from "hooks/useGetList";
import { Button, Image } from 'antd';
import { arrayEmpty, dateFormatOnSubmit, formatTime } from 'utils/dataUtils';
import { GATEWAY, HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';

const ListCustomerRetail = () => {

  const [title] = useState("Khách lẻ");
  const [listSale, setListSale] = useState([])

  useEffect(() => {
    (async () => {
      const [sale] = await Promise.all([
        await RequestUtils.Get('/user/list-sale')
      ])
      setListSale(sale?.data)
    })()
  }, [])

  const CUSTOM_ACTION = [
    {
      title: "Tên khách hàng",
      dataIndex: 'name',
      width: 150
    },
    {
      title: "Avatar",
      ataIndex: 'avatar',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <Image
            width={50}
            style={{borderRadius: 50}}
            src={`${item?.avatar ? `${GATEWAY}${item?.avatar}` : '/img/image_not_found.png'}`}
            alt='image'
          />
        )
      }
    },
    {
      title: "Số điện thoại",
      ataIndex: 'mobile',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.mobile}
          </div>
        )
      }
    },
    {
      title: "Email",
      ataIndex: 'email',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.email || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "Ngày tạo",
      ataIndex: 'createdAt',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {dateFormatOnSubmit(item?.createdAt)}
          </div>
        )
      }
    },
    {
      title: "Ngày sinh",
      ataIndex: 'dateOfBirth',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {formatTime(item?.dateOfBirth)}
          </div>
        )
      }
    },
    {
      title: "Sale",
      ataIndex: 'saleId',
      width: 200,
      ellipsis: true,
      render: (item) => {
        const detailSale = listSale.find(f => f?.id === item?.saleId)
        return (
          <div>
            {detailSale?.fullName || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "Giới tính",
      ataIndex: 'gender',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.gender}
          </div>
        )
      }
    },
    {
      title: "Thao tác",
      width: 120,
      fixed: 'right',
      ellipsis: true,
      render: (record) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <Button color="primary" variant="dashed" onClick={() => onHandleEdit(record)} size='small'>
              Chi tiết
            </Button>
          </div>
        )
      }
    }
  ];

  const onData = useCallback((values) => {
    if (arrayEmpty(values.embedded)) {
      return values;
    }
    return values;
  }, []);

  const beforeSubmitFilter = useCallback((values) => {
    dateFormatOnSubmit(values, ['from', 'to']);
    return values;
  }, []);

  const onCreateLead = () => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/warehouse.edit',
    title: 'Tạo mới kho',
    data: {}
  });

  const onHandleEdit = (record) => {
    let title = 'Thông tin khách hàng';
    let hash = '#draw/cutomerRetail.edit';
    InAppEvent.emit(HASH_MODAL, { hash, title, data: record });
  }

  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <CustomBreadcrumb
        data={[{ title: 'Trang chủ' }, { title: title }]}
      />
      <RestList
        xScroll={1200}
        onData={onData}
        initialFilter={{ limit: 10, page: 1 }}
        filter={<LeadFilter />}
        beforeSubmitFilter={beforeSubmitFilter}
        useGetAllQuery={useGetList}
        hasCreate={false}
        apiPath={'customer/fetch-customer-personal'}
        customClickCreate={onCreateLead}
        columns={CUSTOM_ACTION}
      />
    </div>
  )
}

export default ListCustomerRetail
