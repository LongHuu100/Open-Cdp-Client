import { Tag } from "antd";
import { getColorStatusLead, getSource, getStatusLead } from "configs/constant";
import { useEffect, useState } from "react";
import { dateFormatOnSubmit, formatTime } from "utils/dataUtils";
import RequestUtils from "utils/RequestUtils";

export const columnsTake = [
  {
    title: 'Sản phẩm',
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: 'Nguyên nhân',
    dataIndex: 'cause',
    key: 'cause',
  },
  {
    title: 'Thời gian',
    dataIndex: 'inTime',
    key: 'inTime',
    render: (inTime) => {
      return (
        <div>
          {formatTime(inTime)}
        </div>
      )
    }
  },
  {
    title: 'Sale',
    dataIndex: 'sale',
    key: 'sale',
    render: (sale) => {
      return (
        <div>
          {sale}
        </div>
      )
    }
  },
  {
    title: 'User note',
    dataIndex: 'userNote',
    key: 'userNote',
    render: (userNote) => {
      return (
        <div>
          {userNote}
        </div>
      )
    }
  },
];

export const TableColumnInteract = () => {
  const [listSale, setListSale] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await RequestUtils.Get('/user/list-sale');
      if (data) {
        setListSale(data);
      }
    })()
  }, [])

  const columnInteract = [
    {
      title: 'Nguồn',
      dataIndex: 'source',
      key: 'source',
      render: (source) => {
        return (
          <div>
            {getSource(source)}
          </div>
        )
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return (
          <div>
            <Tag color={getColorStatusLead(status)}>{getStatusLead(status)}</Tag>
          </div>
        )
      }
    },
    {
      title: 'Sale',
      dataIndex: 'sale',
      key: 'sale',
      render: (item) => {
        const newSale = listSale.find(v => v?.id === item?.saleId);
        return (
          <div>
            {newSale?.fullName || 'N/A'}
          </div>
        )
      }
    },
    {
      title: 'Thời giạn',
      dataIndex: 'inTime',
      key: 'inTime',
      render: (inTime) => {
        return (
          <div>
            {dateFormatOnSubmit(inTime)}
          </div>
        )
      }
    }
  ];
  return columnInteract;
}

