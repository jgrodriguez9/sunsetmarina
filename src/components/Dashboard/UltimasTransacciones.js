import { useState } from "react";
import { useMemo } from "react";
import { Badge, Button, Card, CardBody } from "reactstrap";
import { lastTransaction } from "../../data/testData";
import { classBadge } from "../../utils/classBadge";
import SimpleTable from "../Tables/SimpleTable";

export default function UltimasTransacciones(){
    const [items, setItems] = useState(lastTransaction);

    const columns = useMemo(
        () => [
          {
            Header: 'Slip No.',
            accessor: 'slip', // accessor is the "key" in the data
            Cell: ({row, value}) => (
                <span className="fw-bold">{value}</span>
            )
          },
          {
            Header: 'Nombre',
            accessor: 'nombre',
          },
          {
            Header: 'Fecha',
            accessor: 'fecha',
          },
          {
            Header: 'Total',
            accessor: 'total',
          },
          {
            Header: 'Estado de pago',
            accessor: 'estado_pago',
            Cell: ({row, value}) => (
                <Badge 
                    className={"font-size-12 badge-soft-"+classBadge(value)}
                    color={classBadge(value)}
                    pill
                >{value}</Badge>), 
          },
          {
            id: 'ver_detalla',
            Header: "Ver Detalle",
            Cell: ({row}) => (<Button color="primary" className="btn-rounded" size="sm">Ver Detalle</Button>),          
          }
        ],
        []
    );

    return (
        <>
          {/* <EcommerceOrdersModal isOpen={modal1} toggle={toggleViewModal} /> */}
          <Card>
            <CardBody>
              <div className="mb-4 h4 card-title">Ultimas Transacciones</div>
              <SimpleTable 
                columns={columns}
                data={items} 
              />
              {/* <PaginationProvider
                pagination={paginationFactory(pageOptions)}
                keyField="id"
                columns={EcommerceOrderColumns(toggle)}
                data={orders}
              >
                {({ paginationProps, paginationTableProps }) => (
                  <ToolkitProvider
                    keyField="id"
                    data={orders}
                    columns={EcommerceOrderColumns(toggle)}
                    bootstrap4
                    search
                  >
                    {toolkitProps => (
                      <>
                        <Row>
                          <Col xl="12">
                            <div className="table-responsive">
                              <BootstrapTable
                                keyField="id"
                                responsive
                                bordered={false}
                                striped={false}
                                defaultSorted={defaultSorted}
                                selectRow={selectRow}
                                classes={
                                  "table align-middle table-nowrap table-check"
                                }
                                headerWrapperClasses={"table-light"}
                                {...toolkitProps.baseProps}
                                {...paginationTableProps}
                              />
                            </div>
                          </Col>
                        </Row>
                        <div className="pagination pagination-rounded justify-content-end">
                          <PaginationListStandalone {...paginationProps} />
                        </div>
                      </>
                    )}
                  </ToolkitProvider>
                )}
              </PaginationProvider> */}
            </CardBody>
          </Card>
        </>
      )
}