import { setPositionsData, updateIsReadedPosition } from "./position.slice"
import { useAppDispatch, useAppSelector } from "../store";
import { IPosition } from "@/interfaces/Position.interface";
//===========================================================================================================

const usePosition = () => {
	const { positionsDataStore } = useAppSelector((state) => state.position);
	const dispatch = useAppDispatch();

	const setInitialPositions = (data: IPosition[]) => {
		dispatch(setPositionsData(data));
	};

	const updateStatusPosition = (data: number) => {
		dispatch(updateIsReadedPosition(data));
	};

	return {
		positionsDataStore,
		setInitialPositions,
		updateStatusPosition
	};
};

export default usePosition;