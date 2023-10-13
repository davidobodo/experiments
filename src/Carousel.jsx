import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CarouselMulti from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useRef } from "react";
import { useEffect } from "react";

function App() {
	const [count, setCount] = useState(0);

	const props = {
		// infinite: infinite,
		// ref: sliderRef,
		responsive: {
			desktop: {
				breakpoint: {
					max: 3000,
					min: 1024,
				},
				items: 3,
				partialVisibilityGutter: 60,
			},
			tablet: {
				breakpoint: {
					max: 1024,
					min: 464,
				},
				items: 2,
				partialVisibilityGutter: 30,
			},
			mobile: {
				breakpoint: {
					max: 464,
					min: 0,
				},
				items: 1,
				partialVisibilityGutter: 50,
			},
		},
	};

	return (
		<div className="app">
			{/* 		
			<Tooltip
				initialContent={<div className="items one">FIRST CONTENT</div>}
				delayedContent={
					<div className="items two" ref={lastContent}>
						SECOND CONTENT THAT IS MEANT TO BE KIND OF LONG
					</div>
				}
			>
				<div className="main">HOVER ME</div>
			</Tooltip> */}
			<div className="wrapper">
				<div className="container">
					<CarouselMulti ssr {...props} itemClass="image-item" partialVisbile={false}>
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((item) => {
							return <div className="box">{item}</div>;
						})}
					</CarouselMulti>
				</div>
			</div>
		</div>
	);
}

export default App;
