import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './LeadFilter';
import useGetList from "hooks/useGetList";
import { Button, Tag } from 'antd';
import { arrayEmpty, dateFormatOnSubmit } from 'utils/dataUtils';
import { getColorStatusLead, getSource, getStatusLead, getStatusService } from 'configs/constant';
import { HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import { cloneDeep } from 'lodash';

const LeadNotTakePage = () => {

  const [title] = useState("Danh sách Lead");

  const onEdit = (item) => {
    let title = 'Tạo lead chăm sóc# ' + item.id;
    let hash = '#draw/leadNotTake.edit';
    let data = cloneDeep(item);
    InAppEvent.emit(HASH_MODAL, { hash, title, data });
  }

  const CUSTOM_ACTION = [
    {
      title: "Create",
      dataIndex: 'staff',
      width: 100
    },
    // {
    //   title: "Hình thức",
    //   ataIndex: 'productId',
    //   width: 200,
    //   ellipsis: true,
    //   render: (item) => {
    //     return (
    //       <div>
    //         <Tag color="orange">{item?.productId || 'N/A'}</Tag>
    //       </div>
    //     )
    //   }
    // },
    {
      title: "Dịch vụ",
      ataIndex: 'serviceId',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
             <Tag color="orange">{getStatusService(item?.serviceId)}</Tag>
          </div>
        )
      }
    },
    {
      title: "Ngày",
      ataIndex: 'inTime',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {dateFormatOnSubmit(item?.inTime)}
          </div>
        )
      }
    },
    {
      title: "Nguồn",
      ataIndex: 'source',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {getSource(item?.source)}
          </div>
        )
      }
    },
    {
      title: "Khách hàng",
      ataIndex: 'customerName',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.customerName}
          </div>
        )
      }
    },
    {
      title: "Số đ/t",
      ataIndex: 'customerMobile',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.customerMobile}
          </div>
        )
      }
    },
    {
      title: "Trạng thái",
      ataIndex: 'status',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            <Tag color={getColorStatusLead(item?.status)}>{getStatusLead(item?.status)}</Tag>
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
        return (
          <div>
            {item?.saleId || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "Thao tác",
      width: 100,
      fixed: 'right',
      render: (record) => (
        <Button color="danger" variant="dashed" onClick={() => onEdit(record)} size='small'>
          Tạo lead
        </Button>
      )
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

  const onCreateLead = () => {

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
        initialFilter={{ limit: 10, page: 1, phone: '', source: '', status: '', userId: '', from: '', to: '',}}
        filter={<LeadFilter />}
        beforeSubmitFilter={beforeSubmitFilter}
        useGetAllQuery={useGetList}
        hasCreate={false}
        apiPath={'data/not-taken-care'}
        customClickCreate={onCreateLead}
        columns={CUSTOM_ACTION}
      />
    </div>
  )
}

export default LeadNotTakePage
