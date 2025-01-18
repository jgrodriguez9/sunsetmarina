import { Badge } from 'reactstrap';
import { getMonth } from '../../../utils/getMonth';
import { numberFormat } from '../../../utils/numberFormat';
import { classBadge } from '../../../utils/classBadge';
import translateUtils from '../../../utils/translateUtils';

const TableCharges = ({ items }) => {
	return (
		<div className="table-responsive">
			<table className="table table-nowrap align-middle mb-0">
				<thead>
					<tr>
						<th style={{ width: '15%' }}>Período</th>
						<th style={{ width: '20%' }}>Estado</th>
						<th style={{ width: '20%' }}>Precio diario</th>
						<th style={{ width: '15%' }}>Interés</th>
						<th style={{ width: '15%' }}>Monto actual</th>
						<th style={{ width: '15%' }}>Monto mensual</th>
					</tr>
				</thead>
				<tbody>
					{items.map((it) => (
						<tr key={it.id}>
							<td>
								{getMonth(parseInt(it.monthYear.split('-')[1]))}{' '}{it.monthYear.split('-')[0]}
							</td>
							<td>
								<Badge
									className={
										'font-size-12 badge-soft-' +
										classBadge(it.status)
									}
									color={classBadge(it.status)}
									pill
								>
									{translateUtils(it.status)}
								</Badge>
							</td>
							<td>{numberFormat(it.price)}</td>
							<td>{numberFormat(it.interest)}</td>
							<td>{numberFormat(it.amount)}</td>
							<td>{numberFormat(it.totalMonth)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TableCharges;
