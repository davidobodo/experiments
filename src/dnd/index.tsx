import React from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BaseItem } from "./BaseItem";
import { initialData } from "./utils";

const Dnd = () => {
	const [lastFileIndex, setLastFileIndex] = React.useState(8);
	const [lastFolderIndex, setLastFolderIndex] = React.useState(3);
	const [data, setData] = React.useState(initialData);

	const onAddItem = () => {
		setData([
			...data,
			{
				id: uuidv4(),
				label: `${lastFileIndex + 1}${lastFileIndex + 1}-file`,
				type: "file",
			},
		]);
		setLastFileIndex((prev) => prev + 1);
	};

	const onAddNesting = () => {
		const payload = {
			type: "folder",
			label: `${lastFolderIndex + 1}${lastFolderIndex + 1}-folder`,
			id: uuidv4(),
			children: [],
		};
		setData([...data, payload]);
		setLastFolderIndex((prev) => prev + 1);
	};

	const handleDragEnd = (result, provided) => {
		// Dropped outside the list
		if (!result.destination) {
			return;
		}

		const { destination, source, type, draggableId } = result;

		// console.log(result);
		console.log(source.droppableId, destination.droppableId, "====DROPPPD");
		// Moving within root
		if (source.droppableId === destination.droppableId) {
			// const state = JSON.parse(JSON.stringify(data));
			// // 1: get source
			// const sourceItem = state[source.index];
			// // remove source
			// state.splice(source.index, 1);
			// // Readd it to the new position
			// state.splice(destination.index, 0, sourceItem);
			// setData(state);
			// return;
		}
	};

	const getItemStyle = (isDragging, draggableStyle) => ({
		// some basic styles to make the items look a bit nicer
		userSelect: "none",
		// padding: grid * 2,
		// margin: `0 0 ${grid}px 0`,

		// change background colour if dragging
		background: isDragging ? "lightgreen" : "grey",

		// styles we need to apply on draggables
		...draggableStyle,
	});

	const getListStyle = (isDraggingOver) => ({
		background: isDraggingOver ? "lightblue" : "transparent",
		// padding: grid,
		width: 250,
	});

	const handleDragStart = (e) => {
		console.log(e, "===TEH EVENT");
	};
	return (
		<div className="dnd-wrapper">
			<DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
				<Droppable droppableId="list" type="list">
					{(provided, snapshot) => {
						return (
							<div {...provided.droppableProps} ref={provided.innerRef} style={{ ...getListStyle(snapshot.isDraggingOver) }}>
								{data.map((item, i) => {
									const { id, label, type, children } = item;

									return (
										<Draggable key={id} draggableId={id?.toString()} index={i}>
											{(provided, snapshot) => {
												return (
													<div ref={provided.innerRef} {...provided.draggableProps}>
														<div
															{...provided.dragHandleProps}
															style={{ width: "20px", height: "20px", backgroundColor: "black" }}
														></div>

														{type === "file" ? (
															<div className="dnd-file">{label}</div>
														) : (
															<BaseItem key={id} label={label} type={type} children={children} idx={i} id={id} />
														)}
													</div>
												);
											}}
										</Draggable>
									);
								})}
								{provided.placeholder}
							</div>
						);
					}}
				</Droppable>
			</DragDropContext>

			<div style={{ display: "flex", gap: "10px" }}>
				<button onClick={onAddItem}>Add Item</button>
				<button onClick={onAddNesting}>Add Nesting</button>
			</div>
		</div>
	);
};

export default Dnd;
