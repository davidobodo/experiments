import { UniqueIdentifier } from "@dnd-kit/core";
import type { FlattenedItem, TreeItem, TreeItems, SensorContext } from "./types";
import {
	closestCorners,
	getFirstCollision,
	KeyboardCode,
	KeyboardCoordinateGetter,
	DroppableContainer,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

const initialItems: TreeItem[] = [
	{
		id: "Home",
		children: [],
	},
	{
		id: "Collections",
		children: [
			{ id: "Spring", children: [] },
			{ id: "Summer", children: [] },
			{ id: "Fall", children: [] },
			{ id: "Winter", children: [] },
		],
	},
	{
		id: "About Us",
		children: [],
	},
	{
		id: "My Account",
		children: [
			{ id: "Addresses", children: [] },
			{ id: "Order History", children: [] },
		],
	},
];

export const iOS = /iPad|iPhone|iPod/.test(navigator.platform);

function getDragDepth(offset: number, indentationWidth: number) {
	return Math.round(offset / indentationWidth);
}

export function getProjection(
	items: FlattenedItem[],
	activeId: UniqueIdentifier,
	overId: UniqueIdentifier,
	dragOffset: number,
	indentationWidth: number
) {
	const overItemIndex = items.findIndex(({ id }) => id === overId);
	const activeItemIndex = items.findIndex(({ id }) => id === activeId);
	const activeItem = items[activeItemIndex];
	const newItems = arrayMove(items, activeItemIndex, overItemIndex);
	const previousItem = newItems[overItemIndex - 1];
	const nextItem = newItems[overItemIndex + 1];
	const dragDepth = getDragDepth(dragOffset, indentationWidth);
	const projectedDepth = activeItem.depth + dragDepth;
	const maxDepth = getMaxDepth({
		previousItem,
	});
	const minDepth = getMinDepth({ nextItem });
	let depth = projectedDepth;

	if (projectedDepth >= maxDepth) {
		depth = maxDepth;
	} else if (projectedDepth < minDepth) {
		depth = minDepth;
	}

	return { depth, maxDepth, minDepth, parentId: getParentId() };

	function getParentId() {
		if (depth === 0 || !previousItem) {
			return null;
		}

		if (depth === previousItem.depth) {
			return previousItem.parentId;
		}

		if (depth > previousItem.depth) {
			return previousItem.id;
		}

		const newParent = newItems
			.slice(0, overItemIndex)
			.reverse()
			.find((item) => item.depth === depth)?.parentId;

		return newParent ?? null;
	}
}

function getMaxDepth({ previousItem }: { previousItem: FlattenedItem }) {
	if (previousItem) {
		return previousItem.depth + 1;
	}

	return 0;
}

function getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
	if (nextItem) {
		return nextItem.depth;
	}

	return 0;
}

function flatten(items: TreeItems, parentId: UniqueIdentifier | null = null, depth = 0): FlattenedItem[] {
	return items.reduce<FlattenedItem[]>((acc, item, index) => {
		return [...acc, { ...item, parentId, depth, index }, ...flatten(item.children, item.id, depth + 1)];
	}, []);
}

export function flattenTree(items: TreeItems): FlattenedItem[] {
	return flatten(items);
}

export function buildTree(flattenedItems: FlattenedItem[]): TreeItems {
	const root: TreeItem = { id: "root", children: [] };
	const nodes: Record<string, TreeItem> = { [root.id]: root };
	const items = flattenedItems.map((item) => ({ ...item, children: [] }));

	for (const item of items) {
		const { id, children } = item;
		const parentId = item.parentId ?? root.id;
		const parent = nodes[parentId] ?? findItem(items, parentId);

		nodes[id] = { id, children };
		parent.children.push(item);
	}

	return root.children;
}

export function findItem(items: TreeItem[], itemId: UniqueIdentifier) {
	return items.find(({ id }) => id === itemId);
}

export function findItemDeep(items: TreeItems, itemId: UniqueIdentifier): TreeItem | undefined {
	for (const item of items) {
		const { id, children } = item;

		if (id === itemId) {
			return item;
		}

		if (children.length) {
			const child = findItemDeep(children, itemId);

			if (child) {
				return child;
			}
		}
	}

	return undefined;
}

export function removeItem(items: TreeItems, id: UniqueIdentifier) {
	const newItems = [];

	for (const item of items) {
		if (item.id === id) {
			continue;
		}

		if (item.children.length) {
			item.children = removeItem(item.children, id);
		}

		newItems.push(item);
	}

	return newItems;
}

export function setProperty<T extends keyof TreeItem>(
	items: TreeItems,
	id: UniqueIdentifier,
	property: T,
	setter: (value: TreeItem[T]) => TreeItem[T]
) {
	for (const item of items) {
		if (item.id === id) {
			item[property] = setter(item[property]);
			continue;
		}

		if (item.children.length) {
			item.children = setProperty(item.children, id, property, setter);
		}
	}

	return [...items];
}

function countChildren(items: TreeItem[], count = 0): number {
	return items.reduce((acc, { children }) => {
		if (children.length) {
			return countChildren(children, acc + 1);
		}

		return acc + 1;
	}, count);
}

export function getChildCount(items: TreeItems, id: UniqueIdentifier) {
	const item = findItemDeep(items, id);

	return item ? countChildren(item.children) : 0;
}

export function removeChildrenOf(items: FlattenedItem[], ids: UniqueIdentifier[]) {
	const excludeParentIds = [...ids];

	return items.filter((item) => {
		if (item.parentId && excludeParentIds.includes(item.parentId)) {
			if (item.children.length) {
				excludeParentIds.push(item.id);
			}
			return false;
		}

		return true;
	});
}
const directions: string[] = [KeyboardCode.Down, KeyboardCode.Right, KeyboardCode.Up, KeyboardCode.Left];

const horizontal: string[] = [KeyboardCode.Left, KeyboardCode.Right];

export const sortableTreeKeyboardCoordinates: (
	context: SensorContext,
	indicator: boolean,
	indentationWidth: number
) => KeyboardCoordinateGetter =
	(context, indicator, indentationWidth) =>
	(event, { currentCoordinates, context: { active, over, collisionRect, droppableRects, droppableContainers } }) => {
		if (directions.includes(event.code)) {
			if (!active || !collisionRect) {
				return;
			}

			event.preventDefault();

			const {
				current: { items, offset },
			} = context;

			if (horizontal.includes(event.code) && over?.id) {
				const { depth, maxDepth, minDepth } = getProjection(items, active.id, over.id, offset, indentationWidth);

				switch (event.code) {
					case KeyboardCode.Left:
						if (depth > minDepth) {
							return {
								...currentCoordinates,
								x: currentCoordinates.x - indentationWidth,
							};
						}
						break;
					case KeyboardCode.Right:
						if (depth < maxDepth) {
							return {
								...currentCoordinates,
								x: currentCoordinates.x + indentationWidth,
							};
						}
						break;
				}

				return undefined;
			}

			const containers: DroppableContainer[] = [];

			droppableContainers.forEach((container) => {
				if (container?.disabled || container.id === over?.id) {
					return;
				}

				const rect = droppableRects.get(container.id);

				if (!rect) {
					return;
				}

				switch (event.code) {
					case KeyboardCode.Down:
						if (collisionRect.top < rect.top) {
							containers.push(container);
						}
						break;
					case KeyboardCode.Up:
						if (collisionRect.top > rect.top) {
							containers.push(container);
						}
						break;
				}
			});

			const collisions = closestCorners({
				active,
				collisionRect,
				pointerCoordinates: null,
				droppableRects,
				droppableContainers: containers,
			});
			let closestId = getFirstCollision(collisions, "id");

			if (closestId === over?.id && collisions.length > 1) {
				closestId = collisions[1].id;
			}

			if (closestId && over?.id) {
				const activeRect = droppableRects.get(active.id);
				const newRect = droppableRects.get(closestId);
				const newDroppable = droppableContainers.get(closestId);

				if (activeRect && newRect && newDroppable) {
					const newIndex = items.findIndex(({ id }) => id === closestId);
					const newItem = items[newIndex];
					const activeIndex = items.findIndex(({ id }) => id === active.id);
					const activeItem = items[activeIndex];

					if (newItem && activeItem) {
						const { depth } = getProjection(
							items,
							active.id,
							closestId,
							(newItem.depth - activeItem.depth) * indentationWidth,
							indentationWidth
						);
						const isBelow = newIndex > activeIndex;
						const modifier = isBelow ? 1 : -1;
						const offset = indicator ? (collisionRect.height - activeRect.height) / 2 : 0;

						const newCoordinates = {
							x: newRect.left + depth * indentationWidth,
							y: newRect.top + modifier * offset,
						};

						return newCoordinates;
					}
				}
			}
		}

		return undefined;
	};

export { initialItems };
