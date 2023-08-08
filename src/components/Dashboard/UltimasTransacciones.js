import { useState, useEffect } from "react";
import { useMemo } from "react";
import { Badge, Button, Card, CardBody } from "reactstrap";
import { lastTransaction } from "../../data/testData";
import { classBadge } from "../../utils/classBadge";
import SimpleTable from "../Tables/SimpleTable";
import moment from "moment";
import { numberFormat } from "../../utils/numberFormat";
import { getFormaPago } from "../../utils/getFormaPago";
import { getTipoPago } from "../../utils/getTipoPago";
import { getPaymentListPaginado } from "../../helpers/marina/payment";
import { ERROR_SERVER } from "../../constants/messages";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import TableLoader from "../Loader/TablaLoader";

export default function UltimasTransacciones() {
  const [items, setItems] = useState(lastTransaction);
  const [loading, setLoading] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: "Código",
        accessor: "code",
        style: {
          width: "15%",
        },
      },
      {
        Header: "Referencia",
        accessor: "reference",
        style: {
          width: "25%",
        },
      },
      {
        Header: "Fecha",
        accessor: "dateCreated",
        style: {
          width: "15%",
        },
        Cell: ({ value }) => moment(value, "YYYY-MM-DD").format("DD-MM-YYYY"),
      },
      {
        Header: "Monto",
        accessor: "amount",
        style: {
          width: "10%",
        },
        Cell: ({ value }) => numberFormat(value),
      },
      {
        Header: "Forma de pago",
        accessor: "paymentForm",
        style: {
          width: "10%",
        },
        Cell: ({ value }) => getFormaPago(value),
      },
      {
        Header: "Tipo de pago",
        accessor: "systemPayment",
        style: {
          width: "15%",
        },
        Cell: ({ value }) => getTipoPago(value),
      },
      {
        Header: "Estado",
        accessor: "status",
        style: {
          width: "10%",
        },
        Cell: ({ value }) => {
          if (value === "PENDING") {
            return <Badge color="warning">Pendiente</Badge>;
          } else if (value === "APPROVED") {
            return <Badge color="success">Aprovado</Badge>;
          } else {
            return <Badge color="danger">Cancelado</Badge>;
          }
        },
      },
    ],
    []
  );

  useEffect(() => {
    const fecthApiPaymentForClient = async () => {
      try {
        let q = `?page=1&max=10`;
        const response = await getPaymentListPaginado(q);
        setItems(response.list);
        setLoading(false);
      } catch (error) {
        let message = ERROR_SERVER;
        message = extractMeaningfulMessage(error, message);
        setItems([]);
        setLoading(false);
      }
    };
    setLoading(true);
    fecthApiPaymentForClient();
  }, []);

  return (
    <>
      {/* <EcommerceOrdersModal isOpen={modal1} toggle={toggleViewModal} /> */}
      <Card>
        <CardBody>
          <div className="mb-4 h4 card-title">Ultimas 10 Transacciones</div>
          {loading ? (
            <TableLoader
              columns={[
                { name: "Código", width: "15%" },
                { name: "Referencia", width: "25%" },
                { name: "Fecha", with: "15%" },
                { name: "Monto", width: "10%" },
                { name: "Forma de pago", width: "10%" },
                { name: "Tipo de pago", width: "15%" },
                { name: "Estado", width: "10%" },
              ]}
            />
          ) : (
            <SimpleTable columns={columns} data={items} />
          )}
        </CardBody>
      </Card>
    </>
  );
}
