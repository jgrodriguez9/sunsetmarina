import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useState } from "react";
import { Col, Label, Row } from "reactstrap";

export default function ObservationClient({formik, item}){
    const [obervation, setObservation] = useState(item?.observations ?? '')

    return (
        <Row>
            <Col xs="12" md="9">
                <Label htmlFor="address" className="mb-0">Observación</Label>
                <div className="w-100">
                    <CKEditor
                      editor={ClassicEditor}
                      data={obervation}
                      onChange={(event, editor) => {
                        setObservation(editor.getData())
                        formik.setFieldValue('observation', editor.getData())
                      }}
                    />
                </div>
            </Col> 
        </Row>
    )
}