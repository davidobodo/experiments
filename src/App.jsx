import React from "react";
import "./App.css";
import Story from "./joyride";
import Simple from "./joyride/simple";
import { Link, Outlet, useLocation } from "react-router-dom";

function App() {
	return (
		<div className="app">
			<Outlet />
		</div>
	);
}

export default App;
