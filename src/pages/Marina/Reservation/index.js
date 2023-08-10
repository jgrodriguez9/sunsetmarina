import { useEffect } from "react";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumbs";
import CardBasic from "../../../components/Common/CardBasic";
import CardMain from "../../../components/Common/CardMain";
import DeleteDialog from "../../../components/Common/DeleteDialog";
import FormFilter from "../../../components/Common/FormFilter";
import TableLoader from "../../../components/Loader/TablaLoader";
import CellActions from "../../../components/Tables/CellActions";
import Paginate from "../../../components/Tables/Paginate";
import SimpleTable from "../../../components/Tables/SimpleTable";
import { DELETE_SUCCESS, ERROR_SERVER } from "../../../constants/messages";
import { addMessage } from "../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import { deleteBoat, getBoatList } from "../../../helpers/marina/boat";
import moment from "moment";
import { getReservationListPaginado } from "../../../helpers/marina/slipReservation";
import { numberFormat } from "../../../utils/numberFormat";
import { getClientList } from "../../../helpers/marina/client";
import { getSlipList } from "../../../helpers/marina/slip";

function Reservation() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(10);
  const history = useHistory();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [selectedIdDelete, setSelectedIdDeleted] = useState(null);
  const [query, setQuery] = useState({
    max: totalRegistros,
    page: 1,
  });
  const [filters, setFilters] = useState([
    {
      label: "Código",
      field: "code",
      width: 3,
      control: "input",
      type: "text",
      value: "",
    },
    {
      label: "Cliente",
      field: "customerId",
      width: 3,
      control: "select",
      type: "",
      value: "",
      valueSelect: null,
      options: [],
    },
    {
      label: "Embarcación",
      field: "boatId",
      width: 3,
      control: "select",
      type: "",
      value: "",
      valueSelect: null,
      options: [],
    },
    {
      label: "Slip",
      field: "slipId",
      width: 3,
      control: "select",
      type: "",
      value: "",
      valueSelect: null,
      options: [],
    },
  ]);

  //datos para llenar los filtros de esta pantalla
  useEffect(() => {
    //clientes
    const fetchClients = async () => {
      try {
        const response = await getClientList();
        const copyFilters = [...filters];
        copyFilters[1].options = response.map((c) => ({
          label: `${c.name} ${c.lastName}`,
          value: c.id,
        }));
        setFilters(copyFilters);
      } catch (error) {}
    };
    fetchClients();

    //embarcacion
    const fetchBoats = async () => {
      try {
        const response = await getBoatList();
        const copyFilters = [...filters];
        copyFilters[2].options = response.map((boat) => ({
          label: boat.name,
          value: boat.id,
        }));
        setFilters(copyFilters);
      } catch (error) {}
    };
    fetchBoats();

    //slips
    const fetchSlips = async () => {
      try {
        const response = await getSlipList();
        const copyFilters = [...filters];
        copyFilters[3].options = response.map((slip) => ({
          label: slip.code,
          value: slip.id,
        }));
        setFilters(copyFilters);
      } catch (error) {}
    };
    fetchSlips();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    let q = Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join("&");
    try {
      const response = await getReservationListPaginado(`?${q}`);
      setItems(response.list);
      setTotalPaginas(response.pagination.totalPages);
      setTotalRegistros(response.pagination.totalCount);
      setLoading(false);
    } catch (error) {
      let message = ERROR_SERVER;
      message = extractMeaningfulMessage(error, message);
      dispatch(
        addMessage({
          message: message,
          type: "error",
        })
      );
      setItems([]);
      setTotalPaginas(0);
      setTotalRegistros(10);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [JSON.stringify(query)]);

  const editAction = (row) => {
    history.push(`/reservation/edit/${row.original.id}`);
  };

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
        Header: "Slip",
        accessor: "slip.code",
        style: {
          width: "10%",
        },
      },
      {
        Header: "Precio diario",
        accessor: "price",
        style: {
          width: "10%",
        },
        Cell: ({ value }) => numberFormat(value),
      },
      {
        Header: "Cliente",
        accessor: "customer.name",
        style: {
          width: "20%",
        },
        Cell: ({ row, value }) => `${value} ${row.original.customer.lastName}`,
      },
      {
        Header: "Embarcación",
        accessor: "boat.name",
        style: {
          width: "15%",
        },
      },
      {
        Header: "Fecha llegada",
        accessor: "arrivalDate",
        style: {
          width: "10%",
        },
        Cell: ({ row, value }) =>
          moment(value, "YYYY-MM-DD").format("DD-MM-YYYY"),
      },
      {
        Header: "Fecha salida",
        accessor: "departureDate",
        style: {
          width: "10%",
        },
        Cell: ({ row, value }) =>
          moment(value, "YYYY-MM-DD").format("DD-MM-YYYY"),
      },
      {
        id: "acciones",
        Header: "Acciones",
        Cell: ({ row }) => (
          <>
            <CellActions
              edit={{ allow: true, action: editAction }}
              del={{ allow: true, action: handleShowDialogDelete }}
              row={row}
            />
          </>
        ),
        style: {
          width: "10%",
        },
      },
    ],
    []
  );

  const handleShowDialogDelete = (row) => {
    setShowDeleteDialog(true);
    setSelectedIdDeleted(row.original.id);
  };

  const handlePageClick = (page) => {
    setQuery((prev) => ({
      ...prev,
      page: page,
    }));
  };

  const handleChangeLimit = (limit) => {
    setQuery((prev) => ({
      ...prev,
      max: limit,
      page: 1,
    }));
  };

  const fireSearch = (filts) => {
    const activeFilters = filts
      .filter((fl) => fl.value)
      .map((field) => ({ name: field.field, value: field.value }));
    const obj = activeFilters.reduce((accumulator, value) => {
      return { ...accumulator, [value.name]: value.value };
    }, {});

    setQuery((prev) => ({
      max: prev.max,
      page: 1,
      ...obj,
    }));
  };

  const goPageCreate = () => {
    history.push("/reservation/create");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBoat(selectedIdDelete);
      fetchList();
      setDeleting(false);
      setShowDeleteDialog(false);
      dispatch(
        addMessage({
          message: DELETE_SUCCESS,
          type: "success",
        })
      );
    } catch (error) {
      let message = ERROR_SERVER;
      message = extractMeaningfulMessage(error, message);
      dispatch(
        addMessage({
          message: message,
          type: "error",
        })
      );
      setDeleting(false);
    }
  };

  const cardHandleList = loading ? (
    <Row>
      <Col xs="12" xl="12">
        <TableLoader
          columns={[
            { name: "Código", width: "15%" },
            { name: "Slip", width: "10%" },
            { name: "Precio diario", width: "10%" },
            { name: "Cliente", width: "20%" },
            { name: "Embarcación", width: "15%" },
            { name: "Fecha llegada", width: "10%" },
            { name: "Fecha salida", width: "10%" },
            { name: "Acciones", width: "10%" },
          ]}
        />
      </Col>
    </Row>
  ) : (
    <Row>
      <Col xl="12">
        <SimpleTable columns={columns} data={items} />
      </Col>
      {items.length > 0 && (
        <Paginate
          page={query.page}
          totalPaginas={totalPaginas}
          totalRegistros={totalRegistros}
          handlePageClick={handlePageClick}
          limit={query.limite}
          handleChangeLimit={handleChangeLimit}
        />
      )}
    </Row>
  );

  const handleFilter = (
    <Row>
      <Col>
        <FormFilter
          filters={filters}
          setFilters={setFilters}
          fireSearch={fireSearch}
        />
      </Col>
    </Row>
  );

  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={"Reservas"}
            breadcrumbItem={"Reservas"}
            add={{
              allow: true,
              text: "Crear Nueva",
              goPageCreate: goPageCreate,
            }}
          />

          <Row>
            <Col xs="12" lg="12">
              <CardBasic title="Filtros" children={handleFilter} />
            </Col>
          </Row>
          <Row className="pb-5">
            <Col lg="12">
              <CardMain title="Listado" children={cardHandleList} />
            </Col>
          </Row>
        </Container>
      </div>
      <DeleteDialog
        handleDelete={handleDelete}
        show={showDeleteDialog}
        setShow={setShowDeleteDialog}
        isDeleting={isDeleting}
      />
    </>
  );
}

export default withRouter(Reservation);
