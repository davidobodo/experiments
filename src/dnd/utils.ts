import { v4 as uuidv4 } from "uuid";

const samplstructure = [
	{
		label: "one",
		id: "1",
	},
	{
		label: "two",
		id: "2",
		children: [
			{
				label: "one",
				id: "2.1",
				path: [1],
			},
			{
				label: "two",
				id: "2.2",
				path: [1],
				children: [
					{
						label: "one",
						id: "2.1",
						path: [1, 2],
					},
				],
			},
		],
	},
	{
		label: "three",
		id: "3",
	},
];

const initialData = [
	{
		id: uuidv4(),
		label: `1`,
		type: "file",
	},
	{
		id: uuidv4(),
		label: `2`,
		type: "file",
	},
	{
		type: "folder",
		label: "3",
		id: uuidv4(),
		children: [
			{
				id: uuidv4(),
				label: `4`,
				type: "file",
			},
			{
				id: uuidv4(),
				label: `5`,
				type: "file",
			},
			// {
			// 	id: uuidv4(),
			// 	label: `6`,
			// 	type: "folder",
			// 	children: [
			// 		{
			// 			id: uuidv4(),
			// 			label: `7`,
			// 			type: "file",
			// 		},
			// 		{
			// 			id: uuidv4(),
			// 			label: `8`,
			// 			type: "file",
			// 		},
			// 	],
			// },
			{
				id: uuidv4(),
				label: `9`,
				type: "file",
			},
		],
	},
];

export { initialData };
