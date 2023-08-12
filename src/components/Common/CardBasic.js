import classNames from "classnames";
import { useState } from "react";
import { Card, CardBody, Collapse } from "reactstrap";

export default function CardBasic({ title, children, initOpen = true }) {
  const [accordionSearch, setAccordionSearch] = useState(initOpen);

  return (
    <Card>
      <CardBody className="p-0">
        <div className="accordion">
          <div className="accordion-item rounded-0">
            {title && (
              <h2 className="accordion-header">
                <button
                  className={classNames("accordion-button p-2", "fw-medium", {
                    collapsed: !accordionSearch,
                  })}
                  type="button"
                  onClick={() => setAccordionSearch(!accordionSearch)}
                  style={{ cursor: "pointer" }}
                >
                  {title}
                </button>
              </h2>
            )}

            <Collapse isOpen={accordionSearch} className="accordion-collapse">
              <div className="accordion-body">{children}</div>
            </Collapse>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
