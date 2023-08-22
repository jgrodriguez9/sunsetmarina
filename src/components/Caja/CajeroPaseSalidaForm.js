import CardMain from '../Common/CardMain';
import FormBoardingPass from './BoardingPass/FormBoardingPass';

const CajeroPaseSalidaForm = () => {
	return (
		<CardMain
			title="Crear Pase de Salida"
			children={<FormBoardingPass cajero={true} />}
		/>
	);
};

export default CajeroPaseSalidaForm;
