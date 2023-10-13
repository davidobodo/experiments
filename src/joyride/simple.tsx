import { useRef, useState } from "react";
// import Joyride from "react-joyride";
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS, Step } from "react-joyride";
import { useMount, useSetState } from "react-use";

const Simple = () => {
	const firstref = useRef();
	const secondref = useRef();
	const thirdref = useRef();
	const fourthref = useRef();
	const fifthref = useRef();
	const sixthref = useRef();

	const [{ run, sidebarOpen, stepIndex, steps }, setState] = useSetState({
		run: false,
		sidebarOpen: false,
		stepIndex: 0,
		steps: [],
	});

	useMount(() => {
		// setRun(true);
		setState({
			run: true,
			steps: [
				{
					target: firstref.current,
					content: <div>Showing the first</div>,
					disableBeacon: true,
					disableOverlayClose: true,
					// hideCloseButton: true,
					// hideFooter: true,
					placement: "bottom",
					spotlightClicks: true,
					styles: {
						options: {
							zIndex: 10000,
						},
					},
				},
				{
					target: secondref.current,
					content: <div>Showing the second</div>,
				},
				{
					target: thirdref.current,
					content: <div>Showing the third</div>,
				},
				{
					target: fourthref.current,
					content: <div>Showing the fourth</div>,
				},
				{
					target: fifthref.current,
					content: <div>Showing the fifth</div>,
				},
				{
					target: sixthref.current,
					content: <div>Showing the sixth</div>,
				},
			],
		});
	});

	const handleJoyrideCallback = (data: CallBackProps) => {
		const { action, index, status, type } = data;

		if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
			// Need to set our running state to false, so we can restart if we click start again.
			setState({ run: false, stepIndex: 0 });
		} else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
			const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

			if (sidebarOpen && index === 0) {
				setState({ run: true });
			} else if (sidebarOpen && index === 1) {
				setState({
					run: false,
					sidebarOpen: false,
					stepIndex: nextStepIndex,
				});

				setState({ run: true });
			} else if (index === 2 && action === ACTIONS.PREV) {
				setState({
					run: false,
					sidebarOpen: true,
					stepIndex: nextStepIndex,
				});

				setState({ run: true });
			} else {
				// Update state to advance the tour
				setState({
					sidebarOpen: false,
					stepIndex: nextStepIndex,
				});
			}
		}
	};
	return (
		<div>
			<Joyride
				steps={steps}
				stepIndex={stepIndex}
				callback={handleJoyrideCallback}
				run={run}
				continuous
				scrollToFirstStep
				showProgress
				showSkipButton
			/>
			<div ref={firstref} style={{ display: "inline-flex" }} onClick={() => console.log("IT DID OPEN UP HERE")}>
				First element
			</div>
			<div ref={secondref}>Second element</div>
			<div ref={thirdref}>Third element</div>
			<div ref={fourthref}>Fourth element</div>
			<div ref={fifthref}>Fifth element</div>
			<div ref={sixthref}>Sixth element</div>
		</div>
	);
};

export default Simple;
