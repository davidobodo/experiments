import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CarouselMulti from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useRef } from "react";
import { useEffect } from "react";

function App() {
	const [content, setContent] = useState(1);

	const timeoutRef = useRef(null);

	const firstContent = useRef();
	const lastContent = useRef();

	useEffect(() => {
		if (content === 2) {
			const last_ = lastContent.current;
			const animLast = last_.getBoundingClientRect();

			const first = animFirst.current;
			const last = animLast;

			const deltaX = first.left - last.left;
			const deltaY = first.top - last.top;
			const deltaW = first.width / last.width;
			const deltaH = first.height / last.height;

			last_.animate(
				[
					{
						transformOrigin: "top left",
						transform: `
					translate(${deltaX}px, ${deltaY}px)
					scale(${deltaW}, ${deltaH})
				`,
					},
					{
						transformOrigin: "top left",
						transform: "none",
					},
				],
				{
					duration: 300,
					easing: "ease-in-out",
					fill: "both",
				}
			);
		}
	}, [lastContent.current, content]);

	return (
		<div className="tooltip-wrapper">
			<Tooltip
				initialContent={<div className="items one">FIRST CONTENT</div>}
				delayedContent={
					<div className="items two" ref={lastContent}>
						SECOND CONTENT THAT IS MEANT TO BE KIND OF LONG
					</div>
				}
			>
				<div className="main">HOVER ME</div>
			</Tooltip>
		</div>
	);
}

export default App;

function Tooltip({ delayedContent, initialContent, children }) {
	const [content, setContent] = React.useState(initialContent);
	const [shown, setShown] = React.useState("initial");
	const timeoutRef = useRef(null);
	const displayed = useRef(null);
	const [open, setOpen] = useState(false);
	const delay = 2000;

	let animFirst = useRef();

	const onOpen = () => {
		setOpen(true);
	};

	const onClose = () => {
		// setContent(initialContent);
		// setShown("initial");
		// if (timeoutRef.current) {
		// 	clearTimeout(timeoutRef.current);
		// }
	};

	useEffect(() => {
		if (displayed.current) {
			console.log("INSIDE HERE");
			const first = displayed.current.getBoundingClientRect();
			animFirst.current = first;
			timeoutRef.current = setTimeout(() => {
				setContent(delayedContent);
				setShown("delayed");
			}, delay);
		}
	}, [open]);

	useEffect(() => {
		if (shown === "delayed") {
			const first = animFirst.current;
			const last = displayed.current.getBoundingClientRect();

			const deltaX = first.left - last.left;
			const deltaY = first.top - last.top;
			const deltaW = first.width / last.width;
			const deltaH = first.height / last.height;

			displayed.current.animate(
				[
					{
						transformOrigin: "top left",
						transform: `
					translate(${deltaX}px, ${deltaY}px)
					scale(${deltaW}, ${deltaH})
				`,
					},
					{
						transformOrigin: "top left",
						transform: "none",
					},
				],
				{
					duration: 300,
					easing: "ease-in-out",
					fill: "both",
				}
			);
		}
	}, [shown]);

	return (
		<>
			<div onMouseEnter={onOpen} onMouseLeave={onClose} className="cta">
				{children}

				{open && (
					<div ref={displayed} className="flip">
						{content}
					</div>
				)}
			</div>
		</>
	);
}
