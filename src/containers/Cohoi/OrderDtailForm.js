import { useCallback, useEffect, useState } from "react";
import { Form, Row, Col, Table, InputNumber, Input, Image, Select } from "antd";
import { PhoneOutlined, MailOutlined, UserAddOutlined, FacebookOutlined, AimOutlined, SearchOutlined } from '@ant-design/icons';
import FormInputNumber from "components/form/FormInputNumber";
import FormSelect from "components/form/FormSelect";
import { DISCOUNT_UNIT_CONST } from "configs/localData";
import { useGetAllProductQuery } from "hooks/useData";
import { arrayEmpty, arrayNotEmpty, formatMoney, f5List } from "utils/dataUtils";
import CustomButton from 'components/CustomButton';
import FormTextArea from "components/form/FormTextArea";
import { ShowPriceStyles } from "../Order/styles";
import { calPriceOff, formatterInputNumber, parserInputNumber } from "utils/tools";
import { debounce } from "lodash";
import FormAutoCompleteInfinite from "components/form/AutoCompleteInfinite/FormAutoCompleteInfinite";
import RequestUtils from "utils/RequestUtils";
import { InAppEvent } from "utils/FuseUtils";
import { GATEWAY, HASH_MODAL_CLOSE } from "configs";
import { ContainerSerchSp, ModaleCreateCohoiStyle } from "containers/Lead/styles";

/* Hàm này check nếu số lượng có trong khoảng giá sp thì lấy giá đó ngược lại lấy giá nhập  */
export const handleDistancePrice = (skuId, detailSp, quantity, priceText, discountValue, discountUnit, text) => {
  if (detailSp?.skus) {
    for (const item of detailSp?.skus) {
      if (arrayNotEmpty(item?.listPriceRange)) {
        for (const element of item?.listPriceRange) {
          if (quantity) {
            if (quantity >= element?.quantityFrom && quantity <= element?.quantityTo) {
              const total = text === 'yes' ? element?.price * quantity : element?.price;
              const pOff = calPriceOff({ discountValue, discountUnit, total });
              const totalAFD = text === 'yes' ? total - pOff : total;
              return formatMoney(skuId ? (totalAFD > 0 ? totalAFD : element?.price) : element?.price);
            } else {
              return priceText;
            }
          }
        }
      } else {
        return priceText;
      }
    }
  } else {
    return priceText;
  }
}

const newSp = (data) => {
  const newData = data.map((item, i) => {
    const newItem = item?.items?.map((subItem) => ({
      ...subItem,
      code: item.code,
      key: i,
    }));
    return newItem;
  });
  return newData.flat();
};

const thStyle = {
  padding: "8px 12px",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #ddd",
};

const OrderDtailForm = ({ data }) => {

  const [ detailSp, setDetailSp ] = useState([])
  const [ priceSp, setPriceSp ] = useState(null);
  const [ form ] = Form.useForm();
  const [ FormQuanlity ] = Form.useForm();
  const [ customer, setCustomer ] = useState({});
  const [ isOpen, setIsOpen ] = useState(false);
  const [ listSp, setListSp ] = useState(data?.details || []);
  const [ recordetail ] = useState({});
  const [ textSearch, setTextSearch ] = useState('');
  const [ listProduct, setListProduct ] = useState([]);
  const [ filterSp, setFilterSp ] = useState([]);
  const [ productDetails, setProductDetails ] = useState([]);

  let totalPrice = newSp(listSp).reduce((sum, item) => sum + item?.price, 0);
  let totalQuanlity = newSp(listSp)?.reduce((sum, item) => sum + item?.quantity, 0);
  let total = newSp(listSp)?.reduce((sum, item) => {
    const discount = JSON.parse(item?.discount);
    const totalAmount = item?.total || 0;
    const discountValue = discount?.discountUnit === "percent"
      ? (totalAmount * discount?.discountValue) / 100
      : discount?.discountValue;
    let itemTotal = item?.price * item?.quantity - discountValue;
    return sum + itemTotal;
  }, 0);

  useEffect(() => {
    const productIds = data?.details
      ?.flatMap((detail) => detail.items?.map((item) => item.productId) || [])
      .filter(Boolean);
    (async () => {
      if (!Array.isArray(productIds) || productIds.length === 0) return;
      try {
        const productDetails = await RequestUtils.Get(`/product/find-list-id?ids=${productIds.join(",")}`);
        setProductDetails(Array.isArray(productDetails?.data) ? productDetails.data : []);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    })();
  }, [data]);

  useEffect(() => {
    (async () => {
      const customer = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobilePhone}&withOrder=withOrder`);
      setCustomer(customer?.data);
    })()
  }, [data])

  useEffect(() => {
    if (recordetail) {
      FormQuanlity.setFieldsValue({ quantity: recordetail?.quantity })
    }
  }, [recordetail, FormQuanlity])

  /* bắt đơn giá theo sản phẩm */
  useEffect(() => {
    (() => {
      if (detailSp?.skus) {
        const { quantity } = form.getFieldsValue();
        let price = "";
        for (const item of detailSp?.skus) {
          if (arrayNotEmpty(item?.listPriceRange)) {
            for (const element of item?.listPriceRange) {
              if (quantity >= element?.quantityFrom && quantity <= element?.quantityTo) {
                price = priceSp;
                break;
              }
            }
          }
        }
        if (price) {
          form.setFieldsValue({ price: price })
        }
      }
    })()
    // eslint-disable-next-line
  }, [priceSp])

  useEffect(() => {
    (async () => {
      const { data } = await RequestUtils.Get(`/product/fetch`);
      setListProduct(data?.embedded);
    })()
  }, [])

  const onHandleDeleteSp = (record) => {
    const newItem = listSp?.map(item => {
      const items = item?.items?.filter(f => f?.id !== record?.id);
      return {
        ...item,
        items: items
      }
    })
    setListSp(newItem)
  }

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        const product = productDetails.find((p) => p.id === record.productId);
        return product?.name || "N/A";
      },
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'code',
      key: 'code',
      render: (_, record) => {
        const product = productDetails.find((p) => p.id === record.productId);
        return product?.code || "N/A";
      },
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (_, record) => {
        const product = productDetails.find((p) => p.id === record.productId);
        return (
          <Image
            width={70}
            src={`${product?.image ? `${GATEWAY}${product?.image}` : '/img/image_not_found.png'}`}
            alt='image'
          />
        )
      },
    },
    {
      title: 'Đơn vi tính',
      dataIndex: 'unit',
      key: 'unit',
      render: (_, record) => {
        const product = productDetails.find((p) => p.id === record.productId);
        return product?.unit || "N/A";
      },
    },
    Table.EXPAND_COLUMN,
    {
      title: 'Thông tin sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đơn giá',
      render: (item) => {
        return (
          <div>
            {formatMoney(item?.price)}
          </div>
        )
      }
    },
    {
      title: 'Chiết khấu',
      render: (item) => {
        // try {
        const discount = JSON.parse(item?.discount)

        return (
          <div>
            <InputNumber
              min={0}
              style={{ width: 80 }}
              formatter={formatterInputNumber}
              parser={parserInputNumber}
              value={discount?.discountValue} // Hiển thị đúng giá trị hiện tại
              onChange={(value) => {
                const newData = listSp?.map(f => ({
                  ...f,
                  items: f?.items?.map(v =>
                    v?.id === item.id ? {
                      ...v, discount: JSON.stringify(
                        {
                          discountUnit: discount?.discountUnit,
                          discountValue: value
                        }
                      )
                    } : v
                  )
                }));
                setListSp(newData);
              }}
            />
          </div>
        )
      }
    },
    {
      title: 'Loại chiết khấu',
      render: (item) => {
        const discount = JSON.parse(item?.discount)
        return (
          <div>
            <Select
              value={discount?.discountUnit}
              onChange={(value) => {
                const newData = listSp?.map(f => ({
                  ...f,
                  items: f?.items?.map(v =>
                    v?.id === item.id ? {
                      ...v, discount: JSON.stringify(
                        {
                          discountUnit: value,
                          discountValue: discount?.discountValue
                        }
                      )
                    } : v
                  )
                }));
                setListSp(newData);
              }}
            >
              {DISCOUNT_UNIT_CONST?.map((f, id) => (
                <Select.Option key={id} value={f?.value}>{f?.text}</Select.Option>
              ))}
            </Select>
          </div>
        );
      }
    },
    {
      title: 'Số lượng',
      render: (item) => (
        <InputNumber
          min={1}
          value={item?.quantity}
          onChange={(value) => {
            const newData = listSp?.map(f => ({
              ...f,
              items: f?.items?.map(v =>
                v?.id === item.id ? { ...v, quantity: value } : v
              )
            }));
            setListSp(newData);
          }}
        />
      )
    },
    {
      title: 'Tổng tiền',
      render: (item) => {
        const discount = JSON.parse(item?.discount);
        const totalAmount = item?.price * item?.quantity || 0;
        const discountValue = discount?.discountUnit === "percent"
          ? (totalAmount * discount?.discountValue) / 100
          : discount?.discountValue;

        let total = item?.price * item?.quantity - discountValue;

        return (
          <div>
            {formatMoney(total)}
          </div>
        );
      }
    },
    {
      title: 'Hành động',
      dataIndex: '',
      key: 'x',
      render: (record) => (
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/#" onClick={() => onHandleDeleteSp(record)}>
            Xoá sản phẩm
          </a>
        </div>
      ),
    },
  ];

  const onHandleCreateOdder = async (value) => {
    if (arrayEmpty(newSp(listSp))) {
      return InAppEvent.normalInfo("Vui lòng thêm sản phẩm");
    }
    const newDetails = (data?.details || []).map((detail) => {
      const matchingItems = listSp
        .filter(sp => sp.code === detail.code)
        .flatMap(sp => sp.items || []);
      const items = matchingItems.length > 0
        ? matchingItems
        : listSp.flatMap(sp => sp.items || []);

      return {

        productName: detail?.productName || detail?.name || "N/A",
        id: detail?.id || null,
        items: items.map(item => ({
          id: item?.id,
          skuInfo: item?.skuInfo,
          skuId: item?.skuId,
          productId: item?.productId || null,
          name: item?.productName || item?.name || null,
          quantity: item?.quantity,
          price: item?.price,
          discount: item.discount
        }))
      };
    });
    if (!data?.details?.length && listSp.length) {
      newDetails.push({
        productName: listSp[0]?.productName || "N/A",
        id: null,
        items: listSp.flatMap(sp => sp.items || []).map(item => ({
          id: item?.id,
          skuInfo: item?.skuInfo,
          skuId: item?.skuId,
          productId: item?.productId || null,
          productName: item?.productName || item?.name || null,
          quantity: item?.quantity,
          price: item?.price,
          discount: JSON.stringify({ discountValue: item?.discountValue, discountUnit: item?.discountUnit })
        }))
      });
    }
    const params = {
      vat: 0,
      id: data?.id,
      dataId: data?.id,
      paymentInfo: {
        amount: value?.monneyPrice,
        method: value?.optionPrice,
        status: value?.monneyPrice && value?.optionPrice ? true : false,
        content: value?.noteMonney
      },
      customer: {
        saleId: customer?.iCustomer?.saleId,
        gender: customer?.iCustomer?.gender,
        name: customer?.iCustomer?.name,
        email: customer?.iCustomer?.email,
        mobile: customer?.iCustomer?.mobile,
        createdAt: customer?.iCustomer?.createdAt,
        updatedAt: customer?.iCustomer?.updatedAt,
      },
      details: newDetails,
      note: value?.note,
      address: value?.value
    };
    const datas = await RequestUtils.Post('/customer-order/update-cohoi', params);
    if (datas?.errorCode === 200) {
      InAppEvent.emit(HASH_MODAL_CLOSE);
      f5List('customer-order/fetch-cohoi');
      InAppEvent.normalSuccess("Cập nhật cơ hội thành công");
    } else {
      InAppEvent.normalError("Tạo cơ hội thất bại");
    }
  };

  const onHandleCreateSp = (value) => {
    const skuDetails = detailSp?.skus?.map(sku => sku?.skuDetail).flat();
    const newItems = {
      id: value?.id,
      skuId: value.skuId,
      skuInfo: JSON.stringify(skuDetails),
      productId: detailSp?.id,
      orderDetailId: null,
      name: value.name,
      quantity: value.quantity || 1,
      price: value.price || 0,
      discount: JSON.stringify({
        discountUnit: value.discountUnit || null,
        discountValue: value.discountValue || 0
      }),
      discountValue: value.discountValue || 0,
      discountUnit: value.discountUnit || null,
      total: value.quantity * value.price,
      warehouses: value?.warehouses
    };

    setListSp((prev = []) => {
      const targetCode = data?.details?.[0]?.code || "NEW-DEFAULT";
      const targetDetailIndex = prev.findIndex(sp => sp.code === targetCode);

      if (targetDetailIndex === -1) {
        return [{
          id: null,
          code: targetCode,
          name: null,
          price: null,
          priceOff: 0,
          customerOrderId: null,
          total: value.quantity * value.price,
          productName: data?.details?.[0]?.productName || value.productName || "N/A",
          productId: null,
          customerNote: null,
          dayDuote: null,
          discount: null,
          skuId: null,
          skuInfo: null,
          items: [newItems]
        }];
      }
      const updatedList = [...prev];
      updatedList[targetDetailIndex] = {
        ...updatedList[targetDetailIndex],
        items: [...(updatedList[targetDetailIndex].items || []), newItems],
        total: (updatedList[targetDetailIndex].total || 0) + newItems.total
      };

      return updatedList;
    });

    InAppEvent.normalSuccess("Thêm sản phẩm thành công");
    form.resetFields();
    setFilterSp([]);
    setTextSearch('');
    setIsOpen(false);
  };


  const onHandleSearchSp = useCallback(() => {
    debounce((value) => {
      if (value) {
        const newFilterSp = listProduct.filter(item =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilterSp(newFilterSp);
      } else {
        setFilterSp([]);
      }
    }, 200)
  }, [listProduct]);

  const handleChange = (e) => {
    setTextSearch(e.target.value)
    onHandleSearchSp(e.target.value);
  };

  return <>
    <div style={{ marginTop: 15 }}>
      <Form onFinish={onHandleCreateOdder} layout="vertical" >
        <p><strong>Thông tin khách hàng</strong></p>
        <div className="group-inan" style={{ background: '#f4f4f4', borderTop: '1px dashed red' }}></div>
        <Row style={{ marginTop: 20 }}>
          <Col md={6} xs={6}>
            <p>
              <span style={{ marginRight: 10 }}><UserAddOutlined /></span>
              <span>User: {customer?.iCustomer?.name}</span>
            </p>
          </Col>
          <Col md={6} xs={6}>
            <p>
              <span style={{ marginRight: 10 }}><PhoneOutlined /></span>
              <span>Số điện thoại: {customer?.iCustomer?.mobile}</span>
            </p>
          </Col>
          <Col md={6} xs={6}>
            <p>
              <span style={{ marginRight: 10 }}><MailOutlined /></span>
              <span>Email: {customer?.iCustomer?.email}</span>
            </p>
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }}>
          <Col md={6} xs={6}>
            <p>
              <span style={{ marginRight: 10 }}><FacebookOutlined /></span>
              <span>Facebook: {customer?.iCustomer?.facebookId || 'N/A'}</span>
            </p>
          </Col>
          <Col md={6} xs={6}>
            <p>
              <span style={{ marginRight: 10 }}><AimOutlined /></span>
              <span>Tỉnh T/P: {customer?.iCustomer?.address || 'Chưa cập nhật'}</span>
            </p>
          </Col>
        </Row>
        <div style={{ height: 15 }}></div>
        <p>
          <strong>Thông tin sản phẩm</strong>
        </p>
        <div className="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>
        {/* <Button
          type="dashed"
          style={{ float: 'right', marginBottom: 20 }}
          icon={<PlusOutlined />}
          onClick={() => setIsOpen(true)}
        >
          Thêm sản phẩm
        </Button> */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div>
            <Input
              style={{ width: '30%', float: 'right', marginBottom: 20 }}
              prefix={<SearchOutlined />}
              value={textSearch}
              placeholder="Thêm sản phẩm vào đơn"
              onChange={handleChange}
            />
          </div>

          {filterSp.length > 0 && (
            <ContainerSerchSp>
              {filterSp.map((item) => {
                const totalQuantity = item?.warehouses.reduce((total, v) => total + v.quantity, 0);
                return (
                  <div key={item.id} className='wrap-search-sp'>
                    {/* Hàng chính của sản phẩm */}
                    <div
                      className='btn_hover_sp'
                      style={{ display: 'flex', alignItems: 'center', width: '100%' }}
                      onClick={() => {
                        setFilterSp(filterSp.map(f =>
                          f.id === item.id ? { ...f, showSkus: !f.showSkus } : f
                        ));
                        onHandleCreateSp({ ...item, skuId: item?.skus[0]?.id, skuName: item?.name, price: item.skus[0]?.listPriceRange[0]?.price, stock: item?.skus[0]?.stock })
                      }}
                    >
                      {/* Cột hình ảnh sản phẩm */}
                      <div className='btn_wrap-sp'>
                        <Image
                          src={item.image ? `${GATEWAY}${item.image}` : '/img/image_not_found.png'}
                          alt={item.name}
                          style={{ width: 50, height: 50, marginRight: 15, objectFit: 'cover', borderRadius: 5 }}
                        />
                      </div>

                      {/* Cột thông tin sản phẩm */}
                      <div style={{ width: '55%', paddingTop: 10, paddingLeft: 10 }}>
                        <strong>{item.name}</strong>
                      </div>

                      {/* Cột giá bán và số lượng tồn */}
                      <div style={{ width: '30%', paddingTop: 10, textAlign: 'right' }}>
                        <p style={{ marginBottom: 5, fontSize: 14, fontWeight: 'bold', color: '#d9534f' }}>
                          {formatMoney(item.skus[0]?.listPriceRange[0]?.price || 0)}
                        </p>
                        <p style={{ marginBottom: 0, fontSize: 12, color: '#5bc0de' }}>
                          Tồn kho: {totalQuantity|| 0}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}

            </ContainerSerchSp>
          )}
        </div>

        <Table
          columns={columns}
          scroll={{ x: 1700 }}
          expandable={{
            expandedRowRender: (record) => {
              const newTonkho = listProduct.flatMap(f => f.warehouses || []).find(v => v.skuId === record?.skuId);
              return (
                <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                  {record ? (
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        background: "#fff",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#f0f0f0", textAlign: "left" }}>
                          <th style={thStyle}>Tên SKU</th>
                          <th style={thStyle}>Giá bán</th>
                          <th style={thStyle}>Tồn kho</th>
                          <th style={thStyle}>Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td style={tdStyle}>{record.name}</td>
                          <td style={tdStyle}>
                            {formatMoney(record?.price)}
                          </td>
                          <td style={tdStyle}>
                            {newTonkho?.quantity}
                          </td>
                          <td style={tdStyle}>
                            {(() => {
                              let parsedSkuInfo = [];
                              try {
                                if (record?.skuInfo) {
                                  parsedSkuInfo = JSON.parse(record?.skuInfo);
                                }
                              } catch (error) {
                                console.error("Lỗi parse JSON:", error);
                              }
                              return (
                                <>
                                  <p style={{ marginRight: "10px" }}>
                                    <strong>{parsedSkuInfo[0]?.name}:</strong> {parsedSkuInfo[0]?.value}
                                  </p>
                                  {parsedSkuInfo?.length > 1 && <span> ...</span>}
                                </>
                              )
                            })()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p>Không có SKU nào</p>
                  )}
                </div>
              )
            },
          }}

          dataSource={newSp(listSp)}
          pagination={false}
        />
        <div className="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>
        <Row justify={'end'}>
          <Col md={24} xs={24}>
            <FormTextArea
              rows={3}
              name="note"
              label="Note khách hàng"
              placeholder="Note khách hàng"
            />
          </Col>
          <Col md={24} xs={24}>
            <FormTextArea
              rows={3}
              name="address"
              label="Địa chỉ giao hàng"
              placeholder="Địa chỉ giao hàng"
            />
          </Col>
          <Col md={6} xs={6}>
            <p>
              <strong>Đơn giá tổng: {formatMoney(totalPrice)}</strong>
            </p>
          </Col>
          <Col md={6} xs={6}>
            <p>
              <strong> Số lượng sản phẩm: {totalQuanlity} sản phẩm</strong>
            </p>
          </Col>
        </Row>
        <Row justify={'end'}>
          <Col md={6} xs={6}>
            <p>
              <strong> Tổng tiền: {formatMoney(total)}</strong>
            </p>
          </Col>
          <Col md={6} xs={6}>
            <p>
              <strong>Giá trị chiết khấu </strong>
            </p>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 50 }}>
          <CustomButton title="Cập nhật" htmlType="submit" />
        </div>
      </Form>

      <ModaleCreateCohoiStyle title={
        <div style={{ color: '#fff' }}>
          Tạo sản phẩm
        </div>
      } width={820}
        open={isOpen} footer={false} onCancel={() => setIsOpen(false)}>
        <div style={{ padding: 15 }}>
          <Form form={form} layout="vertical" onFinish={onHandleCreateSp}>
            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col md={12} xs={24}>
                <FormAutoCompleteInfinite
                  useGetAllQuery={useGetAllProductQuery}
                  label="Sản phẩm"
                  filterField="name"
                  name="productName"
                  valueProp="name"
                  searchKey="name"
                  required
                  placeholder="Tìm kiếm Sản phẩm"
                  customGetValueFromEvent={(productName, product) => {
                    // setDetailCohoi({ product, productName });
                    setDetailSp(product);
                    return productName;
                  }}
                />
              </Col>
              <Col md={12} xs={24}>
                <FormSelect
                  name="skuId"
                  label="SKU"
                  required
                  resourceData={detailSp?.skus ?? []}
                  placeholder="Chọn SKU"
                />
              </Col>

              <Col md={12} xs={24} style={{ width: '100%' }}>
                <FormInputNumber
                  required
                  name="quantity"
                  label="Số lượng"
                  min="0"
                  placeholder="Nhập Số lượng"
                />
              </Col>
              <Col md={12} xs={24}>
                <FormInputNumber
                  required
                  name="price"
                  label="Đơn giá"
                  min="0"
                  placeholder="Nhập Đơn giá"
                />
              </Col>

              <Col md={12} xs={24}>
                <FormSelect
                  name="discountUnit"
                  titleProp="text"
                  valueProp="value"
                  resourceData={DISCOUNT_UNIT_CONST}
                  label="Giảm giá nếu có"
                  placeholder="Chọn hình thức giảm"
                />
              </Col>
              <Col md={12} xs={24}>
                <FormInputNumber
                  label="Giảm giá % / VND"
                  min="0"
                  name="discountValue"
                  placeholder="Nhập giá trị"
                />
              </Col>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, curValues) => (
                  prevValues.quantity !== curValues.quantity
                  || prevValues.discountValue !== curValues.discountValue
                  || prevValues.discountUnit !== curValues.discountUnit
                  || prevValues.price !== curValues.price
                )}
              >
                {({ getFieldValue }) => {
                  const { skuId, quantity, discountValue, discountUnit, price } = getFieldValue();
                  const total = quantity * price;
                  const pOff = calPriceOff({ discountValue, discountUnit, total });
                  const totalAFD = total - pOff;
                  const priceText = formatMoney(skuId ? (totalAFD > 0 ? totalAFD : 0) : 0);
                  handleDistancePrice(detailSp, quantity);
                  const newPrice = quantity ? handleDistancePrice(skuId, detailSp, quantity, priceText, discountValue, discountUnit, 'not').replace('VND', '') : '0';
                  setPriceSp(parseFloat(newPrice.replace(/\./g, '').trim()));
                  return (
                    <ShowPriceStyles md={24} xs={24}>
                      <h3 className="lo-order">Thành tiền: {handleDistancePrice(skuId, detailSp, quantity, priceText, discountValue, discountUnit, 'yes')}</h3>
                    </ShowPriceStyles>
                  )
                }}
              </Form.Item>
              <Col md={24} xs={24} style={{ display: 'flex', justifyContent: 'end', marginBottom: 20 }}>
                <CustomButton htmlType="submit" />
              </Col>
            </Row>
          </Form>
        </div>
      </ModaleCreateCohoiStyle>
    </div>
  </>
}

export default OrderDtailForm;