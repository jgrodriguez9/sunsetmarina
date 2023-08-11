import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Alert, Button, Col, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import {
  ERROR_SERVER,
  FIELD_NUMERIC,
  FIELD_REQUIRED,
  SAVE_SUCCESS,
  SELECT_OPTION,
  UPDATE_SUCCESS,
} from "../../../constants/messages";
import ButtonsDisabled from "../../Common/ButtonsDisabled";
import SimpleDate from "../../DatePicker/SimpleDate";
import { useDispatch } from "react-redux";
import { addMessage } from "../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import moment from "moment";
import Select from "react-select";
import { getBoatByClient } from "../../../helpers/marina/boat";
import { getSlipList } from "../../../helpers/marina/slip";
import {
  getSlipReservationPriceAndValid,
  saveReservation,
  updateReservation,
} from "../../../helpers/marina/slipReservation";
import { numberFormat } from "../../../utils/numberFormat";
import ContentLoader from "../../Loader/ContentLoader";
import getObjectValid from "../../../utils/getObjectValid";
import { statusSlipReservation } from "../../../data/statusSlipReservation";

export default function FormSlipReservationClient({
  item,
  setOpenModalAdd,
  setRefetch,
}) {
  const dispatch = useDispatch();
  const [arrivalDate, setArrivalDate] = useState(
    item?.arrivalDate ? moment(item?.arrivalDate, "YYYY-MM-DD").toDate() : null
  );
  const [departureDate, setDepartureDate] = useState(
    item?.departureDate
      ? moment(item?.departureDate, "YYYY-MM-DD").toDate()
      : null
  );
  const [showControlPrice, setShowControlPrice] = useState(false);
  const [checkValidationSlip, setCheckValidationSlip] = useState({
    loading: false,
    isValid: false,
    checked: false,
  });

  const [boatOpt, setBoatOpt] = useState([]);
  const [slipOpt, setSlipOpt] = useState([]);

  const fetchBoatApi = async () => {
    try {
      const response = await getBoatByClient(item.customer.id);
      setBoatOpt(
        response.list
          .filter((it) => it.status === "AVAILABLE")
          .map((boat) => ({ label: boat.name, value: boat.id }))
      );
    } catch (error) {
      setBoatOpt([]);
    }
  };
  const fetchSlips = async () => {
    try {
      const response = await getSlipList();
      setSlipOpt(
        response
          .filter((it) => it.status === "AVAILABLE")
          .map((slip) => ({ label: slip.code, value: slip.id }))
      );
    } catch (error) {
      setSlipOpt([]);
    }
  };

  useEffect(() => {
    fetchBoatApi();
    fetchSlips();
  }, []);

  const formik = useFormik({
    initialValues: {
      id: item?.id ?? "",
      price: item?.price ?? 0,
      observations: item?.observations ?? "",
      customer: item?.customer ?? { id: "" },
      boat: item?.boat ?? { id: "" },
      slip: item?.slip ?? { id: "" },
      arrivalDate: item?.arrivalDate ?? "",
      departureDate: item?.departureDate ?? "",
      status: item?.status ?? "PENDING",
    },
    validationSchema: Yup.object({
      boat: Yup.object({
        id: Yup.number().required(FIELD_REQUIRED),
      }),
      slip: Yup.object({
        id: Yup.number().required(FIELD_REQUIRED),
      }),
      price: Yup.number().typeError(FIELD_NUMERIC).required(FIELD_REQUIRED),
    }),
    onSubmit: async (values) => {
      //validaciones antes de enviarlo
      const data = {};
      Object.entries(getObjectValid(values)).forEach((entry) => {
        const [key, value] = entry;
        if (key === "arrivalDate") {
          data[key] = moment(values.arrivalDate).format("YYYY-MM-DD");
        } else if (key === "departureDate") {
          data[key] = moment(values.arrivalDate).format("YYYY-MM-DD");
        } else {
          data[key] = value;
        }
      });

      if (values.id) {
        //update
        try {
          let response = await updateReservation(values.id, data);
          if (response) {
            dispatch(
              addMessage({
                type: "success",
                message: UPDATE_SUCCESS,
              })
            );
            setOpenModalAdd(false);
            setRefetch(true);
          } else {
            dispatch(
              addMessage({
                type: "error",
                message: ERROR_SERVER,
              })
            );
          }
        } catch (error) {
          let message = ERROR_SERVER;
          message = extractMeaningfulMessage(error, message);
          dispatch(
            addMessage({
              type: "error",
              message: message,
            })
          );
        }
      } else {
        //save
        try {
          let response = await saveReservation(data);
          if (response) {
            dispatch(
              addMessage({
                type: "success",
                message: SAVE_SUCCESS,
              })
            );
            setOpenModalAdd(false);
            setRefetch(true);
          } else {
            dispatch(
              addMessage({
                type: "error",
                message: ERROR_SERVER,
              })
            );
          }
        } catch (error) {
          let message = ERROR_SERVER;
          message = extractMeaningfulMessage(error, message);
          dispatch(
            addMessage({
              type: "error",
              message: message,
            })
          );
        }
      }
    },
  });

  //checamos precio y si es valid el slip
  useEffect(() => {
    if (formik.values.boat.id && formik.values.slip.id) {
      const fecthPriceAndValid = async () => {
        setCheckValidationSlip((prev) => ({
          ...prev,
          loading: true,
          checked: false,
          isValid: false,
        }));
        try {
          const query = `${formik.values.slip.id}&${formik.values.boat.id}`;
          const response = await getSlipReservationPriceAndValid(query);
          setCheckValidationSlip((prev) => ({
            ...prev,
            loading: false,
            isValid: response.valid,
            checked: true,
          }));
          formik.setFieldValue("price", response.price);
        } catch (error) {
          let message = ERROR_SERVER;
          message = extractMeaningfulMessage(error, message);
          dispatch(
            addMessage({
              type: "error",
              message: message,
            })
          );
          setCheckValidationSlip((prev) => ({
            ...prev,
            loading: false,
            isValid: false,
            checked: true,
          }));
        }
      };
      fecthPriceAndValid();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.boat.id, formik.values.slip.id, dispatch]);

  const onOpen = (selectedDates, dateStr, instance) => {
    instance.set("minDate", formik.values.arrivalDate);
    if (formik.values.status === "CONFIRMED") {
      instance.set("minDate", moment().format("DD-MM-YYYY"));
    }
  };
  return (
    <div className="needs-validation position-relative">
      {checkValidationSlip.loading && (
        <ContentLoader text="Checando validez del slip" />
      )}
      {checkValidationSlip.checked && !checkValidationSlip.isValid && (
        <Row>
          <Col>
            <Alert color="danger">El slip no es válido</Alert>
          </Col>
        </Row>
      )}
      {checkValidationSlip.checked && checkValidationSlip.isValid && (
        <Row>
          <Col>
            <Alert color="success">El slip es válido</Alert>
          </Col>
        </Row>
      )}
      <Row>
        <Col xs="12" md="4">
          <div className="mb-3">
            <Label htmlFor="boatType" className="mb-0">
              Embarcación
            </Label>
            {formik.values.status === "CONFIRMED" ? (
              <div className="form-control bg-light">
                {formik.values.boat.name}
              </div>
            ) : (
              <Select
                value={
                  formik.values.boat?.id
                    ? {
                        value: formik.values.boat.id,
                        label: formik.values.boat.name,
                      }
                    : null
                }
                onChange={(value) => {
                  formik.setFieldValue("boat.id", value?.value ?? "");
                  formik.setFieldValue("boat.name", value?.label ?? "");
                }}
                options={boatOpt}
                classNamePrefix="select2-selection"
                placeholder={SELECT_OPTION}
              />
            )}

            {formik.errors.boat?.id && (
              <div className="invalid-tooltip d-block">
                {formik.errors.boat.id}
              </div>
            )}
          </div>
        </Col>
        <Col xs="12" md="4">
          <div className="mb-3">
            <Label htmlFor="boatType" className="mb-0">
              Slip
            </Label>
            {formik.values.status === "CONFIRMED" ? (
              <div className="form-control bg-light">
                {formik.values.slip.code}
              </div>
            ) : (
              <Select
                value={
                  formik.values.slip?.id
                    ? {
                        value: formik.values.slip.id,
                        label: formik.values.slip.code,
                      }
                    : null
                }
                onChange={(value) => {
                  formik.setFieldValue("slip.id", value?.value ?? "");
                  formik.setFieldValue("slip.code", value?.label ?? "");
                }}
                options={slipOpt}
                classNamePrefix="select2-selection"
                placeholder={SELECT_OPTION}
              />
            )}
            {formik.errors.documentType && (
              <div className="invalid-tooltip d-block">
                {formik.errors.documentType}
              </div>
            )}
          </div>
        </Col>
        <Col xs="12" md="4">
          <div className="mb-3">
            <Label htmlFor="price" className="mb-0">
              Precio diario
            </Label>
            {showControlPrice ? (
              <Input
                id="price"
                name="price"
                className={`form-control ${
                  formik.errors.price ? "is-invalid" : ""
                }`}
                onChange={formik.handleChange}
                value={formik.values.price}
              />
            ) : (
              <div className="form-control bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <div>{numberFormat(formik.values?.price ?? 0)}</div>
                  <div>
                    <i
                      className="fas fa-edit text-info"
                      onClick={() => setShowControlPrice(true)}
                    />
                  </div>
                </div>
              </div>
            )}
            {formik.errors.price && (
              <div className="invalid-tooltip d-block">
                {formik.errors.price}
              </div>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs="12" md="4">
          <div className="mb-3">
            <Label htmlFor="price" className="mb-0">
              Fecha inicio
            </Label>
            {formik.values.status === "CONFIRMED" ? (
              <div className="form-control bg-light">
                {moment(arrivalDate).format("DD-MM-YYYY")}
              </div>
            ) : (
              <SimpleDate
                date={arrivalDate}
                setDate={(value) => {
                  setArrivalDate(value[0]);
                  if (value.length > 0) {
                    formik.setFieldValue(`arrivalDate`, value[0]);
                  } else {
                    formik.setFieldValue(`arrivalDate`, null);
                  }
                }}
                placeholder="dd-MM-YYYY"
              />
            )}
          </div>
        </Col>
        <Col xs="12" md="4">
          <div className="mb-3">
            <Label htmlFor="price" className="mb-0">
              Fecha terminación
            </Label>
            <SimpleDate
              date={departureDate}
              setDate={(value) => {
                setDepartureDate(value[0]);
                if (value.length > 0) {
                  formik.setFieldValue(`departureDate`, value[0]);
                } else {
                  formik.setFieldValue(`departureDate`, null);
                }
              }}
              placeholder="dd-MM-YYYY"
              onOpen={onOpen}
            />
          </div>
        </Col>
        <Col xs="12" md="4">
          <Label className="mb-0 d-block">Estado</Label>
          {formik.values.status === "CONFIRMED" ? (
            <div className="form-control bg-light">Confirmada</div>
          ) : (
            <Select
              value={
                formik.values.status
                  ? {
                      value: formik.values.status,
                      label: statusSlipReservation.find(
                        (it) => it.value === formik.values.status
                      ).label,
                    }
                  : null
              }
              onChange={(value) => {
                formik.setFieldValue("status", value?.value ?? "");
              }}
              options={statusSlipReservation}
              classNamePrefix="select2-selection"
              placeholder={SELECT_OPTION}
            />
          )}
        </Col>
      </Row>
      <Row>
        <Col xs="12" md="8">
          <Label htmlFor="observations" className="mb-0">
            Observación
          </Label>
          <textarea
            id="observations"
            name="observations"
            className={`form-control ${
              formik.errors.observations ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.observations}
            rows={5}
          />
        </Col>
      </Row>
      <hr />
      {formik.isSubmitting ? (
        <ButtonsDisabled
          buttons={[
            { text: "Aceptar", color: "primary", className: "", loader: true },
          ]}
        />
      ) : (
        <Button
          color="primary"
          disabled={!checkValidationSlip.isValid}
          type="button"
          className="me-2"
          onClick={
            checkValidationSlip.isValid ? () => formik.handleSubmit() : () => {}
          }
        >
          {formik.values.id ? "Actualizar" : "Aceptar"}
        </Button>
      )}
    </div>
  );
}
