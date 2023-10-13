import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { uuid } from "uuidv4";
import { v4 as uuidv4 } from "uuid";

export function BaseItem({ type, label, children, idx, id }) {
	const getListStyle = (isDraggingOver) => ({
		background: isDraggingOver ? "lightblue" : "transparent",
		// padding: grid,
	});

	return (
		<Droppable droppableId={label} type="list">
			{(provided, snapshot) => {
				return (
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						className="dnd-folder"
						style={{ ...getListStyle(snapshot.isDraggingOver) }}
					>
						<div className="title">{label}</div>
						{children?.map((item, i) => {
							return (
								<Draggable key={item.id} draggableId={item.id.toString()} index={i}>
									{(provided, snapshot) => {
										// const _path = path ? path + "," + idx : idx;

										return (
											<div ref={provided.innerRef} {...provided.draggableProps}>
												<div
													{...provided.dragHandleProps}
													style={{ width: "20px", height: "20px", backgroundColor: "black" }}
												></div>
												{item.type === "file" ? (
													<div className="dnd-file">{item.label}</div>
												) : (
													<BaseItem
														key={item.id}
														label={item.label}
														type={item.type}
														children={item.children}
														id={item.id}
														idx={i}
													/>
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
	);
}
