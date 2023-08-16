import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  DELETE_SUCCESS,
  ERROR_SERVER,
  FIELD_INTEGER,
  FIELD_NUMERIC,
  FIELD_REQUIRED,
  SELECT_OPTION,
} from "../../../constants/messages";
import { deleteBracaletLote } from "../../../helpers/contabilidad/bracalet";
import { addMessage } from "../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import ButtonsDisabled from "../../Common/ButtonsDisabled";
import Select from "react-select";

const colorOpt = [
  { value: "Rojo", label: "Rojo" },
  { value: "Verde", label: "Verde" },
];

const FormBrazaleteDelete = ({ onHandleCloseDialog, setOpen }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      startNumber: "",
      endNumber: "",
      color: "",
    },
    validationSchema: Yup.object({
      startNumber: Yup.number()
        .integer(FIELD_INTEGER)
        .typeError(FIELD_NUMERIC)
        .required(FIELD_REQUIRED),
      endNumber: Yup.number()
        .integer(FIELD_INTEGER)
        .typeError(FIELD_NUMERIC)
        .required(FIELD_REQUIRED),
      color: Yup.string().required(FIELD_REQUIRED),
    }),
    onSubmit: async (values) => {
      //validaciones antes de enviarlo
      try {
        let response = await deleteBracaletLote(values);
        if (response) {
          dispatch(
            addMessage({
              type: "success",
              message: DELETE_SUCCESS,
            })
          );
          onHandleCloseDialog();
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
    },
  });

  return (
    <Form
      className="needs-validation"
      id="tooltipForm"
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit();
        return false;
      }}
    >
      <Row>
        <Col xs="12" md="3">
          <Label htmlFor="startNumber" className="mb-0">
            Iniciar secuencia
          </Label>
          <Input
            id="startNumber"
            name="startNumber"
            className={`form-control ${
              formik.errors.startNumber ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.startNumber}
          />
          {formik.errors.startNumber && (
            <div className="invalid-tooltip">{formik.errors.startNumber}</div>
          )}
        </Col>
        <Col xs="12" md="3">
          <Label htmlFor="endNumber" className="mb-0">
            Finalizar secuencia
          </Label>
          <Input
            id="endNumber"
            name="endNumber"
            className={`form-control ${
              formik.errors.endNumber ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.endNumber}
          />
          {formik.errors.endNumber && (
            <div className="invalid-tooltip">{formik.errors.endNumber}</div>
          )}
        </Col>
        <Col xs="12" md="3">
          <Label htmlFor="color" className="mb-0">
            Color
          </Label>
          <Select
            value={
              formik.values.color
                ? { value: formik.values.color, label: formik.values.color }
                : null
            }
            onChange={(value) => {
              formik.setFieldValue("color", value?.value ?? "");
            }}
            options={colorOpt}
            classNamePrefix="select2-selection"
            placeholder={SELECT_OPTION}
          />
          {formik.errors.color && (
            <div className="invalid-tooltip">{formik.errors.color}</div>
          )}
        </Col>
      </Row>
      <hr />
      {formik.isSubmitting ? (
        <ButtonsDisabled
          buttons={[
            {
              text: "Eliminar",
              color: "primary",
              className: "",
              loader: true,
            },
            {
              text: "Cancelar",
              color: "link",
              className: "text-danger",
              loader: false,
            },
          ]}
        />
      ) : (
        <div className="d-flex">
          <Button color="primary" type="submit" className="me-2">
            Eliminar
          </Button>
          <Button
            color="danger"
            type="button"
            className="me-2"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
        </div>
      )}
    </Form>
  );
};

export default FormBrazaleteDelete;
