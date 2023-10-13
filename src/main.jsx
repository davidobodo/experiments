import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Story from "./joyride";
import Simple from "./joyride/simple";
import Dnd from "./dnd";
import Dnd2 from "./dnd2";
import Dnd3 from "./dnd3";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/story",
				element: <Story />,
			},
			{
				path: "/simple",
				element: <Simple />,
			},
			{
				path: "/dnd",
				element: <Dnd />,
			},
			{
				path: "/dnd3",
				element: <Dnd3 />,
			},
			{
				path: "/dnd2",
				element: (
					<DndProvider backend={HTML5Backend}>
						<Dnd2 />
					</DndProvider>
				),
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<>
		<RouterProvider router={router} />
	</>
);
