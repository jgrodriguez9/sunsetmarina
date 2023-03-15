import { useEffect } from "react";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CardBasic from "../../components/Common/CardBasic";
import CardMain from "../../components/Common/CardMain";
import DeleteDialog from "../../components/Common/DeleteDialog";
import FormFilter from "../../components/Common/FormFilter";
import TableLoader from "../../components/Loader/TablaLoader";
import CellActions from "../../components/Tables/CellActions";
import CellFormatEnable from "../../components/Tables/CellFormatEnable";
import Paginate from "../../components/Tables/Paginate";
import SimpleTable from "../../components/Tables/SimpleTable";
import { DELETE_SUCCESS, ERROR_SERVER } from "../../constants/messages";
import { deleteBoadType } from "../../helpers/catalogos/boadType";
import { addMessage } from "../../redux/messageSlice";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import { Country, State }  from 'country-state-city';
import DockImage from "../../components/Dock/DockImage";

function Dock(){      


    
    return (
        <>
          <div className="page-content">
            <Container fluid>
              {/* Render Breadcrumb */}
              <Breadcrumbs
                title={'Muelle'}
                breadcrumbItem={"Muelle"}
              />
              <Row className="pb-5">
                  <Col lg="12">
                    <CardMain
                        title="Muelle"
                        children={<DockImage />}
                    />                                          
                  </Col>
              </Row>  
            </Container>
          </div>
        </>
      );
  }
  
  export default withRouter(Dock)