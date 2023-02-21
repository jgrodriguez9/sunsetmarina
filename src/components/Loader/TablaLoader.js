import { Table } from "reactstrap";

export default function TableLoader({columns}){


    return (
        <div className="table-responsive">
            <div className="react-bootstrap-table table-responsive">
                <Table className="align-middle table-nowrap table-bordered">
                    <thead className="table-light table-nowrap">
                        <tr>
                            {
                                columns.map((column) => (
                                    <th key={column.name} style={{width: column.width}}>{column.name}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {
                                columns.map((column, index) => (
                                    <td key={`${column.name}_${index}_t1`}>
                                        <span className="placeholder-glow w-100">
                                            <span className="placeholder w-100"></span>
                                        </span>
                                    </td>
                                ))
                            }
                        </tr>
                        <tr>
                            {
                                columns.map((column, index) => (
                                    <td key={`${column.name}_${index}_t2`}>
                                        <span className="placeholder-glow w-100">
                                            <span className="placeholder w-100"></span>
                                        </span>
                                    </td>
                                ))
                            }
                        </tr>
                        <tr>
                            {
                                columns.map((column, index) => (
                                    <td key={`${column.name}_${index}_t3`}>
                                        <span className="placeholder-glow w-100">
                                            <span className="placeholder w-100"></span>
                                        </span>
                                    </td>
                                ))
                            }
                        </tr>
                        <tr>
                            {
                                columns.map((column, index) => (
                                    <td key={`${column.name}_${index}_t4`}>
                                        <span className="placeholder-glow w-100">
                                            <span className="placeholder w-100"></span>
                                        </span>
                                    </td>
                                ))
                            }
                        </tr>
                        <tr>
                            {
                                columns.map((column, index) => (
                                    <td key={`${column.name}_${index}_t5`}>
                                        <span className="placeholder-glow w-100">
                                            <span className="placeholder w-100"></span>
                                        </span>
                                    </td>
                                ))
                            }
                        </tr>
                        <tr>
                            {
                                columns.map((column, index) => (
                                    <td key={`${column.name}_${index}_t6`}>
                                        <span className="placeholder-glow w-100">
                                            <span className="placeholder w-100"></span>
                                        </span>
                                    </td>
                                ))
                            }
                        </tr>
                        <tr>
                            {
                                columns.map((column, index) => (
                                    <td key={`${column.name}_${index}_t7`}>
                                        <span className="placeholder-glow w-100">
                                            <span className="placeholder w-100"></span>
                                        </span>
                                    </td>
                                ))
                            }
                        </tr>
                        <tr>
                            {
                                columns.map((column, index) => (
                                    <td key={`${column.name}_${index}_t8`}>
                                        <span className="placeholder-glow w-100">
                                            <span className="placeholder w-100"></span>
                                        </span>
                                    </td>
                                ))
                            }
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
        
    )

}