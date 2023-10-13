import React from "react";
import { useDrag } from "react-dnd";

const Dnd2 = () => {
	return (
		<div>
			<div className="body">
				<div className="sideBar">
					{Object.values(SIDEBAR_ITEMS).map((sideBarItem, index) => (
						<SideBarItem key={sideBarItem.id} data={sideBarItem} />
					))}
				</div>
				<div className="pageContainer">
					<div className="page">
						{layout.map((row, index) => {
							const currentPath = `${index}`;

							return (
								<React.Fragment key={row.id}>
									<DropZone
										data={{
											path: currentPath,
											childrenCount: layout.length,
										}}
										onDrop={handleDrop}
										path={currentPath}
									/>
									{renderRow(row, currentPath)}
								</React.Fragment>
							);
						})}

						<DropZone
							data={{
								path: `${layout.length}`,
								childrenCount: layout.length,
							}}
							onDrop={handleDrop}
							isLast
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dnd2;

function SideBarItem({ data }) {
	const [{ opacity }, drag] = useDrag({
		item: data,
		collect: (monitor) => {
			return {
				opacity: monitor.isDragging() ? 0.4 : 1,
			};
		},
	});

	return (
		<div className="sideBarItem" ref={drag} style={{ opacity }}>
			{data.component.type}
		</div>
	);
}
